import { FEEDS } from "./feeds";
import { fetchFeed } from "./rss";
import { classify } from "./taxonomy";

/**
 * 实时拉取 Information 信息流：聚合所有 RSS/Atom 源，去重、打标签、按时间排序。
 * 用 Next.js 的 fetch 缓存（revalidate）控制刷新频率，避免每次访问都打爆源站。
 */
export async function getInformationFeed({ revalidate = 1800, limit = 60 } = {}) {
  const results = await Promise.all(
    FEEDS.map(async (feed) => {
      const items = await fetchFeed(feed.url, { revalidate });
      return items.map((item) => ({
        ...item,
        source: feed.name,
        sourceType: feed.sourceType,
        tags: classify(`${item.title} ${item.summary}`),
      }));
    })
  );

  const merged = results.flat();

  const seen = new Set();
  const deduped = merged.filter((item) => {
    const key = item.link || item.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  deduped.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  return deduped.slice(0, limit);
}
