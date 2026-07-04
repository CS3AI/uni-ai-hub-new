"use client";
import { useState } from "react";

/* ── shared helpers ───────────────────────────────────────── */
function levelColor(level = "") {
  const l = level.toLowerCase();
  if (l.includes("begin")) return "bg-green-100 text-green-700";
  if (l.includes("inter")) return "bg-blue-100 text-blue-700";
  if (l.includes("advan")) return "bg-purple-100 text-purple-700";
  if (l.includes("all")) return "bg-gray-100 text-gray-600";
  return "bg-gray-100 text-gray-600";
}

function formatColor(format = "") {
  const f = format.toLowerCase();
  if (f.includes("free") || f.includes("open course") || f.includes("courseware") || f.includes("audit")) return "bg-green-100 text-green-700";
  if (f.includes("youtube") || f.includes("online") || f.includes("remote")) return "bg-blue-100 text-blue-700";
  if (f.includes("subscription") || f.includes("trial") || f.includes("paid")) return "bg-yellow-100 text-yellow-700";
  if (f.includes("in-person") || f.includes("workshop") || f.includes("conference") || f.includes("residential")) return "bg-red-100 text-red-700";
  if (f.includes("funded") || f.includes("scholarship")) return "bg-orange-100 text-orange-700";
  if (f.includes("ted")) return "bg-red-100 text-red-700";
  if (f.includes("research") || f.includes("mentorship")) return "bg-purple-100 text-purple-700";
  if (f.includes("competition")) return "bg-yellow-100 text-yellow-700";
  if (f.includes("volunteer") || f.includes("club") || f.includes("community")) return "bg-teal-100 text-teal-700";
  return "bg-gray-100 text-gray-600";
}

function Tag({ children, color }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {children}
    </span>
  );
}

/* ── AccordionItem: used inside a parent card list ────────── */
function AccordionItem({ label, tags, desc, url, visitLabel = "Visit Page →" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 py-2.5 text-left hover:bg-gray-50 rounded px-1 -mx-1 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium leading-snug">{label}</span>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {tags.map((t, i) => t && <Tag key={i} color={t.color}>{t.text}</Tag>)}
            </div>
          )}
        </div>
        <span className="text-gray-400 text-xs mt-0.5 flex-shrink-0">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="pb-3 px-1">
          {desc && <p className="text-sm text-gray-600 leading-relaxed mb-2">{desc}</p>}
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1.5 transition-colors">
              {visitLabel}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/* ── StandaloneCard: full card accordion for 2-col grids ─── */
function StandaloneCard({ label, sublabel, tags, desc, url, visitLabel = "Visit Page →" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-surface rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold leading-snug block">{label}</span>
          {sublabel && <span className="text-xs text-gray-500 mt-0.5 block">{sublabel}</span>}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((t, i) => t && <Tag key={i} color={t.color}>{t.text}</Tag>)}
            </div>
          )}
        </div>
        <span className="text-gray-400 text-xs mt-0.5 flex-shrink-0">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          {desc && <p className="text-sm text-gray-600 leading-relaxed mb-3">{desc}</p>}
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1.5 transition-colors">
              {visitLabel}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Universities ─────────────────────────────────────────── */
export function UniCourseList({ courses }) {
  return (
    <div>
      {courses.map((c, idx) => (
        <AccordionItem key={idx}
          label={[c.code, c.title].filter(Boolean).join(" · ")}
          tags={[
            c.level && { text: c.level, color: levelColor(c.level) },
            c.format && { text: c.format, color: formatColor(c.format) },
          ]}
          desc={c.desc} url={c.url} visitLabel="Visit Course →" />
      ))}
    </div>
  );
}

/* ── Companies ────────────────────────────────────────────── */
export function CompanyProgramList({ programs }) {
  return (
    <div>
      {programs.map((p, idx) => (
        <AccordionItem key={idx}
          label={p.title}
          tags={[
            p.level && { text: p.level, color: levelColor(p.level) },
            p.format && { text: p.format, color: formatColor(p.format) },
          ]}
          desc={p.desc} url={p.url} visitLabel="Visit Course →" />
      ))}
    </div>
  );
}

/* ── Online Lectures ──────────────────────────────────────── */
export function LectureList({ lectures }) {
  return (
    <>
      {lectures.map((lec, idx) => (
        <StandaloneCard key={idx}
          label={lec.name}
          sublabel={lec.speaker + (lec.org ? " · " + lec.org : "")}
          tags={[
            lec.level && { text: lec.level, color: levelColor(lec.level) },
            lec.format && { text: lec.format, color: formatColor(lec.format) },
          ]}
          desc={lec.desc} url={lec.url} visitLabel="Watch Now →" />
      ))}
    </>
  );
}

/* ── Conferences & Events ─────────────────────────────────── */
export function ConferenceList({ conferences }) {
  return (
    <>
      {conferences.map((c, idx) => (
        <StandaloneCard key={idx}
          label={c.name}
          sublabel={c.org}
          tags={[
            c.level && { text: c.level, color: levelColor(c.level) },
            c.format && { text: c.format, color: formatColor(c.format) },
          ]}
          desc={c.desc} url={c.url} visitLabel="Learn More →" />
      ))}
    </>
  );
}

/* ── Volunteer Opportunities ──────────────────────────────── */
export function VolunteerList({ programs }) {
  return (
    <>
      {programs.map((v, idx) => (
        <StandaloneCard key={idx}
          label={v.name}
          sublabel={v.org}
          tags={[
            v.level && { text: v.level, color: levelColor(v.level) },
            v.format && { text: v.format, color: formatColor(v.format) },
          ]}
          desc={v.desc || v.topic}
          url={v.url} visitLabel="Get Involved →" />
      ))}
    </>
  );
}

/* ── Summer Schools ───────────────────────────────────────── */
export function SummerSchoolList({ programs }) {
  return (
    <>
      {programs.map((p, idx) => (
        <StandaloneCard key={idx}
          label={p.name}
          sublabel={p.org}
          tags={[
            p.audience && { text: p.audience, color: "bg-orange-100 text-orange-700" },
            p.format && { text: p.format, color: formatColor(p.format) },
          ]}
          desc={p.desc} url={p.url} visitLabel="Apply / Learn More →" />
      ))}
    </>
  );
}

/* ── Research Programs ────────────────────────────────────── */
export function ResearchProgramList({ programs }) {
  return (
    <>
      {programs.map((p, idx) => (
        <StandaloneCard key={idx}
          label={p.name}
          sublabel={p.org}
          tags={[
            p.audience && { text: p.audience, color: "bg-purple-100 text-purple-700" },
            p.format && { text: p.format, color: formatColor(p.format) },
          ]}
          desc={p.desc} url={p.url} visitLabel="Apply / Learn More →" />
      ))}
    </>
  );
}
