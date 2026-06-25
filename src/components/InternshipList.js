"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

function formatDate(iso, locale) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function InternshipList({ items }) {
  const t = useTranslations("internship");
  const locale = useLocale();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="mb-4 w-full rounded-xl border bg-surface px-4 py-2 text-sm outline-none focus:border-brand-end"
      />
      {filtered.length === 0 ? (
        <p className="text-sm text-muted">{t("searchEmpty")}</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((item) => (
            <li key={item.id} className="card-surface rounded-xl p-4">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  {item.datePosted && (
                    <span className="text-xs text-muted">
                      {formatDate(item.datePosted, locale)}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {item.company}
                  {item.locations?.length
                    ? ` · ${item.locations.join(", ")}`
                    : ""}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
