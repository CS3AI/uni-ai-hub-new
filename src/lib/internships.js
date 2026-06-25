import { INTERNSHIP_SOURCES, AI_KEYWORDS } from "./feeds";

async function fetchListings(url, revalidate) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "UniAIHub/1.0 (+highschool AI club aggregator)" },
      next: { revalidate },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("fetchListings failed:", url, err.message);
    return [];
  }
}

function isAiRelated(title = "") {
  const lower = title.toLowerCase();
  return AI_KEYWORDS.some((kw) => lower.includes(kw.trim()));
}

/**
 * 实时拉取实习清单：来自 GitHub 上由学生社区每天自动更新的开源实习数据库（免 API key）。
 * 这是真实数据，不是占位示例；只是默认按 AI/ML 关键词做了一层筛选。
 */
export async function getInternshipListings({ revalidate = 21600, limit = 80, aiOnly = true } = {}) {
  const results = await Promise.all(
    INTERNSHIP_SOURCES.map((src) => fetchListings(src.url, revalidate))
  );

  const merged = results.flat().map((item) => ({
    id: item.id || `${item.company_name}-${item.title}-${item.url}`,
    company: item.company_name || item.company || "未知公司",
    title: item.title || "Internship",
    locations: item.locations || (item.location ? [item.location] : []),
    url: item.url || item.application_link || "",
    datePosted: item.date_posted ? new Date(item.date_posted * 1000).toISOString() : null,
    terms: item.terms || [],
    active: item.active !== false && item.is_visible !== false,
  }));

  const seen = new Set();
  let deduped = merged.filter((item) => {
    if (!item.url) return false;
    const key = item.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return item.active;
  });

  if (aiOnly) {
    deduped = deduped.filter((item) => isAiRelated(item.title));
  }

  deduped.sort((a, b) => {
    const da = a.datePosted ? new Date(a.datePosted).getTime() : 0;
    const db = b.datePosted ? new Date(b.datePosted).getTime() : 0;
    return db - da;
  });

  return deduped.slice(0, limit);
}
