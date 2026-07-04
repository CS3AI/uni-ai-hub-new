"use client";
import { useState } from "react";
import LogoImg from "@/components/LogoImg";

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
      <p className="text-xs text-gray-600 leading-relaxed">{value}</p>
    </div>
  );
}

function ReferralCard({ r }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-surface rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-stretch text-left hover:bg-gray-50 transition-colors"
      >
        <LogoImg
          src={r.logo}
          alt={r.company}
          wrapperClass="w-20 flex-shrink-0 flex items-center justify-center bg-white/70 border-r border-gray-100 p-3"
          className="w-12 h-12"
        />
        <div className="flex-1 flex items-start justify-between gap-2 p-4">
          <div className="min-w-0">
            <h3 className="font-bold text-base leading-tight">
              <span className="hover:text-brand-end">{r.company}</span>
            </h3>
            <p className="text-sm text-muted mt-0.5 leading-snug">{r.note}</p>
          </div>
          <span className="text-gray-400 text-xs mt-1 flex-shrink-0">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          <InfoRow label="Work Description" value={r.workDesc} />
          <InfoRow label="Application Timeline" value={r.timeline} />
          <InfoRow label="Requirements" value={r.requirements} />
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg px-3 py-1.5 transition-colors mt-1"
          >
            View Careers Page →
          </a>
        </div>
      )}
    </div>
  );
}

export default function ReferralAccordion({ referrals }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {referrals.map((r, idx) => (
        <ReferralCard key={idx} r={r} />
      ))}
    </div>
  );
}
