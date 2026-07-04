"use client";
import { useState, useEffect } from "react";

const COUNTS_KEY   = "uah-reaction-counts";
const VOTED_KEY    = "uah-reactions-voted-v2";
const MY_IDS_KEY   = "uah-my-comment-ids";
const SESSION_KEY  = "uah-session-token";
const NAMESPACE    = "uni-ai-hub-ycm";

const SUPABASE_URL = "https://nonehrshbqcbpiamvzdk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbmVocnNoYnFjYnBpYW12emRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDg4MjUsImV4cCI6MjA5ODUyNDgyNX0.9OfnQumldllJEeM4XTQPfXHw6fmek8zSuJEFL6LaoIU";

const REACTIONS = [
  { id: "react-like",   emoji: "👍", label: "Like" },
  { id: "react-fire",   emoji: "🔥", label: "Fire" },
  { id: "react-rocket", emoji: "🚀", label: "Rocket" },
  { id: "react-bulb",   emoji: "💡", label: "Idea" },
];

const INIT_COUNTS = Object.fromEntries(REACTIONS.map((r) => [r.id, 0]));

function getOrCreateSession() {
  try {
    let token = localStorage.getItem(SESSION_KEY);
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, token);
    }
    return token;
  } catch { return "anon"; }
}

export default function FeedbackWall({ title }) {
  const [counts, setCounts]   = useState(INIT_COUNTS);
  const [voted, setVoted]     = useState({});
  const [comments, setComments] = useState([]);
  const [myIds, setMyIds]     = useState([]);
  const [nick, setNick]       = useState("");
  const [msg, setMsg]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    // Reactions from localStorage
    try {
      const c = JSON.parse(localStorage.getItem(COUNTS_KEY) || "{}");
      setCounts((prev) => ({ ...prev, ...c }));
    } catch {}
    try {
      const v = JSON.parse(localStorage.getItem(VOTED_KEY) || "{}");
      setVoted(v);
    } catch {}
    try {
      const ids = JSON.parse(localStorage.getItem(MY_IDS_KEY) || "[]");
      setMyIds(ids);
    } catch {}

    // Sync reaction counts from counterapi (best-effort)
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

    // Load visible comments from Supabase
    fetch(`${SUPABASE_URL}/rest/v1/feedback_comments?visible=eq.true&order=created_at.desc&limit=50`, {
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
              return { id: row.id, nick: obj.nick || "Anonymous", msg: obj.msg || row.message, date: row.created_at?.slice(0, 7) ?? "" };
            } catch {
              return { id: row.id, nick: "Anonymous", msg: row.message, date: row.created_at?.slice(0, 7) ?? "" };
            }
          });
          setComments(parsed);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleReact(reaction) {
    // Always increment — no undo, no limit
    const newCounts = { ...counts, [reaction.id]: (counts[reaction.id] ?? 0) + 1 };
    setCounts(newCounts);
    try { localStorage.setItem(COUNTS_KEY, JSON.stringify(newCounts)); } catch {}
    fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${reaction.id}/up`).catch(() => {});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!msg.trim()) return;

    const sessionToken = getOrCreateSession();
    const nickVal = nick.trim() || "Anonymous";
    const msgVal  = msg.trim();
    const date    = new Date().toISOString().slice(0, 7);
    const tempId  = Date.now();

    // Optimistic update
    setComments((prev) => [{ id: tempId, nick: nickVal, msg: msgVal, date }, ...prev]);
    setMyIds((prev) => {
      const next = [...prev, tempId];
      try { localStorage.setItem(MY_IDS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    setNick("");
    setMsg("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);

    // Persist to Supabase
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/feedback_comments`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          message: JSON.stringify({ nick: nickVal, msg: msgVal }),
          session_token: sessionToken,
        }),
      });
      if (res.ok) {
        const [saved] = await res.json();
        if (saved?.id) {
          // Replace temp id with real id
          setComments((prev) => prev.map((c) => c.id === tempId ? { ...c, id: saved.id } : c));
          setMyIds((prev) => {
            const next = prev.map((id) => id === tempId ? saved.id : id);
            try { localStorage.setItem(MY_IDS_KEY, JSON.stringify(next)); } catch {}
            return next;
          });
        }
      }
    } catch {}
  }

  async function handleDelete(commentId) {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setMyIds((prev) => {
      const next = prev.filter((id) => id !== commentId);
      try { localStorage.setItem(MY_IDS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    fetch(`${SUPABASE_URL}/rest/v1/feedback_comments?id=eq.${commentId}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
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
              title={voted[r.id] ? "Click to undo" : r.label}
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-all cursor-pointer hover:border-brand-end hover:bg-brand-end/5"
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
        <div className="mb-5">
          <div className="space-y-3">
            {comments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((c) => (
              <div key={c.id} className="group relative rounded-xl bg-background/60 px-4 py-3 text-sm">
                <span className="font-semibold">{c.nick}</span>
                <span className="ml-2 text-xs text-muted">[{c.date}]</span>
                {myIds.includes(c.id) && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="absolute right-3 top-3 hidden group-hover:block text-xs text-muted hover:text-red-500 transition-colors"
                    title="Delete my comment"
                  >
                    ✕
                  </button>
                )}
                <p className="mt-1 text-muted">{c.msg}</p>
              </div>
            ))}
          </div>
          {comments.length > PAGE_SIZE && (
            <div className="mt-3 flex items-center justify-between text-xs text-muted">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded px-2 py-1 border border-border disabled:opacity-30 hover:border-brand-end transition-colors"
              >
                ← Prev
              </button>
              <span>Page {page} / {Math.ceil(comments.length / PAGE_SIZE)}</span>
              <button
                onClick={() => setPage((p) => Math.min(Math.ceil(comments.length / PAGE_SIZE), p + 1))}
                disabled={page === Math.ceil(comments.length / PAGE_SIZE)}
                className="rounded px-2 py-1 border border-border disabled:opacity-30 hover:border-brand-end transition-colors"
              >
                Next →
              </button>
            </div>
          )}
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
