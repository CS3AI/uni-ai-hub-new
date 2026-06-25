"use client";

import { useState, useEffect } from "react";

const TABS = [
  { id: "news",        emoji: "📰", label: "AI News",          count: 5 },
  { id: "papers",      emoji: "🔬", label: "Research Papers",  count: 3 },
  { id: "internships", emoji: "💼", label: "Internships",      count: 3 },
  { id: "courses",     emoji: "📚", label: "Top Courses",      count: 2 },
];

const LANG_MAP = { zh:"zh-CN", fr:"fr", es:"es", de:"de", ja:"ja", ru:"ru", ko:"ko" };

async function translateText(text, tl) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const r = await fetch(url);
    const d = await r.json();
    return d[0]?.map((c) => c[0]).join("") || text;
  } catch {
    return text;
  }
}

export default function WeeklyDigest({ digest, locale }) {
  const [activeTab, setActiveTab] = useState("news");
  const [translated, setTranslated] = useState({});
  const [translating, setTranslating] = useState(false);
  const tl = LANG_MAP[locale];

  useEffect(() => {
    if (!tl || !digest) return;
    const allItems = [
      ...(digest.news        || []),
      ...(digest.papers      || []),
      ...(digest.internships || []),
      ...(digest.courses     || []),
    ];
    const texts = allItems.map((item) => item.commentary).filter(Boolean);
    if (!texts.length) return;
    setTranslating(true);
    Promise.all(texts.map((t) => translateText(t, tl)))
      .then((results) => {
        const map = {};
        texts.forEach((orig, i) => { map[orig] = results[i]; });
        setTranslated(map);
      })
      .finally(() => setTranslating(false));
  }, [tl, digest]);

  const items = digest?.[activeTab] || [];

  const LABEL_MAP = {
    en: { title: "YCM Weekly Intel Digest", by: "YCM Studio · Updated weekly", weekly: "Weekly", commentary: "Commentary" },
    zh: { title: "YCM 每周 AI 精选", by: "YCM Studio · 每周更新", weekly: "每周", commentary: "点评" },
    fr: { title: "YCM Digest Hebdomadaire", by: "YCM Studio · Mise à jour hebdomadaire", weekly: "Hebdo", commentary: "Commentaire" },
    es: { title: "YCM Resumen Semanal de IA", by: "YCM Studio · Actualizado semanalmente", weekly: "Semanal", commentary: "Comentario" },
    de: { title: "YCM Wöchentlicher KI-Digest", by: "YCM Studio · Wöchentlich aktualisiert", weekly: "Wöchentlich", commentary: "Kommentar" },
    ja: { title: "YCM ウィークリー AI ダイジェスト", by: "YCM Studio · 毎週更新", weekly: "週次", commentary: "コメント" },
    ru: { title: "YCM Еженедельный AI-дайджест", by: "YCM Studio · Обновляется еженедельно", weekly: "Еженедельно", commentary: "Комментарий" },
    ko: { title: "YCM 주간 AI 다이제스트", by: "YCM Studio · 매주 업데이트", weekly: "주간", commentary: "코멘트" },
  };

  const TAB_LABEL_MAP = {
    en: { news: "AI News", papers: "Research Papers", internships: "Internships", courses: "Top Courses" },
    zh: { news: "AI 资讯", papers: "研究论文", internships: "实习机会", courses: "精选课程" },
    fr: { news: "Actualités IA", papers: "Publications", internships: "Stages", courses: "Formations" },
    es: { news: "Noticias IA", papers: "Investigación", internships: "Prácticas", courses: "Cursos" },
    de: { news: "KI-News", papers: "Forschung", internships: "Praktika", courses: "Kurse" },
    ja: { news: "AI ニュース", papers: "論文", internships: "インターン", courses: "コース" },
    ru: { news: "ИИ-новости", papers: "Исследования", internships: "Стажировки", courses: "Курсы" },
    ko: { news: "AI 뉴스", papers: "연구 논문", internships: "인턴십", courses: "추천 강의" },
  };

  const L = LABEL_MAP[locale] || LABEL_MAP.en;
  const TL = TAB_LABEL_MAP[locale] || TAB_LABEL_MAP.en;

  return (
    <div className="mt-8 card-surface rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold">{L.title}</h2>
            <p className="text-xs text-muted mt-0.5">{L.by} · {digest?.weekLabel}</p>
          </div>
          <span className="shrink-0 text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded-full border border-gray-200 text-muted">
            {L.weekly}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "brand-gradient text-white shadow-sm"
                  : "text-muted hover:text-foreground hover:bg-gray-100"
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{TL[tab.id]}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 border-t border-gray-100" />
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50">
        {items.map((item, i) => (
          <div key={i} className="p-5 flex gap-4">
            <span className="shrink-0 w-8 text-2xl font-black text-gray-100 dark:text-gray-800 leading-none pt-0.5 select-none">
              {String(item.rank).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-semibold text-foreground hover:text-brand-end transition-colors leading-snug"
              >
                {item.title}
              </a>
              <p className="text-[11px] text-muted mt-0.5">
                {item.source || item.company || item.institution}
                {item.location ? ` · ${item.location}` : ""}
              </p>
              {item.commentary && (
                <div className="mt-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-end">
                    {L.commentary}
                  </span>
                  <p className={`mt-1 text-xs leading-relaxed text-muted transition-opacity ${translating ? "opacity-60" : ""}`}>
                    {translated[item.commentary] || item.commentary}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
