"use client";
import { useState, useEffect } from "react";

export default function CourseTabs({ tabs }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) {
      const offset = 72; // navbar height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setActive(id);
    }
  }

  useEffect(() => {
    const observers = [];
    tabs.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-20% 0px -70% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [tabs]);

  return (
    <div className="flex flex-wrap gap-2 mb-8 sticky top-[57px] z-30 bg-red-50 py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-red-100">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition whitespace-nowrap ${
            active === id
              ? "bg-red-500 text-white shadow-sm"
              : "card-surface border border-border text-muted hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
