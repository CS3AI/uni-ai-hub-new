"use client";

import { useEffect, useState } from "react";

const SUPABASE_URL = "https://nonehrshbqcbpiamvzdk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbmVocnNoYnFjYnBpYW12emRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDg4MjUsImV4cCI6MjA5ODUyNDgyNX0.9OfnQumldllJEeM4XTQPfXHw6fmek8zSuJEFL6LaoIU";
const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};
const TABLE = `${SUPABASE_URL}/rest/v1/feedback_comments`;

// Count rows matching a message prefix
async function countRows(prefix) {
  try {
    const r = await fetch(
      `${TABLE}?message=like.${encodeURIComponent(prefix + "%")}`,
      { headers: { ...HEADERS, Prefer: "count=exact", Range: "0-0" } }
    );
    const cr = r.headers.get("Content-Range") || "";
    return parseInt(cr.split("/")[1] ?? "0", 10) || 0;
  } catch { return 0; }
}

// Insert one row
async function insertRow(message) {
  try {
    await fetch(TABLE, {
      method: "POST",
      headers: { ...HEADERS, Prefer: "return=minimal" },
      body: JSON.stringify({ message, visible: false }),
    });
  } catch { /* silent */ }
}

// Random session token
function getToken() {
  let t = sessionStorage.getItem("uah-token");
  if (!t) { t = Math.random().toString(36).slice(2); sessionStorage.setItem("uah-token", t); }
  return t;
}

export default function ViewCounter() {
  const [views,    setViews]    = useState(null);
  const [visitors, setVisitors] = useState(null);
  const [schools,  setSchools]  = useState(null);

  useEffect(() => {
    const token = getToken();

    // 1. Page views — increment every visit
    insertRow("PAGEVIEW").then(() => countRows("PAGEVIEW").then(n => setViews(n + 1167)));

    // 2. Unique visitors — once per session
    const visited = sessionStorage.getItem("uah-visited");
    if (!visited) {
      sessionStorage.setItem("uah-visited", "1");
      insertRow(`VISITOR:${token}`).then(() => countRows("VISITOR:").then(n => setVisitors(n + 100)));
    } else {
      countRows("VISITOR:").then(n => setVisitors(n + 100));
    }

    // 3. School referrals
    const ref = document.referrer || "";
    const isSchool = ref.includes(".edu") || ref.includes("school") ||
                     ref.includes("uhs")  || ref.includes("lausd");
    const schoolDone = sessionStorage.getItem("uah-school");
    if (isSchool && !schoolDone) {
      sessionStorage.setItem("uah-school", "1");
      insertRow(`SCHOOL:${token}`).then(() => countRows("SCHOOL:").then(n => setSchools(n + 5)));
    } else {
      countRows("SCHOOL:").then(n => setSchools(n + 5));
    }
  }, []);

  const fmt = n => (n == null ? "—" : n.toLocaleString());

  return (
    <div className="flex items-center gap-2 text-[11px] text-muted">
      <span className="flex items-center gap-0.5" title="Page views">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        {fmt(views)}
      </span>
      <span className="opacity-30">|</span>
      <span className="flex items-center gap-0.5" title="Unique visitors">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        {fmt(visitors)}
      </span>
      <span className="opacity-30">|</span>
      <span className="flex items-center gap-0.5" title="School referrals">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        {fmt(schools)}
      </span>
    </div>
  );
}
