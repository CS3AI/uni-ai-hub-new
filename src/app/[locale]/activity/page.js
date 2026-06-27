"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import activities from "@/data/activities.json";

/* ─── tiny helpers ─────────────────────────────────────── */
function Badge({ text, color = "blue" }) {
  const cls = {
    blue:   "bg-blue-50 text-blue-700 border-blue-200",
    green:  "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    amber:  "bg-amber-50 text-amber-700 border-amber-200",
  }[color] ?? "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${cls}`}>
      {text}
    </span>
  );
}

function TipList({ tips }) {
  return (
    <ul className="mt-3 space-y-1">
      {tips.map((tip, i) => (
        <li key={i} className="flex gap-2 text-xs text-muted">
          <span className="mt-0.5 text-brand-end font-bold">→</span>
          <span>{tip}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─── Tab 1: Global Opportunities ─────────────────────── */
function GlobalOpportunitiesTab() {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-4">
      {activities.globalOpportunities.map((opp) => (
        <div key={opp.id} className="card-surface rounded-2xl overflow-hidden shadow-sm">
          {/* header row */}
          <button
            onClick={() => setOpen(open === opp.id ? null : opp.id)}
            className="w-full flex items-start justify-between gap-3 p-5 text-left"
          >
            <div>
              <h3 className="font-semibold text-base leading-tight">{opp.name}</h3>
              <p className="text-xs text-muted mt-0.5">{opp.organizer}</p>
            </div>
            <span className="text-muted text-sm mt-1 shrink-0">
              {open === opp.id ? "▲" : "▼"}
            </span>
          </button>

          {/* expanded */}
          {open === opp.id && (
            <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-4">
              <p className="text-sm text-muted leading-relaxed">{opp.shortDesc}</p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium text-foreground mb-1">Timeline</p>
                  <p className="text-muted">{opp.deadline}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Eligibility</p>
                  <p className="text-muted">{opp.eligibility}</p>
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

              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                <p className="text-xs font-medium text-amber-800 mb-1">Why this matters for high schoolers</p>
                <p className="text-xs text-amber-700 leading-relaxed">{opp.whyHighSchool}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-foreground mb-1">Tips</p>
                <TipList tips={opp.tips} />
              </div>

              <a
                href={opp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 rounded-lg brand-gradient text-white text-xs font-semibold px-4 py-2 hover:opacity-90 transition"
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
function OpenSourceTab() {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-6">
      {/* Club projects */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full brand-gradient inline-block" aria-hidden />
          AI Club Original Projects
        </h3>
        <div className="space-y-4">
          {activities.openSource.clubProjects.map((proj) => (
            <div key={proj.id} className="card-surface rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpen(open === proj.id ? null : proj.id)}
                className="w-full flex items-start justify-between gap-3 p-5 text-left"
              >
                <div>
                  <h4 className="font-semibold text-sm leading-tight">{proj.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge text={proj.sdg} color="green" />
                    <Badge text={proj.difficulty} color="purple" />
                  </div>
                </div>
                <span className="text-muted text-sm mt-1 shrink-0">
                  {open === proj.id ? "▲" : "▼"}
                </span>
              </button>

              {open === proj.id && (
                <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-3">
                  <p className="text-sm text-muted leading-relaxed">{proj.desc}</p>

                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                    <p className="text-xs font-medium text-blue-800 mb-1">How to contribute</p>
                    <p className="text-xs text-blue-700 leading-relaxed">{proj.howToContribute}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-foreground mb-1.5">Skills needed</p>
                    <div className="flex flex-wrap gap-1">
                      {proj.skills.map((s) => <Badge key={s} text={s} color="blue" />)}
                    </div>
                  </div>

                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 rounded-lg brand-gradient text-white text-xs font-semibold px-4 py-2 hover:opacity-90 transition"
                  >
                    View on GitHub →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Featured external */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full brand-gradient inline-block" aria-hidden />
          Featured External Projects
        </h3>
        <div className="space-y-4">
          {activities.openSource.featured.map((proj) => (
            <div key={proj.id} className="card-surface rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpen(open === proj.id ? null : proj.id)}
                className="w-full flex items-start justify-between gap-3 p-5 text-left"
              >
                <div>
                  <h4 className="font-semibold text-sm leading-tight">{proj.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted">{proj.organizer}</p>
                    <Badge text={proj.difficulty} color="purple" />
                  </div>
                </div>
                <span className="text-muted text-sm mt-1 shrink-0">
                  {open === proj.id ? "▲" : "▼"}
                </span>
              </button>

              {open === proj.id && (
                <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge text={proj.sdg} color="green" />
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{proj.desc}</p>

                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                    <p className="text-xs font-medium text-amber-800 mb-1">Why join?</p>
                    <p className="text-xs text-amber-700 leading-relaxed">{proj.whyJoin}</p>
                  </div>

                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 rounded-lg brand-gradient text-white text-xs font-semibold px-4 py-2 hover:opacity-90 transition"
                  >
                    Get Started →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Tab 3: Local Action ──────────────────────────────── */
function LocalActionTab() {
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(null);

  function copyTemplate(id, text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted rounded-xl bg-surface border border-border/50 p-4 leading-relaxed">
        {activities.localAction.intro}
      </p>

      {activities.localAction.orgs.map((org) => (
        <div key={org.id} className="card-surface rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpen(open === org.id ? null : org.id)}
            className="w-full flex items-start justify-between gap-3 p-5 text-left"
          >
            <h3 className="font-semibold text-base">{org.name}</h3>
            <span className="text-muted text-sm mt-1 shrink-0">
              {open === org.id ? "▲" : "▼"}
            </span>
          </button>

          {open === org.id && (
            <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-4">
              <p className="text-sm text-muted leading-relaxed">{org.why}</p>

              <div>
                <p className="text-xs font-medium text-foreground mb-2">Project ideas</p>
                <ul className="space-y-1.5">
                  {org.suggestedProjects.map((p, i) => (
                    <li key={i} className="flex gap-2 text-xs text-muted">
                      <span className="text-brand-end font-bold shrink-0">{i + 1}.</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-foreground">Outreach template</p>
                  <button
                    onClick={() => copyTemplate(org.id, org.outreachTemplate)}
                    className="text-[10px] font-medium text-brand-end border border-current rounded-md px-2 py-0.5 hover:opacity-80 transition"
                  >
                    {copied === org.id ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-700 leading-relaxed font-mono whitespace-pre-wrap">
                  {org.outreachTemplate}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-foreground mb-1">Tips</p>
                <TipList tips={org.tips} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────── */
export default function ActivityPage() {
  const t = useTranslations("activity");
  const [tab, setTab] = useState(0);

  const TABS = [
    { label: t("tab1"), content: <GlobalOpportunitiesTab /> },
    { label: t("tab2"), content: <OpenSourceTab /> },
    { label: t("tab3"), content: <LocalActionTab /> },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Hero */}
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("eyebrow")}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
        <span className="brand-gradient-text">{t("title")}</span>
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">{t("desc")}</p>

      {/* Tab bar */}
      <div className="mt-8 flex gap-2 flex-wrap">
        {TABS.map((tb, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === i
                ? "brand-gradient text-white shadow-sm"
                : "bg-surface border border-border text-muted hover:text-foreground"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">{TABS[tab].content}</div>
    </div>
  );
}
