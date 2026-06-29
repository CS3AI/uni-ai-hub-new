"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ALL_TAGS, SOURCE_TYPES } from "@/lib/taxonomy";
import Tag from "@/components/Tag";

const LANG_MAP = { zh: "zh-CN", fr: "fr", es: "es", de: "de", ja: "ja", ru: "ru", ko: "ko" };
const PAPER_SOURCE = "preprint";
const HIGH_QUALITY_SOURCES = ["industry-lab", "gov-research", "preprint"];
const PAGE_SIZE = 10;

// Colors for sourceType badges
const SOURCE_BADGE_COLORS = {
  "preprint":      "bg-blue-100 text-blue-700",
  "gov-research":  "bg-green-100 text-green-700",
  "industry-lab":  "bg-purple-100 text-purple-700",
  "dev-community": "bg-orange-100 text-orange-700",
  "vc-media":      "bg-pink-100 text-pink-700",
};

async function translateOne(title, tl, signal) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(title)}`;
  const r = await fetch(url, { signal });
  const data = await r.json();
  return data[0]?.map((c) => c[0]).join("") || title;
}

function formatDate(iso, locale) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}

function pickFeatured(items, n = 5) {
  const scored = items
    .filter((item) => item.tags?.length > 0)
    .map((item) => {
      let score = 0;
      if (HIGH_QUALITY_SOURCES.includes(item.sourceType)) score += 3;
      if (item.pubDate) {
        const age = Date.now() - new Date(item.pubDate).getTime();
        if (age < 86400000 * 3) score += 2;
        else if (age < 86400000 * 7) score += 1;
      }
      if (item.tags?.length >= 2) score += 1;
      return { item, score };
    });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, n).map((s) => s.item);
}

function Paginator({ page, total, pageSize, onPage }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  const range = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div className="flex flex-wrap justify-center gap-1.5 mt-6">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg text-xs font-medium card-surface text-muted disabled:opacity-30"
      >
        ‹
      </button>
      {range.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
            page === p ? "brand-gradient text-white" : "card-surface text-muted hover:text-foreground"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPage(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="px-3 py-1.5 rounded-lg text-xs font-medium card-surface text-muted disabled:opacity-30"
      >
        ›
      </button>
    </div>
  );
}

export default function InformationFeed({ items }) {
  const t = useTranslations("information");
  const st = useTranslations("sourceTypes");
  const tg = useTranslations("tags");
  const locale = useLocale();
  const tl = LANG_MAP[locale];

  const [activeTag, setActiveTag] = useState(null);
  const [activeSource, setActiveSource] = useState(null);
  const [page, setPage] = useState(1);
  const [translatedTitles, setTranslatedTitles] = useState({});

  // Only show source chips that have at least 1 article (excluding preprint)
  const availableSources = useMemo(() =>
    SOURCE_TYPES.filter((s) => s.id !== PAPER_SOURCE && items.some((item) => item.sourceType === s.id)),
    [items]
  );

  // Only show tag chips that have at least 1 article
  const availableTags = useMemo(() =>
    ALL_TAGS.filter((tag) => items.some((item) => item.tags?.includes(tag.id))),
    [items]
  );

  useEffect(() => {
    if (!tl) { setTranslatedTitles({}); return; }
    const controller = new AbortController();
    const titles = [...new Set(items.map((i) => i.title).filter(Boolean))];
    const BATCH = 10;
    async function run() {
      for (let i = 0; i < titles.length; i += BATCH) {
        if (controller.signal.aborted) break;
        const chunk = titles.slice(i, i + BATCH);
        const results = await Promise.all(
          chunk.map((t) => translateOne(t, tl, controller.signal).catch(() => t))
        );
        if (!controller.signal.aborted) {
          setTranslatedTitles((prev) => {
            const next = { ...prev };
            chunk.forEach((orig, j) => { next[orig] = results[j]; });
            return next;
          });
        }
      }
    }
    run();
    return () => controller.abort();
  }, [locale, items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (activeTag && !item.tags?.includes(activeTag)) return false;
      if (activeSource && item.sourceType !== activeSource) return false;
      return true;
    });
  }, [items, activeTag, activeSource]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [activeTag, activeSource]);

  const featured = useMemo(() => pickFeatured(items), [items]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const sourceTypeLabel = (sourceType) => {
    const found = SOURCE_TYPES.find((s) => s.id === sourceType);
    return found ? st(found.id) : null;
  };

  const tr = (title) => translatedTitles[title] || title;

  return (
    <div>
      {/* Featured / Hot section */}
      {featured.length > 0 && !activeTag && !activeSource && (
        <div className="mb-8 rounded-2xl border border-red-100 bg-red-50/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-3">
            Featured Picks
          </p>
          <ol className="space-y-2">
            {featured.map((item, idx) => (
              <li key={item.link || idx} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-red-500 text-white text-[11px] font-black flex items-center justify-center leading-none mt-0.5">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold leading-snug hover:text-red-600 transition-colors"
                  >
                    {tr(item.title)}
                  </a>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-muted font-medium">{item.source}</span>
                    {item.pubDate && (
                      <span className="text-[10px] text-muted">· {formatDate(item.pubDate, locale)}</span>
                    )}
                    {item.tags?.slice(0, 2).map((tagId) => {
                      const found = ALL_TAGS.find((t) => t.id === tagId);
                      return found ? (
                        <Tag key={tagId} className="text-[9px] py-0">{tg(tagId)}</Tag>
                      ) : null;
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Source filter — only show chips with data */}
      {availableSources.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <FilterChip active={!activeSource} onClick={() => setActiveSource(null)}>
            {t("allSources")}
          </FilterChip>
          {availableSources.map((s) => (
            <FilterChip
              key={s.id}
              active={activeSource === s.id}
              onClick={() => setActiveSource(activeSource === s.id ? null : s.id)}
            >
              {st(s.id)}
            </FilterChip>
          ))}
        </div>
      )}

      {/* Topic filter — only show chips with data */}
      {availableTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <FilterChip active={!activeTag} onClick={() => setActiveTag(null)} subtle>
            {t("allTopics")}
          </FilterChip>
          {availableTags.map((tag) => (
            <FilterChip
              key={tag.id}
              active={activeTag === tag.id}
              onClick={() => setActiveTag(activeTag === tag.id ? null : tag.id)}
              subtle
            >
              {tg(tag.id)}
            </FilterChip>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">{t("empty")}</p>
      ) : (
        <>
          <p className="mb-3 text-xs text-muted">{filtered.length} items</p>
          <ul className="space-y-3">
            {paged.map((item, idx) => {
              const isPaper = item.sourceType === PAPER_SOURCE;
              const badgeColor = SOURCE_BADGE_COLORS[item.sourceType] || "bg-gray-100 text-gray-600";
              return (
                <li
                  key={item.link || idx}
                  className={`card-surface rounded-xl p-4 ${isPaper ? "border-l-2 border-l-blue-400" : ""}`}
                >
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-1.5">
                      <span className="font-medium text-brand-end">{item.source}</span>
                      {item.pubDate && <span>· {formatDate(item.pubDate, locale)}</span>}
                      {item.sourceType && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeColor}`}>
                          {sourceTypeLabel(item.sourceType)}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-base font-semibold leading-snug ${isPaper ? "text-blue-900" : ""}`}>
                      {tr(item.title)}
                    </h3>
                    {item.summary && (
                      <p className={`mt-1 text-sm text-muted ${isPaper ? "line-clamp-3" : "line-clamp-2"}`}>
                        {item.summary}
                      </p>
                    )}
                    {item.tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 4).map((tagId) => {
                          const found = ALL_TAGS.find((t) => t.id === tagId);
                          return found ? <Tag key={tagId}>{tg(tagId)}</Tag> : null;
                        })}
                      </div>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
          <Paginator page={page} total={filtered.length} pageSize={PAGE_SIZE} onPage={setPage} />
        </>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children, subtle }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? "brand-gradient text-white"
          : subtle
          ? "bg-background text-muted hover:text-foreground"
          : "card-surface text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
