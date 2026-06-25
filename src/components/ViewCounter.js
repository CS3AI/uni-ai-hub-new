"use client";

import { useEffect, useState } from "react";

export default function ViewCounter() {
  const [views, setViews] = useState(null);

  useEffect(() => {
    // counterapi.dev: free, no signup, persistent across deploys
    fetch("https://api.counterapi.dev/v1/uni-ai-hub-ycm/pageviews/up")
      .then((r) => r.json())
      .then((d) => { if (d?.count != null) setViews(d.count); })
      .catch(() => {});
  }, []);

  if (views === null) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted" title="Total page views">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      {views.toLocaleString()}
    </span>
  );
}
