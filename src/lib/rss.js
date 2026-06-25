import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

function pick(obj, ...keys) {
  for (const k of keys) {
    if (obj && obj[k] != null) return obj[k];
  }
  return "";
}

function textOf(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value["#text"] != null) return String(value["#text"]);
    if (value["@_href"] != null) return String(value["@_href"]);
  }
  return String(value);
}

/**
 * 解析一段 RSS 2.0 或 Atom 的 XML 文本，统一转成
 * { title, link, pubDate, summary }[] 的数组。
 */
export function parseFeedXml(xml) {
  const data = parser.parse(xml);
  const rssItems = data?.rss?.channel?.item;
  const atomEntries = data?.feed?.entry;

  const items = rssItems ?? atomEntries ?? [];
  const list = Array.isArray(items) ? items : [items];

  return list
    .filter(Boolean)
    .map((item) => {
      const title = textOf(pick(item, "title"));
      let link = textOf(pick(item, "link", "id"));
      if (typeof item.link === "object" && Array.isArray(item.link)) {
        const alt = item.link.find((l) => l["@_rel"] === "alternate") || item.link[0];
        link = textOf(alt);
      }
      const pubDateRaw = pick(item, "pubDate", "published", "updated", "dc:date");
      const summary = textOf(pick(item, "description", "summary", "content"));
      const pubDate = pubDateRaw ? new Date(textOf(pubDateRaw)) : null;
      return {
        title: title.trim(),
        link: link.trim(),
        pubDate: pubDate && !isNaN(pubDate) ? pubDate.toISOString() : null,
        summary: summary.replace(/<[^>]+>/g, "").trim().slice(0, 280),
      };
    })
    .filter((i) => i.title);
}

export async function fetchFeed(url, { revalidate = 1800 } = {}) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "UniAIHub/1.0 (+highschool AI club aggregator)" },
      next: { revalidate },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseFeedXml(xml);
  } catch (err) {
    console.error("fetchFeed failed:", url, err.message);
    return [];
  }
}
