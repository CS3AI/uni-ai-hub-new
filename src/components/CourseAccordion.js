"use client";
import { useState } from "react";

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
  if (f.includes("free") || f.includes("open course") || f.includes("courseware")) return "bg-green-100 text-green-700";
  if (f.includes("youtube") || f.includes("online")) return "bg-blue-100 text-blue-700";
  if (f.includes("subscription") || f.includes("trial")) return "bg-yellow-100 text-yellow-700";
  if (f.includes("in-person") || f.includes("workshop")) return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
}

function Tag({ children, color }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {children}
    </span>
  );
}

function CourseItem({ course, url }) {
  const [open, setOpen] = useState(false);
  const label = [course.code, course.title || course.name].filter(Boolean).join(" · ");

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 py-2.5 text-left hover:bg-gray-50 rounded px-1 -mx-1 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium leading-snug">{label}</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {course.level && <Tag color={levelColor(course.level)}>{course.level}</Tag>}
            {course.format && <Tag color={formatColor(course.format)}>{course.format}</Tag>}
          </div>
        </div>
        <span className="text-gray-400 text-xs mt-0.5 flex-shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="pb-3 px-1">
          {course.desc && (
            <p className="text-sm text-gray-600 leading-relaxed mb-2">{course.desc}</p>
          )}
          {(url || course.url) && (
            <a
              href={url || course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1.5 transition-colors"
            >
              Visit Course →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function UniCourseList({ courses }) {
  return (
    <div>
      {courses.map((c, idx) => (
        <CourseItem key={idx} course={c} url={c.url} />
      ))}
    </div>
  );
}

export function CompanyProgramList({ programs }) {
  return (
    <div>
      {programs.map((p, idx) => (
        <CourseItem key={idx} course={{ title: p.title, level: p.level, format: p.format, desc: p.desc }} url={p.url} />
      ))}
    </div>
  );
}
