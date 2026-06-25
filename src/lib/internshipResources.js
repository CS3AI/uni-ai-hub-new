import seed from "@/data/internshipResources.json";
import { fetchPublishedSheet } from "./sheet";

/**
 * 内推机会 / 简历模板 / Timeline 看板的数据。
 * 配置 INTERNSHIP_SHEET_URL（发布为 CSV 的 Google Sheet）后，
 * 表格的行会追加到 referralOpportunities 里，社团成员随时可以加新公司/新内推信息。
 * 建议列：company, note, url
 */
export async function getInternshipResources() {
  const sheetRows = await fetchPublishedSheet(process.env.INTERNSHIP_SHEET_URL, {
    revalidate: 600,
  });

  if (!sheetRows || sheetRows.length === 0) return seed;

  const data = JSON.parse(JSON.stringify(seed));
  for (const row of sheetRows) {
    if (row.company) {
      data.referralOpportunities.push({ company: row.company, note: row.note, url: row.url });
    }
  }
  return data;
}
