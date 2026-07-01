"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import activities from "@/data/activities.json";

/* ─── Translation ──────────────────────────────────────── */
const LANG_MAP = { zh:"zh-CN", fr:"fr", es:"es", de:"de", ja:"ja", ru:"ru", ko:"ko" };

async function translateText(text, tl) {
  if (!text || !tl) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const r = await fetch(url);
    const d = await r.json();
    return d[0]?.map((c) => c[0]).join("") || text;
  } catch {
    return text;
  }
}

function useTranslateField(texts, locale) {
  const [translated, setTranslated] = useState({});
  const tl = LANG_MAP[locale];
  useEffect(() => {
    if (!tl) { setTranslated({}); return; }
    const unique = [...new Set(texts.filter(Boolean))];
    Promise.all(unique.map((t) => translateText(t, tl).then((r) => [t, r])))
      .then((pairs) => setTranslated(Object.fromEntries(pairs)));
  }, [tl, texts.join("|")]);
  return (orig) => (tl ? translated[orig] || orig : orig);
}

/* ─── Tiny helpers ─────────────────────────────────────── */
function Badge({ text, color = "blue" }) {
  const cls = {
    blue:   "bg-blue-50 text-blue-700 border-blue-200",
    green:  "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    amber:  "bg-amber-50 text-amber-700 border-amber-200",
    red:    "bg-red-50 text-red-700 border-red-200",
    pink:   "bg-pink-50 text-pink-700 border-pink-200",
  }[color] ?? "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${cls}`}>
      {text}
    </span>
  );
}

function TipList({ tips, tr }) {
  return (
    <ul className="mt-2 space-y-1">
      {tips.map((tip, i) => (
        <li key={i} className="flex gap-2 text-xs text-muted">
          <span className="mt-0.5 text-brand-end font-bold shrink-0">→</span>
          <span>{tr(tip)}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─── Tab 1: Global Opportunities ─────────────────────── */
function GlobalOpportunitiesTab({ tr }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      {activities.globalOpportunities.map((opp) => (
        <div key={opp.id} className="card-surface rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpen(open === opp.id ? null : opp.id)}
            className="w-full flex items-start justify-between gap-3 p-4 text-left"
          >
            <div className="min-w-0">
              <h3 className="font-semibold text-sm leading-tight">{opp.name}</h3>
              <p className="text-xs text-muted mt-0.5">{opp.organizer}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {opp.difficulty && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">{opp.difficulty}</span>
                )}
                {opp.opportunityType && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">{opp.opportunityType}</span>
                )}
                {opp.requirement && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{opp.requirement}</span>
                )}
              </div>
            </div>
            <span className="text-muted text-xs mt-1 shrink-0">{open === opp.id ? "▲" : "▼"}</span>
          </button>

          {open === opp.id && (
            <div className="px-4 pb-4 border-t border-border/40 pt-3 space-y-3">
              <p className="text-sm text-muted leading-relaxed">{tr(opp.shortDesc)}</p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium text-foreground mb-1">Timeline</p>
                  <p className="text-muted">{tr(opp.deadline)}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Eligibility</p>
                  <p className="text-muted">{tr(opp.eligibility)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-foreground mb-1.5">SDG Alignment</p>
                <div className="flex flex-wrap gap-1">
                  {opp.sdgs.map((s) => <Badge key={s} text={s} color="green" />)}
                </div>
              </div>

              {opp.techStack && (
                <div>
                  <p className="text-xs font-medium text-foreground mb-1.5">Tech Stack</p>
                  <div className="flex flex-wrap gap-1">
                    {opp.techStack.map((s) => <Badge key={s} text={s} color="blue" />)}
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                <p className="text-xs font-medium text-amber-800 mb-1">Why this matters for high schoolers</p>
                <p className="text-xs text-amber-700 leading-relaxed">{tr(opp.whyHighSchool)}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-foreground mb-1">Tips</p>
                <TipList tips={opp.tips} tr={tr} />
              </div>

              <a
                href={opp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 rounded-lg bg-amber-500 text-white text-xs font-semibold px-4 py-2 hover:bg-amber-600 transition"
              >
                Visit Official Page →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Tab 2: Open Source & Projects ───────────────────── */
function OpenSourceTab({ tr }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      {activities.openSource.map((proj) => (
        <div key={proj.id} className="card-surface rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpen(open === proj.id ? null : proj.id)}
            className="w-full flex items-start justify-between gap-3 p-4 text-left"
          >
            <div>
              <h3 className="font-semibold text-sm leading-tight">{proj.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-xs text-muted">{proj.organizer}</p>
                <Badge text={proj.difficulty} color="purple" />
              </div>
            </div>
            <span className="text-muted text-xs mt-1 shrink-0">{open === proj.id ? "▲" : "▼"}</span>
          </button>

          {open === proj.id && (
            <div className="px-4 pb-4 border-t border-border/40 pt-3 space-y-3">
              <Badge text={proj.sdg} color="green" />
              <p className="text-sm text-muted leading-relaxed">{tr(proj.desc)}</p>

              <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                <p className="text-xs font-medium text-amber-800 mb-1">Why join?</p>
                <p className="text-xs text-amber-700 leading-relaxed">{tr(proj.whyJoin)}</p>
              </div>

              <a
                href={proj.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 rounded-lg bg-amber-500 text-white text-xs font-semibold px-4 py-2 hover:bg-amber-600 transition"
              >
                Get Involved →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Tab 3: Local Action (California) ────────────────── */
function LocalActionTab({ tr }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted rounded-xl bg-surface border border-border/50 p-4 leading-relaxed">
        {tr(activities.localAction.intro)}
      </p>

      {activities.localAction.programs.map((prog) => (
        <div key={prog.id} className="card-surface rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpen(open === prog.id ? null : prog.id)}
            className="w-full flex items-start justify-between gap-3 p-4 text-left"
          >
            <div>
              <h3 className="font-semibold text-sm leading-tight">{prog.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-xs text-muted">{prog.org}</p>
                <Badge text={prog.type} color="blue" />
              </div>
            </div>
            <span className="text-muted text-xs mt-1 shrink-0">{open === prog.id ? "▲" : "▼"}</span>
          </button>

          {open === prog.id && (
            <div className="px-4 pb-4 border-t border-border/40 pt-3 space-y-3">
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                <span>{prog.location}</span>
                <span>{prog.timeline}</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{tr(prog.desc)}</p>

              <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                <p className="text-xs font-medium text-blue-800 mb-1">How to get involved</p>
                <p className="text-xs text-blue-700 leading-relaxed">{tr(prog.howToJoin)}</p>
              </div>

              <a
                href={prog.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 rounded-lg bg-amber-500 text-white text-xs font-semibold px-4 py-2 hover:bg-amber-600 transition"
              >
                Learn More →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Tab 4: Talks & Events ────────────────────────────── */
function TalksTab({ tr }) {
  const [open, setOpen] = useState(null);
  const typeColors = { "Conference": "blue", "Academic Conference": "purple", "Industry Conference": "blue", "Developer Conference": "green", "Education + Tech Conference": "green", "Public Lecture Series": "amber", "Industry Expo": "red", "Executive Summit": "pink", "Business Conference": "blue" };

  return (
    <div className="space-y-3">
      {activities.talksAndEvents.map((ev) => (
        <div key={ev.id} className="card-surface rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpen(open === ev.id ? null : ev.id)}
            className="w-full flex items-start justify-between gap-3 p-4 text-left"
          >
            <div>
              <h3 className="font-semibold text-sm leading-tight">{ev.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-xs text-muted">{ev.org}</p>
                <Badge text={ev.type} color={typeColors[ev.type] || "blue"} />
              </div>
            </div>
            <span className="text-muted text-xs mt-1 shrink-0">{open === ev.id ? "▲" : "▼"}</span>
          </button>

          {open === ev.id && (
            <div className="px-4 pb-4 border-t border-border/40 pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium text-foreground mb-1">Location</p>
                  <p className="text-muted">{ev.location}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">When</p>
                  <p className="text-muted">{ev.period}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <Badge text={ev.format} color="blue" />
                {ev.cost && <Badge text={ev.cost} color="green" />}
              </div>

              <p className="text-sm text-muted leading-relaxed">{tr(ev.desc)}</p>

              <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                <p className="text-xs font-medium text-amber-800 mb-1">Why attend?</p>
                <p className="text-xs text-amber-700 leading-relaxed">{tr(ev.whyAttend)}</p>
              </div>

              <a
                href={ev.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 rounded-lg bg-amber-500 text-white text-xs font-semibold px-4 py-2 hover:bg-amber-600 transition"
              >
                Visit Official Page →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────── */
export default function OpportunityPage() {
  const t = useTranslations("opportunity");
  const locale = useLocale();
  const [tab, setTab] = useState(0);

  const allTexts = [
    ...activities.globalOpportunities.flatMap(o => [o.shortDesc, o.deadline, o.eligibility, o.whyHighSchool, ...o.tips]),
    ...activities.openSource.flatMap(o => [o.desc, o.whyJoin]),
    activities.localAction.intro,
    ...activities.localAction.programs.flatMap(p => [p.desc, p.howToJoin]),
    ...activities.talksAndEvents.flatMap(e => [e.desc, e.whyAttend]),
  ];
  const tr = useTranslateField(allTexts, locale);

  const TABS = [
    { label: t("tab1"), content: <GlobalOpportunitiesTab tr={tr} /> },
    { label: t("tab2"), content: <OpenSourceTab tr={tr} /> },
    { label: t("tab3"), content: <LocalActionTab tr={tr} /> },
    { label: t("tab4"), content: <TalksTab tr={tr} /> },
  ];

  return (
    <div className="min-h-screen bg-yellow-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            {t("eyebrow")}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            {t("desc")}
          </p>
        </div>

        <div className="mb-6 flex gap-2 flex-wrap">
          {TABS.map((tb, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                tab === i
                  ? "bg-amber-500 text-white shadow-sm"
                  : "card-surface border border-border text-muted hover:text-foreground"
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {TABS[tab].content}
      </div>
    </div>
  );
}
