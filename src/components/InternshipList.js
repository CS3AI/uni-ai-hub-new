"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

const PAGE_SIZE = 15;

const THEME_ACTIVE = {
  default: "brand-gradient text-white",
  blue:    "bg-blue-600 text-white",
  green:   "bg-green-600 text-white",
  amber:   "bg-amber-500 text-white",
};

function formatDate(iso, locale) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}

// ── Skill inference ────────────────────────────────────────
function inferSkills(title) {
  const t = (title || "").toLowerCase();
  const skills = [];
  if (/computer vision|cv |vision|image|3d|slam|lidar|point cloud/.test(t)) skills.push("Computer Vision");
  if (/nlp|natural language|language model|llm|text|speech|bert|gpt/.test(t)) skills.push("NLP / LLM");
  if (/reinforcement|rl |self.driv|autonomous|robot/.test(t)) skills.push("Reinforcement Learning");
  if (/machine learning|ml |deep learning|neural|pytorch|tensorflow/.test(t)) skills.push("ML / Deep Learning");
  if (/data science|data engineer|analytics|big data|sql|spark/.test(t)) skills.push("Data Science");
  if (/simulation|physics|hardware/.test(t)) skills.push("Simulation / Physics");
  if (/software|backend|frontend|fullstack|web|api|cloud/.test(t)) skills.push("Software Engineering");
  if (/research|paper|phd|scientist/.test(t)) skills.push("Research Methods");
  if (skills.some(s => ["ML / Deep Learning","Computer Vision","NLP / LLM","Reinforcement Learning","Data Science"].includes(s))) {
    if (!skills.includes("Python")) skills.unshift("Python");
  }
  return skills.slice(0, 4);
}

const SKILL_COLOR = {
  "Python":               "bg-blue-50 text-blue-700",
  "Computer Vision":      "bg-purple-50 text-purple-700",
  "NLP / LLM":            "bg-indigo-50 text-indigo-700",
  "Reinforcement Learning":"bg-orange-50 text-orange-700",
  "ML / Deep Learning":   "bg-green-50 text-green-700",
  "Data Science":         "bg-teal-50 text-teal-700",
  "Simulation / Physics": "bg-yellow-50 text-yellow-700",
  "Software Engineering": "bg-gray-100 text-gray-600",
  "Research Methods":     "bg-pink-50 text-pink-700",
};

// ── Content generation from title + skills ──────────────────
function generateWorkDesc(title, company, skills) {
  const t = (title || "").toLowerCase();
  if (/computer vision|3d|lidar|slam|point cloud/.test(t))
    return `Work on ${company}'s perception pipeline — object detection, segmentation, 3D scene understanding, or sensor fusion. Expect to train and evaluate CV models on real-world datasets using PyTorch or TensorFlow, and collaborate with autonomous systems or robotics engineers.`;
  if (/nlp|natural language|llm|language model|bert|gpt|speech/.test(t))
    return `Build and improve language models at ${company} — fine-tuning LLMs, developing evaluation benchmarks, or integrating NLP into product features. Work may include prompt engineering, RLHF pipelines, or scaling transformer training infrastructure.`;
  if (/reinforcement|self.driv|autonomous|robot/.test(t))
    return `Work on ${company}'s autonomous systems — training RL policies, building simulation environments, or developing planning and control algorithms. Projects span robotics, self-driving, or game-playing agents, with heavy use of Python and ML frameworks.`;
  if (/research scientist|research intern|ai research/.test(t))
    return `Conduct original research at ${company} alongside staff researchers — run experiments, analyze results, write internal reports, and potentially co-author publications. Projects likely involve novel ML architectures, evaluation frameworks, or applied AI for a specific domain.`;
  if (/data science|analytics|data engineer/.test(t))
    return `Analyze large-scale datasets at ${company} to extract insights, build predictive models, or design data pipelines. Work involves Python (pandas, scikit-learn), SQL, and possibly Spark — outputs often directly inform product or business decisions.`;
  if (/software|backend|api|cloud|platform|infra/.test(t))
    return `Build and maintain ML infrastructure or product features at ${company}. Work includes writing production code in Python/Go/Java, designing APIs, improving model serving pipelines, or contributing to cloud ML platform components.`;
  // Generic ML fallback
  return `Contribute to ${company}'s AI/ML efforts — training models, running experiments, improving pipelines, or integrating ML into products. The team works with Python and modern ML frameworks; interns typically own a defined project with real impact on shipped features.`;
}

function generateRequirements(title, skills) {
  const t = (title || "").toLowerCase();
  const isResearch = /research|scientist|phd/.test(t);
  const isCV = /computer vision|3d|lidar/.test(t);
  const isNLP = /nlp|llm|language model/.test(t);
  const isRL = /reinforcement|robot|autonomous/.test(t);
  const isData = /data science|analytics/.test(t);

  let base = "Currently enrolled in a BS/MS program in CS, Math, or a related field.";
  if (isResearch) base = "Graduate student (MS/PhD preferred) or exceptional senior undergrad with research experience.";

  const tech = [];
  if (skills.includes("Python") || true) tech.push("Strong Python skills");
  if (isCV) tech.push("PyTorch or TensorFlow", "familiarity with OpenCV or point cloud libraries");
  else if (isNLP) tech.push("Transformer architecture knowledge", "experience with HuggingFace or LLM fine-tuning");
  else if (isRL) tech.push("RL fundamentals (policy gradient, Q-learning)", "simulation frameworks (Gym, Isaac)");
  else if (isData) tech.push("pandas/SQL proficiency", "statistical modeling basics");
  else tech.push("ML/DL framework experience (PyTorch or TensorFlow)");

  if (isResearch) tech.push("prior publications or research experience preferred");

  return `${base} ${tech.join(", ")}. Strong CS fundamentals (data structures, algorithms). A portfolio or GitHub with relevant ML projects is a significant differentiator.`;
}

function generateTimeline(datePosted, title) {
  const t = (title || "").toLowerCase();
  const isSummer = /summer/.test(t);
  const isFall = /fall/.test(t);
  const isWinter = /winter/.test(t);
  const isSpring = /spring/.test(t);
  const isYearRound = /year.round|part.time|flexible/.test(t);

  if (isYearRound) return "Year-round / rolling — apply as soon as possible. Positions can close within days of posting.";
  if (isSummer) return "Summer internship — applications are live now. Most summer roles close January–March; top companies fill even earlier. Apply within the week of seeing a listing.";
  if (isFall) return "Fall internship (Sept–Dec) — applications typically open June–August. This listing is live now — apply promptly.";
  if (isWinter) return "Winter internship (Jan–Mar) — applications typically open September–November. Apply now if the role is open.";
  if (isSpring) return "Spring internship (Mar–May) — applications typically open November–January. Apply now while the position is live.";

  if (datePosted) {
    const daysAgo = Math.round((Date.now() - new Date(datePosted).getTime()) / 86400000);
    if (daysAgo <= 2) return "Posted very recently — apply within the next few days. AI/ML roles at competitive companies receive hundreds of applications and often close early.";
    if (daysAgo <= 7) return `Posted ${daysAgo} days ago — still fresh, but apply soon. AI/ML internships are highly competitive and roles can close before the official deadline.`;
    return `Posted ${daysAgo} days ago — verify the role is still open before applying. If it is, apply immediately as older listings may close any time.`;
  }
  return "Timeline not specified — apply as soon as possible. AI/ML internships are highly competitive; roles often close within 1–2 weeks of posting.";
}

// ── Paginator ─────────────────────────────────────────────
function Paginator({ page, total, pageSize, onPage, activeClass }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  return (
    <div className="flex flex-wrap justify-center gap-1.5 mt-6">
      <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
        className="px-3 py-1.5 rounded-lg text-xs font-medium card-surface text-muted disabled:opacity-30">‹</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onPage(p)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${page === p ? activeClass : "card-surface text-muted hover:text-foreground"}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPage(Math.min(pages, page + 1))} disabled={page === pages}
        className="px-3 py-1.5 rounded-lg text-xs font-medium card-surface text-muted disabled:opacity-30">›</button>
    </div>
  );
}

// ── Single listing card ────────────────────────────────────
function ListingCard({ item, locale }) {
  const [open, setOpen] = useState(false);
  const skills = useMemo(() => inferSkills(item.title), [item.title]);
  const workDesc = useMemo(() => generateWorkDesc(item.title, item.company, skills), [item.title, item.company, skills]);
  const requirements = useMemo(() => generateRequirements(item.title, skills), [item.title, skills]);
  const timeline = useMemo(() => generateTimeline(item.datePosted, item.title), [item.datePosted, item.title]);

  return (
    <li className="card-surface rounded-xl overflow-hidden">
      {/* ── Collapsed header ── */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold leading-snug">{item.title}</h3>
            {item.datePosted && (
              <span className="text-xs text-muted flex-shrink-0">{formatDate(item.datePosted, locale)}</span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            {item.company}{item.locations?.length ? ` · ${item.locations.join(", ")}` : ""}
          </p>
          {skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {skills.map(s => (
                <span key={s} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${SKILL_COLOR[s] || "bg-gray-100 text-gray-600"}`}>
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="text-gray-400 text-xs mt-0.5 flex-shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {/* ── Expanded detail ── */}
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Work Description</p>
            <p className="text-xs text-gray-600 leading-relaxed">{workDesc}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Application Timeline</p>
            <p className="text-xs text-gray-600 leading-relaxed">{timeline}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Requirements</p>
            <p className="text-xs text-gray-600 leading-relaxed">{requirements}</p>
          </div>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg px-3 py-1.5 transition-colors"
          >
            Apply Now →
          </a>
        </div>
      )}
    </li>
  );
}

// ── Main component ─────────────────────────────────────────
export default function InternshipList({ items, theme = "default" }) {
  const activeClass = THEME_ACTIVE[theme] ?? THEME_ACTIVE.default;
  const t = useTranslations("internship");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.title.toLowerCase().includes(q) || i.company.toLowerCase().includes(q));
  }, [items, query]);

  const handleQuery = (e) => { setQuery(e.target.value); setPage(1); };
  const paged = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  return (
    <div>
      <input value={query} onChange={handleQuery} placeholder={t("searchPlaceholder")}
        className="mb-4 w-full rounded-xl border bg-surface px-4 py-2 text-sm outline-none focus:border-green-500" />
      {filtered.length === 0 ? (
        <p className="text-sm text-muted">{t("searchEmpty")}</p>
      ) : (
        <>
          <p className="mb-3 text-xs text-muted">{filtered.length} listings</p>
          <ul className="space-y-2">
            {paged.map((item) => (
              <ListingCard key={item.id} item={item} locale={locale} />
            ))}
          </ul>
          <Paginator page={page} total={filtered.length} pageSize={PAGE_SIZE} onPage={setPage} activeClass={activeClass} />
        </>
      )}
    </div>
  );
}
