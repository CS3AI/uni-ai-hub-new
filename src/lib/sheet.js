/**
 * 让没有技术背景的社团成员也能"实时"更新 Courses / Internship 内容：
 * 在环境变量里配置一个已发布为 CSV 的 Google Sheet 链接，网站会优先读取表格内容；
 * 没配置时，自动回退到本地 JSON 种子数据（data/ 目录下），保证网站始终能正常显示。
 *
 * 怎么发布 Google Sheet 为 CSV：
 *   Google Sheet → 文件 → 共享 → 发布到网络 → 选择对应工作表 → 格式选 CSV → 复制链接
 *   把链接填到 .env.local 里对应的变量（见 README）
 */
export async function fetchPublishedSheet(envUrl, { revalidate = 600 } = {}) {
  if (!envUrl) return null;
  try {
    const res = await fetch(envUrl, { next: { revalidate } });
    if (!res.ok) return null;
    const csv = await res.text();
    return parseCsv(csv);
  } catch (err) {
    console.error("fetchPublishedSheet failed:", err.message);
    return null;
  }
}

// 极简 CSV 解析器：够用于 Google Sheet 发布的简单表格，支持引号内逗号/换行。
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const filtered = rows.filter((r) => r.some((cell) => cell.trim() !== ""));
  if (filtered.length === 0) return [];
  const [header, ...body] = filtered;
  return body.map((r) =>
    Object.fromEntries(header.map((h, idx) => [h.trim(), (r[idx] ?? "").trim()]))
  );
}
