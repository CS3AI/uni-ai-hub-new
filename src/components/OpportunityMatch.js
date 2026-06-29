"use client";

import { useState } from "react";

// ── Recommendation database ───────────────────────────────────────────────────
const RESOURCES = [
  // Courses
  {
    id: "cs50ai", type: "course",
    title: "CS50's Introduction to AI with Python",
    institution: "Harvard University",
    url: "https://cs50.harvard.edu/ai/",
    desc: "Best starting point. Covers search, probability, neural nets, and NLP with hands-on Python projects. Free on edX.",
    grades: ["g9g10", "g11g12", "college"],
    interests: ["general", "nlp", "cv", "data"],
    levels: ["beginner", "intermediate"],
  },
  {
    id: "mslearn", type: "course",
    title: "Microsoft Learn · AI School",
    institution: "Microsoft",
    url: "https://learn.microsoft.com/training/",
    desc: "Structured free modules covering AI fundamentals, Azure ML, and Copilot development. Great for absolute beginners.",
    grades: ["g9g10", "g11g12"],
    interests: ["general", "applications"],
    levels: ["beginner"],
  },
  {
    id: "gcp", type: "course",
    title: "Google Cloud Skills Boost — AI Learning Path",
    institution: "Google",
    url: "https://www.cloudskillsboost.google/",
    desc: "Hands-on labs and quests for applied ML. Covers Vertex AI, BigQuery ML, and generative AI APIs.",
    grades: ["g9g10", "g11g12", "college"],
    interests: ["general", "data", "applications"],
    levels: ["beginner", "intermediate"],
  },
  {
    id: "mit_ocw", type: "course",
    title: "MIT OpenCourseWare · Artificial Intelligence",
    institution: "MIT",
    url: "https://ocw.mit.edu/",
    desc: "Full MIT lecture materials, problem sets, and exams — free. Rigorous and comprehensive across all AI subfields.",
    grades: ["g11g12", "college"],
    interests: ["general", "algorithms"],
    levels: ["intermediate", "advanced"],
  },
  {
    id: "cs188", type: "course",
    title: "CS188: Introduction to Artificial Intelligence",
    institution: "UC Berkeley",
    url: "https://inst.eecs.berkeley.edu/~cs188/",
    desc: "Classic AI course covering search, CSP, Bayesian networks, Markov models, and reinforcement learning. Full materials open.",
    grades: ["g11g12", "college"],
    interests: ["general", "robotics", "data", "algorithms"],
    levels: ["intermediate", "advanced"],
  },
  {
    id: "cs224n", type: "course",
    title: "CS224N: Natural Language Processing with Deep Learning",
    institution: "Stanford University",
    url: "https://web.stanford.edu/class/cs224n/",
    desc: "The gold standard NLP course. Covers transformers, LLMs, RLHF, and emerging architectures. Fully updated for the LLM era.",
    grades: ["g11g12", "college"],
    interests: ["nlp"],
    levels: ["intermediate", "advanced"],
  },
  {
    id: "cs231n", type: "course",
    title: "CS231N: Deep Learning for Computer Vision",
    institution: "Stanford University",
    url: "http://cs231n.stanford.edu/",
    desc: "The definitive CV course. CNNs, object detection, image generation, and 3D perception. Highly cited in industry.",
    grades: ["g11g12", "college"],
    interests: ["cv", "robotics"],
    levels: ["intermediate", "advanced"],
  },
  {
    id: "dli", type: "course",
    title: "NVIDIA Deep Learning Institute (DLI)",
    institution: "NVIDIA",
    url: "https://www.nvidia.com/en-us/training/",
    desc: "Hands-on GPU-accelerated training in deep learning, computer vision, NLP, and autonomous vehicles. Certificates included.",
    grades: ["g11g12", "college"],
    interests: ["general", "cv", "robotics", "applications"],
    levels: ["beginner", "intermediate"],
  },
  {
    id: "hai", type: "course",
    title: "Stanford HAI / AIMI Summer Research Program",
    institution: "Stanford HAI",
    url: "https://hai.stanford.edu/",
    desc: "Stanford Human-Centered AI summer programs for high schoolers. Research mentorship and access to Stanford faculty.",
    grades: ["g11g12"],
    interests: ["ethics", "healthcare", "general"],
    levels: ["intermediate", "advanced"],
  },
  {
    id: "spirit", type: "research",
    title: "Spirit AI High School Research Program",
    institution: "Spirit AI",
    url: "",
    desc: "One of the few research programs specifically designed for high schoolers. Mentored research projects with real publication potential.",
    grades: ["g9g10", "g11g12"],
    interests: ["general", "nlp", "cv", "robotics", "ethics"],
    levels: ["beginner", "intermediate"],
  },

  // Competitions
  {
    id: "kaggle", type: "competition",
    title: "Kaggle Competitions",
    institution: "Kaggle (Google)",
    url: "https://www.kaggle.com/competitions",
    desc: "Real data science challenges with cash prizes. Great for building ML intuition and portfolio projects. Runs year-round.",
    grades: ["g9g10", "g11g12", "college"],
    interests: ["general", "data", "cv", "nlp"],
    levels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "swift", type: "competition",
    title: "Apple Swift Student Challenge",
    institution: "Apple",
    url: "https://developer.apple.com/swift-student-challenge/",
    desc: "Annual app competition open to students worldwide. Winners get WWDC invitations and recognition from Apple.",
    grades: ["g9g10", "g11g12", "college"],
    interests: ["applications", "general"],
    levels: ["intermediate", "advanced"],
  },
  {
    id: "gsoc", type: "competition",
    title: "Google Summer of Code (18+)",
    institution: "Google",
    url: "https://summerofcode.withgoogle.com/",
    desc: "Paid open-source internship program. Work on real projects for top organizations. Must be 18+ — start preparing now.",
    grades: ["college"],
    interests: ["general", "nlp", "cv", "applications"],
    levels: ["intermediate", "advanced"],
  },

  // Internship paths
  {
    id: "simplify", type: "internship",
    title: "AI/ML Internship Listings (Live)",
    institution: "Simplify Jobs",
    url: "/internship",
    desc: "Check our live Internship board for current AI/ML openings. Updated daily from community-maintained sources.",
    grades: ["college"],
    interests: ["general", "nlp", "cv", "data", "robotics", "ethics", "applications"],
    levels: ["intermediate", "advanced"],
  },
  {
    id: "ucsd_hdsi", type: "course",
    title: "HDSI: Halicioglu Data Science Institute Programs",
    institution: "UC San Diego",
    url: "https://hdsi.ucsd.edu/",
    desc: "Open resources and programs for data science and AI, from intro to research-level. UCSD's flagship AI/DS institute.",
    grades: ["g11g12", "college"],
    interests: ["data", "general"],
    levels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "ipam", type: "course",
    title: "IPAM Machine Learning Research Programs",
    institution: "UCLA",
    url: "https://www.ipam.ucla.edu/",
    desc: "Research workshops and programs at the intersection of math and ML. Ideal if you want a rigorous theoretical foundation.",
    grades: ["college"],
    interests: ["algorithms", "data"],
    levels: ["advanced"],
  },
];

// ── Scoring & filtering ───────────────────────────────────────────────────────
function score(resource, grade, interest, level) {
  let s = 0;
  if (resource.grades.includes(grade))    s += 3;
  if (resource.interests.includes(interest)) s += 2;
  if (resource.levels.includes(level))    s += 1;
  return s;
}

// ── UI labels per locale ──────────────────────────────────────────────────────
const UI = {
  en: {
    title: "AI Opportunity Match",
    sub: "Tell us about yourself — get personalized AI learning recommendations",
    gradeLabel: "Your Grade / Level",
    interestLabel: "Interest Area",
    levelLabel: "Coding Experience",
    btn: "Find My Match →",
    resultsTitle: "Recommended for You",
    noResults: "Try a different combination — we're always adding more resources!",
    grades: { g9g10: "9th – 10th Grade", g11g12: "11th – 12th Grade", college: "College / University" },
    interests: { general: "General AI / Not Sure", nlp: "NLP & Large Language Models", cv: "Computer Vision", robotics: "Robotics & Autonomous Systems", data: "Data Science & Analytics", ethics: "AI Ethics & Policy", applications: "AI Product Building", algorithms: "Algorithms & Theory" },
    levels: { beginner: "Beginner (no coding yet)", intermediate: "Intermediate (some Python)", advanced: "Advanced (ML projects)" },
    types: { course: "Course", competition: "Competition", internship: "Internship", research: "Research Program" },
  },
  zh: {
    title: "AI 机会匹配",
    sub: "告诉我们你的情况，获取个性化 AI 学习推荐",
    gradeLabel: "你的年级",
    interestLabel: "兴趣方向",
    levelLabel: "编程水平",
    btn: "为我匹配 →",
    resultsTitle: "为你推荐",
    noResults: "换个组合试试，我们会持续添加更多资源！",
    grades: { g9g10: "高一 / 高二（9–10年级）", g11g12: "高三 / 高四（11–12年级）", college: "大学生" },
    interests: { general: "AI 通识 / 还没想好", nlp: "自然语言处理 & 大模型", cv: "计算机视觉", robotics: "机器人 & 自动驾驶", data: "数据科学", ethics: "AI 伦理与政策", applications: "AI 产品开发", algorithms: "算法与理论" },
    levels: { beginner: "零基础（无编程经验）", intermediate: "初级（有一些 Python 经验）", advanced: "进阶（有 ML 项目经验）" },
    types: { course: "课程", competition: "竞赛", internship: "实习", research: "科研项目" },
  },
  ja: {
    title: "AI 機会マッチング",
    sub: "あなたの情報を入力して、最適なAI学習リソースを見つけましょう",
    gradeLabel: "学年",
    interestLabel: "興味分野",
    levelLabel: "コーディング経験",
    btn: "マッチングする →",
    resultsTitle: "あなたへのおすすめ",
    noResults: "別の組み合わせを試してみてください！",
    grades: { g9g10: "高校1–2年生", g11g12: "高校3–4年生", college: "大学生" },
    interests: { general: "AI全般 / 未定", nlp: "自然言語処理 & LLM", cv: "コンピュータビジョン", robotics: "ロボティクス & 自律システム", data: "データサイエンス", ethics: "AI倫理 & 政策", applications: "AIプロダクト開発", algorithms: "アルゴリズム & 理論" },
    levels: { beginner: "初心者（未経験）", intermediate: "中級（Python経験あり）", advanced: "上級（MLプロジェクト経験）" },
    types: { course: "コース", competition: "コンペ", internship: "インターン", research: "研究プログラム" },
  },
};

function getUI(locale) {
  return UI[locale] || UI.en;
}

const TYPE_COLORS = {
  course:      "bg-blue-50 text-blue-700",
  competition: "bg-yellow-50 text-yellow-700",
  internship:  "bg-green-50 text-green-700",
  research:    "bg-purple-50 text-purple-700",
};

export default function OpportunityMatch({ locale }) {
  const u = getUI(locale);
  const [grade, setGrade]       = useState("");
  const [interest, setInterest] = useState("");
  const [level, setLevel]       = useState("");
  const [results, setResults]   = useState(null);

  function handleMatch() {
    if (!grade || !interest || !level) return;
    const scored = RESOURCES
      .map((r) => ({ ...r, score: score(r, grade, interest, level) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    setResults(scored);
  }

  const ready = grade && interest && level;

  return (
    <div className="mt-10 card-surface rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-5">
        <div>
          <h2 className="text-base font-bold">{u.title}</h2>
          <p className="text-xs text-muted mt-0.5">{u.sub}</p>
        </div>
        
      </div>

      {/* Selectors */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
            {u.gradeLabel}
          </label>
          <select
            value={grade}
            onChange={(e) => { setGrade(e.target.value); setResults(null); }}
            className="w-full rounded-xl border border-gray-200 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-start/40"
          >
            <option value="">—</option>
            {Object.entries(u.grades).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
            {u.interestLabel}
          </label>
          <select
            value={interest}
            onChange={(e) => { setInterest(e.target.value); setResults(null); }}
            className="w-full rounded-xl border border-gray-200 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-start/40"
          >
            <option value="">—</option>
            {Object.entries(u.interests).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
            {u.levelLabel}
          </label>
          <select
            value={level}
            onChange={(e) => { setLevel(e.target.value); setResults(null); }}
            className="w-full rounded-xl border border-gray-200 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-start/40"
          >
            <option value="">—</option>
            {Object.entries(u.levels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleMatch}
        disabled={!ready}
        className={`mt-4 w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          ready
            ? "brand-gradient text-white hover:opacity-90 shadow-sm"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {u.btn}
      </button>

      {/* Results */}
      {results !== null && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
            {u.resultsTitle}
          </p>
          {results.length === 0 ? (
            <p className="text-sm text-muted">{u.noResults}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((r) => (
                <a
                  key={r.id}
                  href={r.url || "#"}
                  target={r.url ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="group flex gap-3 rounded-xl border border-gray-100 bg-background p-4 hover:border-brand-start/30 hover:shadow-sm transition-all"
                >
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TYPE_COLORS[r.type] || TYPE_COLORS.course}`}>
                        {u.types[r.type] || r.type}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-brand-end transition-colors leading-snug">
                      {r.title}
                    </p>
                    <p className="text-[11px] text-muted mt-0.5">{r.institution}</p>
                    <p className="text-xs text-muted mt-1.5 leading-relaxed">{r.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
