"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "uah-debriefs";

const SEED = [
  {
    nick: "匿名学姐",
    date: "2026-06",
    msg: "投了 Rivian 自动驾驶实习，第一轮被问到了大量计算机视觉基础（如边缘检测原理），建议大家提前复习 Stanford CS231N 的前 3 讲",
  },
  {
    nick: "Kevin",
    date: "2026-06",
    msg: '投递了某非盈利组织的 AI 志愿岗位，对方非常看重"如何用 AI 辅助无障碍设计（Accessibility）"，这个方向值得提前研究一下',
  },
];

export default function PeerDebriefs({ title, desc, submitBtn, nickPlaceholder, msgPlaceholder, submitDone, submitNote }) {
  const [entries, setEntries] = useState(SEED);
  const [nick, setNick] = useState("");
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (saved.length > 0) setEntries([...SEED, ...saved]);
    } catch {}
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    const now = new Date().toISOString().slice(0, 7);
    const entry = { nick: nick.trim() || "匿名", date: now, msg: msg.trim() };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      saved.unshift(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      setEntries([...SEED, ...saved]);
    } catch {
      setEntries((prev) => [entry, ...prev]);
    }
    setMsg("");
    setNick("");
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  };

  return (
    <div>
      <p className="mb-3 text-sm text-muted">{desc}</p>

      {/* Feed */}
      <ul className="mb-4 space-y-2">
        {entries.map((e, i) => (
          <li key={i} className="rounded-xl border border-gray-100 bg-surface px-4 py-3 text-sm">
            <span className="font-semibold text-foreground text-xs">
              [{e.date}] {e.nick}
            </span>
            <span className="text-muted ml-1">{e.msg}</span>
          </li>
        ))}
      </ul>

      {/* Submit form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          placeholder={nickPlaceholder}
          className="w-full rounded-xl border bg-background px-3 py-1.5 text-sm outline-none focus:border-green-400"
        />
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder={msgPlaceholder}
          rows={2}
          className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-green-400 resize-none"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-green-600 text-white text-xs font-semibold px-4 py-1.5 hover:bg-green-700 transition"
          >
            {done ? submitDone : submitBtn}
          </button>
          <p className="text-[10px] text-muted">{submitNote}</p>
        </div>
      </form>
    </div>
  );
}
