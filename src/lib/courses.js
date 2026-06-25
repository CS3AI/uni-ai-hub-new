import seed from "@/data/courses.json";
import { fetchPublishedSheet } from "./sheet";

/**
 * Courses 数据：默认用 data/courses.json 里的精选示例。
 * 如果配置了 COURSES_SHEET_URL（发布为 CSV 的 Google Sheet），
 * 则用表格里的行去"追加"到对应分类，方便社团成员无代码更新。
 *
 * Google Sheet 建议列：category(university/company/competition), group, code, title, url, level, format, host, type, audience
 */
export async function getCoursesData() {
  const sheetRows = await fetchPublishedSheet(process.env.COURSES_SHEET_URL, {
    revalidate: 600,
  });

  if (!sheetRows || sheetRows.length === 0) {
    return seed;
  }

  const data = JSON.parse(JSON.stringify(seed));

  for (const row of sheetRows) {
    const category = (row.category || "").toLowerCase();
    if (category === "university") {
      let group = data.universities.find((u) => u.name === row.group);
      if (!group) {
        group = { name: row.group, courses: [] };
        data.universities.push(group);
      }
      group.courses.push({
        code: row.code,
        title: row.title,
        url: row.url,
        level: row.level,
        format: row.format,
      });
    } else if (category === "company") {
      let group = data.companies.find((c) => c.name === row.group);
      if (!group) {
        group = { name: row.group, programs: [] };
        data.companies.push(group);
      }
      group.programs.push({ title: row.title, url: row.url, format: row.format });
    } else if (category === "competition") {
      data.competitions.push({
        name: row.title,
        host: row.host,
        url: row.url,
        type: row.type,
        audience: row.audience,
      });
    }
  }

  data.lastUpdated = new Date().toISOString().slice(0, 10);
  data.note = "内容来自社团维护的 Google Sheet，实时同步。";
  return data;
}
