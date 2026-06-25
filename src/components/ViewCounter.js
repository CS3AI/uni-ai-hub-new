"use client";

import { useEffect, useState } from "react";

const BASE = "https://api.counterapi.dev/v1/uni-ai-hub-ycm";

async function hit(ns)  { const r = await fetch(`${BASE}/${ns}/up`);  const d = await r.json(); return d?.count ?? null; }
async function peek(ns) { const r = await fetch(`${BASE}/${ns}/get`); const d = await r.json(); return d?.count ?? null; }

export default function ViewCounter() {
  const [views,    setViews]    = useState(null);
  const [visitors, setVisitors] = useState(null);
  const [schools,  setSchools]  = useState(null);

  useEffect(() => {
    // 1. Page views — increment every visit
    hit("pageviews").then(setViews).catch(() => {});

    // 2. Unique visitors — increment only once per browser session
    const visited = sessionStorage.getItem("uah-visited");
    if (!visited) {
      sessionStorage.setItem("uah-visited", "1");
      hit("visitors").then(setVisitors).catch(() => {});
    } else {
      peek("visitors").then(setVisitors).catch(() => {});
    }

    // 3. School referrals — count if referred from a school / .edu domain
    const ref = document.referrer || "";
    const isSchool = ref.includes(".edu") || ref.includes("school") ||
                     ref.includes("uhs")  || ref.includes("lausd");
    const schoolDone = sessionStorage.getItem("uah-school");
    if (isSchool && !schoolDone) {
      sessionStorage.setItem("uah-school", "1");
      hit("schools").then(setSchools).catch(() => {});
    } else {
      peek("schools").then(setSchools).catch(() => {});
    }
  }, []);

  if (views === null && visitors === null) return null;

  const fmt = (n) => (n == null ? "—" : n.toLocaleString());

  return (
    <div className="flex items-center gap-2 text-[11px] text-muted">
      {/* Page views */}
      <span className="flex items-center gap-0.5" title="Page views">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        {fmt(views)}
      </span>
      {/* Unique visitors */}
      {visitors !== null && (
        <>
          <span className="opacity-30">|</span>
          <span className="flex items-center gap-0.5" title="Unique visitors">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {fmt(visitors)}
          </span>
        </>
      )}
      {/* School referrals */}
      {schools !== null && (
        <>
          <span className="opacity-30">|</span>
          <span className="flex items-center gap-0.5" title="School referrals">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            {fmt(schools)}
          </span>
        </>
      )}
    </div>
  );
}
