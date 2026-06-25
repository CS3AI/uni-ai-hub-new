"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ALL_TAGS, SOURCE_TYPES } from "@/lib/taxonomy";
import Tag from "@/components/Tag";

const LANG_MAP = { zh: "zh-CN", fr: "fr", es: "es", de: "de", ja: "ja", ru: "ru", ko: "ko" };

async function translateOne(title, tl, signal) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(title)}`;
  const r = await fetch(url, { signal });
  const data = await r.json();
  return data[0]?.map((c) => c[0]).join("") || title;
}

function formatDate(iso, locale) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function InformationFeed({ items }) {
  const t = useTranslations("information");
  const st = useTranslations("sourceTypes");
  const tg = useTranslations("tags");
  const locale = useLocale();
  const [activeTag, setActiveTag] = useState(null);
  const [activeSource, setActiveSource] = useState(null);
  const [translatedTitles, setTranslatedTitles] = useState({});

  useEffect(() => {
    const tl = LANG_MAP[locale];
    if (!tl) { setTranslatedTitles({}); return; }
    const controller = new AbortController();
    const titles = [...new Set(items.map((i) => i.title).filter(Boolean))];

    // Translate in parallel batches of 10, update UI progressively
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

  return (
    <div>
      {/* Source filter */}
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

      {/* Topic filter */}
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
          {filtered.map((item, idx) => (
            <li key={item.link || idx} className="card-surface rounded-xl p-4">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="font-medium text-brand-end">{item.source}</span>
                  {item.pubDate && <span>· {formatDate(item.pubDate, locale)}</span>}
                </div>
                <h3 className="mt-1.5 text-base font-semibold leading-snug">
                  {translatedTitles[item.title] || item.title}
                </h3>
                {item.summary && (
                  <p className="mt-1 text-sm text-muted line-clamp-2">
                    {item.summary}
                  </p>
                )}
                {item.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 4).map((tagId) => {
                      const found = ALL_TAGS.find((t) => t.id === tagId);
                      return found ? (
                        <Tag key={tagId}>{tg(tagId)}</Tag>
                      ) : null;
                    })}
                  </div>
                )}
              </a>
            </li>
          ))}
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
