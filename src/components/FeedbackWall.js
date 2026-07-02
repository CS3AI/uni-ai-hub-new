"use client";
import { useState, useEffect } from "react";

const COUNTS_KEY  = "uah-reaction-counts";
const VOTED_KEY   = "uah-reactions-voted-v2";
const NAMESPACE   = "uni-ai-hub-ycm";

const SUPABASE_URL = "https://nonehrshbqcbpiamvzdk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbmVocnNoYnFjYnBpYW12emRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDg4MjUsImV4cCI6MjA5ODUyNDgyNX0.9OfnQumldllJEeM4XTQPfXHw6fmek8zSuJEFL6LaoIU";

const REACTIONS = [
  { id: "react-like",   emoji: "👍", label: "Like" },
  { id: "react-fire",   emoji: "🔥", label: "Fire" },
  { id: "react-rocket", emoji: "🚀", label: "Rocket" },
  { id: "react-bulb",   emoji: "💡", label: "Idea" },
];

const INIT_COUNTS = Object.fromEntries(REACTIONS.map((r) => [r.id, 0]));

export default function FeedbackWall({ title }) {
  const [counts, setCounts] = useState(INIT_COUNTS);
  const [voted, setVoted]   = useState({});
  const [comments, setComments] = useState([]);
  const [nick, setNick]     = useState("");
  const [msg, setMsg]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load reaction counts from localStorage
    try {
      const c = JSON.parse(localStorage.getItem(COUNTS_KEY) || "{}");
      setCounts((prev) => ({ ...prev, ...c }));
    } catch {}
    try {
      const v = JSON.parse(localStorage.getItem(VOTED_KEY) || "{}");
      setVoted(v);
    } catch {}

    // Silently sync reaction counts with counterapi
    REACTIONS.forEach((r) => {
      fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${r.id}`)
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data?.count != null) {
            setCounts((prev) => {
              const remote = data.count;
              if (remote > (prev[r.id] ?? 0)) {
                const merged = { ...prev, [r.id]: remote };
                try { localStorage.setItem(COUNTS_KEY, JSON.stringify(merged)); } catch {}
                return merged;
              }
              return prev;
            });
          }
        })
        .catch(() => {});
    });

    // Load comments from Supabase (shared across all users)
    fetch(`${SUPABASE_URL}/rest/v1/feedback_comments?order=created_at.desc&limit=50`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        if (Array.isArray(data)) {
          const parsed = data.map((row) => {
            try {
              const obj = JSON.parse(row.message);
              return {
                id: row.id,
                nick: obj.nick || "Anonymous",
                msg: obj.msg || row.message,
                date: row.created_at?.slice(0, 7) ?? "",
              };
            } catch {
              return {
                id: row.id,
                nick: "Anonymous",
                msg: row.message,
                date: row.created_at?.slice(0, 7) ?? "",
              };
            }
          });
          setComments(parsed);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleReact(reaction) {
    if (voted[reaction.id]) return;

    const newCounts = { ...counts, [reaction.id]: (counts[reaction.id] ?? 0) + 1 };
    const newVoted  = { ...voted, [reaction.id]: true };

    setCounts(newCounts);
    setVoted(newVoted);

    try {
      localStorage.setItem(COUNTS_KEY, JSON.stringify(newCounts));
      localStorage.setItem(VOTED_KEY,  JSON.stringify(newVoted));
    } catch {}

    fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${reaction.id}/up`).catch(() => {});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!msg.trim()) return;

    const nickVal = nick.trim() || "Anonymous";
    const msgVal  = msg.trim();
    const date    = new Date().toISOString().slice(0, 7);

    // Optimistic update
    const optimistic = { id: Date.now(), nick: nickVal, msg: msgVal, date };
    setComments((prev) => [optimistic, ...prev]);
    setNick("");
    setMsg("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);

    // Persist to Supabase
    fetch(`${SUPABASE_URL}/rest/v1/feedback_comments`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ message: JSON.stringify({ nick: nickVal, msg: msgVal }) }),
    }).catch(() => {});
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
              className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all
                ${voted[r.id]
                  ? "border-brand-end bg-brand-end/10 text-brand-end"
                  : "border-border hover:border-brand-end hover:bg-brand-end/5 cursor-pointer"}`}
            >
              <span className="text-base">{r.emoji}</span>
              <span>{counts[r.id] > 0 ? counts[r.id] : "—"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Comment Feed */}
      {loading ? (
        <p className="mb-4 text-sm text-muted">Loading comments...</p>
      ) : comments.length > 0 ? (
        <div className="mb-5 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl bg-background/60 px-4 py-3 text-sm">
              <span className="font-semibold">{c.nick}</span>
              <span className="ml-2 text-xs text-muted">[{c.date}]</span>
              <p className="mt-1 text-muted">{c.msg}</p>
            </div>
          ))}
        </div>
      ) : null}

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
          maxLength={800}
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
        <p className="text-xs text-muted">Comments are shared with all visitors.</p>
      </form>
    </div>
  );
}
