"use client";
import { useState, useEffect } from "react";

const NAMESPACE = "uni-ai-hub-ycm";
const STORAGE_KEY = "uah-comments";

const REACTIONS = [
  { id: "react-like",   emoji: "👍", label: "Like" },
  { id: "react-fire",   emoji: "🔥", label: "Fire" },
  { id: "react-rocket", emoji: "🚀", label: "Rocket" },
  { id: "react-bulb",   emoji: "💡", label: "Idea" },
];

const SEED_COMMENTS = [
  { nick: "Jay", date: "2026-06", msg: "This site helped me find my Rivian internship application — the timeline section was super useful!" },
  { nick: "Sophia", date: "2026-06", msg: "Love the Global Competitions tab. Found IOAI through here and made it to the national round." },
];

async function fetchCount(reactionId) {
  try {
    const res = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${reactionId}`, { cache: "no-store" });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.count ?? 0;
  } catch { return 0; }
}

async function incrementCount(reactionId) {
  try {
    const res = await fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${reactionId}/up`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.count ?? null;
  } catch { return null; }
}

export default function FeedbackWall({ title }) {
  const [counts, setCounts] = useState({});
  const [voted, setVoted] = useState({});
  const [comments, setComments] = useState(SEED_COMMENTS);
  const [nick, setNick] = useState("");
  const [msg, setMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Load reaction votes from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("uah-reactions-voted") || "{}");
      setVoted(saved);
    } catch {}
    // Load comments
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (saved.length > 0) setComments([...SEED_COMMENTS, ...saved]);
    } catch {}
    // Fetch counts
    REACTIONS.forEach(async (r) => {
      const c = await fetchCount(r.id);
      setCounts((prev) => ({ ...prev, [r.id]: c }));
    });
  }, []);

  async function handleReact(reaction) {
    if (voted[reaction.id]) return;
    const newCount = await incrementCount(reaction.id);
    if (newCount !== null) {
      setCounts((prev) => ({ ...prev, [reaction.id]: newCount }));
    } else {
      setCounts((prev) => ({ ...prev, [reaction.id]: (prev[reaction.id] ?? 0) + 1 }));
    }
    const newVoted = { ...voted, [reaction.id]: true };
    setVoted(newVoted);
    try { localStorage.setItem("uah-reactions-voted", JSON.stringify(newVoted)); } catch {}
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!msg.trim()) return;
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const entry = { nick: nick.trim() || "Anonymous", date, msg: msg.trim() };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      saved.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {}
    setComments((prev) => [...prev, entry]);
    setNick("");
    setMsg("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="card-surface rounded-2xl p-6">
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}

      {/* Emoji Reactions */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-muted">How is this site helping you?</p>
        <div className="flex flex-wrap gap-3">
          {REACTIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => handleReact(r)}
              disabled={!!voted[r.id]}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all
                ${voted[r.id]
                  ? "border-brand-end bg-brand-end/10 text-brand-end cursor-default"
                  : "border-border hover:border-brand-end hover:bg-brand-end/5 cursor-pointer"}`}
            >
              <span className="text-base">{r.emoji}</span>
              <span>{counts[r.id] ?? "—"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comment Feed */}
      <div className="mb-5 space-y-3">
        {comments.map((c, idx) => (
          <div key={idx} className="rounded-xl bg-background/60 px-4 py-3 text-sm">
            <span className="font-semibold">{c.nick}</span>
            <span className="ml-2 text-xs text-muted">[{c.date}]</span>
            <p className="mt-1 text-muted">{c.msg}</p>
          </div>
        ))}
      </div>

      {/* Submit Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <p className="text-sm font-medium">Leave a note (anonymous)</p>
        <input
          type="text"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          placeholder="Your name or nickname (optional)"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-brand-end"
          maxLength={40}
        />
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Share a thought, tip, or experience..."
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-brand-end resize-none"
          maxLength={300}
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="brand-gradient rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Post Anonymously
          </button>
          {submitted && <span className="text-sm text-green-600 font-medium">Posted!</span>}
        </div>
        <p className="text-xs text-muted">Stored locally on your device only.</p>
      </form>
    </div>
  );
}
