"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ALL_TAGS, SOURCE_TYPES } from "@/lib/taxonomy";
import Tag from "@/components/Tag";

const LANG_MAP = { zh: "zh-CN", fr: "fr", es: "es", de: "de", ja: "ja", ru: "ru", ko: "ko" };

// Source types that are considered "news" vs "papers"
const PAPER_SOURCE = "preprint";
const HIGH_QUALITY_SOURCES = ["industry-lab", "gov-research", "preprint"];

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

// Pick top featured items: high-quality sources, most recent, must have tags
function pickFeatured(items, n = 5) {
  const scored = items
    .filter((item) => item.tags?.length > 0)
    .map((item) => {
      let score = 0;
      if (HIGH_QUALITY_SOURCES.includes(item.sourceType)) score += 3;
      if (item.pubDate) {
        const age = Date.now() - new Date(item.pubDate).getTime();
        if (age < 86400000 * 3) score += 2; // < 3 days
        else if (age < 86400000 * 7) score += 1; // < 7 days
      }
      if (item.tags?.length >= 2) score += 1;
      return { item, score };
    });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, n).map((s) => s.item);
}

export default function InformationFeed({ items }) {
  const t = useTranslations("information");
  const st = useTranslations("sourceTypes");
  const tg = useTranslations("tags");
  const locale = useLocale();
  const tl = LANG_MAP[locale];

  const [activeTag, setActiveTag] = useState(null);
  const [activeSource, setActiveSource] = useState(null);
  const [contentMode, setContentMode] = useState("all"); // "all" | "news" | "papers"
  const [translatedTitles, setTranslatedTitles] = useState({});

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
      if (contentMode === "papers" && item.sourceType !== PAPER_SOURCE) return false;
      if (contentMode === "news" && item.sourceType === PAPER_SOURCE) return false;
      return true;
    });
  }, [items, activeTag, activeSource, contentMode]);

  const featured = useMemo(() => pickFeatured(items), [items]);

  // Source type label for each article
  const sourceTypeLabel = (sourceType) => {
    const found = SOURCE_TYPES.find((s) => s.id === sourceType);
    return found ? st(found.id) : null;
  };

  const tr = (title) => translatedTitles[title] || title;

  return (
    <div>
      {/* ── Featured / Hot section ── */}
      {featured.length > 0 && !activeTag && !activeSource && contentMode === "all" && (
        <div className="mb-8 rounded-2xl border border-red-100 bg-red-50/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-3">
            🔥 Featured Picks
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

      {/* ── News / Papers toggle ── */}
      <div className="mb-4 flex gap-2">
        {[
          { id: "all", label: "All" },
          { id: "news", label: "📰 News" },
          { id: "papers", label: "🔬 Papers" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setContentMode(m.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              contentMode === m.id
                ? "brand-gradient text-white"
                : "card-surface text-muted hover:text-foreground"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ── Source filter ── */}
      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip active={!activeSource} onClick={() => setActiveSource(null)}>
          {t("allSources")}
        </FilterChip>
        {SOURCE_TYPES.map((s) => (
          <FilterChip
            key={s.id}
            active={activeSource === s.id}
            onClick={() => setActiveSource(s.id)}
          >
            {st(s.id)}
          </FilterChip>
        ))}
      </div>

      {/* ── Topic filter ── */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip active={!activeTag} onClick={() => setActiveTag(null)} subtle>
          {t("allTopics")}
        </FilterChip>
        {ALL_TAGS.map((tag) => (
          <FilterChip
            key={tag.id}
            active={activeTag === tag.id}
            onClick={() => setActiveTag(tag.id)}
            subtle
          >
            {tg(tag.id)}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">{t("empty")}</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((item, idx) => {
            const isPaper = item.sourceType === PAPER_SOURCE;
            return (
              <li
                key={item.link || idx}
                className={`card-surface rounded-xl p-4 ${isPaper && contentMode === "papers" ? "border-l-2 border-l-blue-400" : ""}`}
              >
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                  {/* Source row — shows both source name + sourceType badge */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-1.5">
                    <span className="font-medium text-brand-end">{item.source}</span>
                    {item.pubDate && (
                      <span>
                        · {isPaper && contentMode !== "papers"
                          ? formatDate(item.pubDate, locale)
                          : formatDate(item.pubDate, locale)}
                      </span>
                    )}
                    {item.sourceType && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                        {sourceTypeLabel(item.sourceType)}
                      </span>
                    )}
                  </div>

                  <h3 className={`text-base font-semibold leading-snug ${isPaper && contentMode === "papers" ? "text-blue-900" : ""}`}>
                    {tr(item.title)}
                  </h3>

                  {item.summary && (
                    <p className={`mt-1 text-sm text-muted ${isPaper ? "line-clamp-3" : "line-clamp-2"}`}>
                      {item.summary}
                    </p>
                  )}

                  {/* Tags row — always shown */}
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
