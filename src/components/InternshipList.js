"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

const PAGE_SIZE = 15;

const THEME_ACTIVE = {
  default: "brand-gradient text-white",
  blue:    "bg-blue-600 text-white",
  green:   "bg-green-600 text-white",
  amber:   "bg-amber-500 text-white",
};

function formatDate(iso, locale) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}

function Paginator({ page, total, pageSize, onPage, activeClass }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  return (
    <div className="flex flex-wrap justify-center gap-1.5 mt-6">
      <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
        className="px-3 py-1.5 rounded-lg text-xs font-medium card-surface text-muted disabled:opacity-30">‹</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onPage(p)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${page === p ? activeClass : "card-surface text-muted hover:text-foreground"}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPage(Math.min(pages, page + 1))} disabled={page === pages}
        className="px-3 py-1.5 rounded-lg text-xs font-medium card-surface text-muted disabled:opacity-30">›</button>
    </div>
  );
}


// Infer required skills from job title keywords
function inferSkills(title) {
  const t = (title || "").toLowerCase();
  const skills = [];
  if (/computer vision|cv|vision|image|3d|slam|lidar|point cloud/.test(t)) skills.push("Computer Vision");
  if (/nlp|natural language|language model|llm|text|speech|bert|gpt/.test(t)) skills.push("NLP / LLM");
  if (/reinforcement|rl|self.driv|autonomous|robot/.test(t)) skills.push("Reinforcement Learning");
  if (/machine learning|ml|deep learning|neural|pytorch|tensorflow/.test(t)) skills.push("ML / Deep Learning");
  if (/data science|data engineer|analytics|big data|sql|spark/.test(t)) skills.push("Data Science");
  if (/simulation|physics|hardware/.test(t)) skills.push("Simulation / Physics");
  if (/software|backend|frontend|fullstack|web|api|cloud/.test(t)) skills.push("Software Engineering");
  if (/research|paper|phd|scientist/.test(t)) skills.push("Research Methods");
  // Always add Python if ML-adjacent
  if (skills.some(s => ["ML / Deep Learning","Computer Vision","NLP / LLM","Reinforcement Learning","Data Science"].includes(s))) {
    if (!skills.includes("Python")) skills.unshift("Python");
  }
  return skills.slice(0, 4); // max 4 tags
}

const SKILL_COLOR = {
  "Python": "bg-blue-50 text-blue-700",
  "Computer Vision": "bg-purple-50 text-purple-700",
  "NLP / LLM": "bg-indigo-50 text-indigo-700",
  "Reinforcement Learning": "bg-orange-50 text-orange-700",
  "ML / Deep Learning": "bg-green-50 text-green-700",
  "Data Science": "bg-teal-50 text-teal-700",
  "Simulation / Physics": "bg-yellow-50 text-yellow-700",
  "Software Engineering": "bg-gray-100 text-gray-600",
  "Research Methods": "bg-pink-50 text-pink-700",
};

export default function InternshipList({ items, theme = "default" }) {
  const activeClass = THEME_ACTIVE[theme] ?? THEME_ACTIVE.default;
  const t = useTranslations("internship");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.title.toLowerCase().includes(q) || i.company.toLowerCase().includes(q));
  }, [items, query]);

  const handleQuery = (e) => { setQuery(e.target.value); setPage(1); };
  const paged = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  return (
    <div>
      <input value={query} onChange={handleQuery} placeholder={t("searchPlaceholder")}
        className="mb-4 w-full rounded-xl border bg-surface px-4 py-2 text-sm outline-none focus:border-green-500" />
      {filtered.length === 0 ? (
        <p className="text-sm text-muted">{t("searchEmpty")}</p>
      ) : (
        <>
          <p className="mb-3 text-xs text-muted">{filtered.length} listings</p>
          <ul className="space-y-2">
            {paged.map((item) => (
              <li key={item.id} className="card-surface rounded-xl p-4">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    {item.datePosted && <span className="text-xs text-muted">{formatDate(item.datePosted, locale)}</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {item.company}{item.locations?.length ? ` · ${item.locations.join(", ")}` : ""}
                  </p>
                  {(() => {
                    const skills = inferSkills(item.title);
                    if (!skills.length) return null;
                    return (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {skills.map(s => (
                          <span key={s} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${SKILL_COLOR[s] || "bg-gray-100 text-gray-600"}`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </a>
              </li>
            ))}
          </ul>
          <Paginator page={page} total={filtered.length} pageSize={PAGE_SIZE} onPage={setPage} activeClass={activeClass} />
        </>
      )}
    </div>
  );
}
