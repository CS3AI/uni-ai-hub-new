import seed from "@/data/courses.json";
import { fetchPublishedSheet } from "./sheet";

/**
 * Courses data: defaults to data/courses.json curated content.
 * If COURSES_SHEET_URL is configured (published Google Sheet CSV),
 * sheet rows are merged into the relevant category.
 *
 * Google Sheet columns: category(university/company/lecture), group, code, title,
 *   url, level, format, speaker, org, topic
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
    } else if (category === "lecture") {
      data.lectures.push({
        name: row.title,
        speaker: row.speaker,
        org: row.org,
        url: row.url,
        topic: row.topic,
        level: row.level,
        format: row.format,
      });
    }
  }

  data.lastUpdated = new Date().toISOString().slice(0, 10);
  data.note = "Content synced from club-maintained Google Sheet.";
  return data;
}
