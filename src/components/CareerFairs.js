"use client";
import { useState } from "react";

const FORMAT_BADGE = {
  "In-Person": "bg-green-100 text-green-700",
  "Virtual":   "bg-blue-100 text-blue-700",
  "Hybrid":    "bg-purple-100 text-purple-700",
};

export default function CareerFairs({ fairs, seasons, prepTips }) {
  const [activeSeason, setActiveSeason] = useState("fall");
  const [expanded, setExpanded] = useState(null);

  const season = seasons.find((s) => s.id === activeSeason);
  const visibleFairs = fairs.filter((f) => f.season === activeSeason);

  return (
    <div>
      {/* Season tabs */}
      <div className="mb-6 flex flex-wrap gap-3">
        {seasons.map((s) => (
          <button
            key={s.id}
            onClick={() => { setActiveSeason(s.id); setExpanded(null); }}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              activeSeason === s.id
                ? s.id === "fall"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-green-600 text-white shadow-sm"
                : "card-surface text-muted hover:text-foreground"
            }`}
          >
            {s.label}
            <span className="ml-2 text-xs font-normal opacity-80">{s.period}</span>
          </button>
        ))}
      </div>

      {/* Season subtitle + tip */}
      {season && (
        <div className="mb-5 rounded-xl border border-border bg-background/60 px-4 py-3">
          <p className="text-sm font-medium">{season.subtitle}</p>
          <p className="mt-0.5 text-xs text-muted">{season.tip}</p>
        </div>
      )}

      {/* Fair cards */}
      <div className="space-y-3 mb-8">
        {visibleFairs.map((fair) => {
          const isOpen = expanded === fair.id;
          return (
            <div key={fair.id} className="card-surface rounded-xl overflow-hidden">
              {/* Header row — always visible */}
              <button
                onClick={() => setExpanded(isOpen ? null : fair.id)}
                className="w-full text-left px-4 py-4 flex items-center gap-3"
              >
                {/* University logo */}
                <img
                  src={fair.logo}
                  alt={fair.university}
                  className="w-9 h-9 rounded-lg object-contain shrink-0 bg-white border border-border p-0.5"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm truncate">{fair.fairName}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${FORMAT_BADGE[fair.format] ?? "bg-gray-100 text-gray-600"}`}>
                      {fair.format}
                    </span>
                    <span className="text-[10px] text-muted shrink-0 bg-background rounded-full px-2 py-0.5 border border-border">
                      {fair.size}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-muted">
                    <span>{fair.dates}</span>
                    <span className="text-border">·</span>
                    <span>{fair.location}</span>
                  </div>
                </div>
                {/* Chevron */}
                <svg
                  className={`w-4 h-4 text-muted shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-border px-4 py-4 space-y-4">
                  {/* AI companies attending */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Notable Companies Attending</p>
                    <div className="flex flex-wrap gap-2">
                      {fair.aiCompanies.map((co) => (
                        <span key={co} className="rounded-full bg-background border border-border px-3 py-1 text-xs font-medium">
                          {co}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Insider tip */}
                  <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-3">
                    <p className="text-xs font-semibold text-amber-700 mb-1">Insider Tip</p>
                    <p className="text-xs text-amber-800 leading-relaxed">{fair.tip}</p>
                  </div>

                  {/* Register link */}
                  <a
                    href={fair.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
                  >
                    Register / Learn More
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prep tips */}
      <div className="rounded-2xl border border-green-200 bg-green-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-3">Career Fair Prep Checklist</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {prepTips.map((tip, i) => (
            <div key={i} className="rounded-xl bg-white border border-green-100 px-3 py-3">
              <p className="text-xs font-semibold text-green-800 mb-1">{tip.label}</p>
              <p className="text-xs text-muted leading-relaxed">{tip.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
