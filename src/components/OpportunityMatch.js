"use client";
import { useState } from "react";

// ── Resource database ─────────────────────────────────────────────────────────
const RESOURCES = [
  // ── Courses ──────────────────────────────────────────────────────────────
  { id:"cs50ai", type:"course", title:"CS50's Introduction to AI with Python", institution:"Harvard University",
    url:"https://cs50.harvard.edu/ai/", desc:"Best starting point. Covers search, probability, neural nets, and NLP with hands-on Python projects. Free on edX.",
    whyJoin:"Harvard's CS50 AI is the most student-friendly way to enter AI — the problem sets are genuinely engaging, and Harvard's open courseware gives you the full experience for free. It's the course most referenced by high school students who later landed research programs and top internships.",
    grades:["g9g10","g11g12","college"], tech:["general","nlp","cv","data"], industries:["education","business","healthcare"],
    levels:["beginner","intermediate"] },
  { id:"mslearn", type:"course", title:"Microsoft Learn · AI School", institution:"Microsoft",
    url:"https://learn.microsoft.com/training/", desc:"Free structured modules covering AI fundamentals, Azure ML, and Copilot development.",
    whyJoin:"Microsoft's platform is backed by real Azure cloud infrastructure — completing these paths makes you directly relevant to the world's largest cloud AI marketplace. The certificates are recognized by hiring managers at Microsoft and thousands of partner companies.",
    grades:["g9g10","g11g12"], tech:["general","applications"], industries:["business","education"],
    levels:["beginner"] },
  { id:"gcp", type:"course", title:"Google Cloud Skills Boost — AI Learning Path", institution:"Google",
    url:"https://www.cloudskillsboost.google/", desc:"Hands-on labs for applied ML: Vertex AI, BigQuery ML, and generative AI APIs.",
    whyJoin:"Google Cloud AI certifications are increasingly required for ML engineering roles. The labs run on production-grade cloud infrastructure — you learn the same tools used by engineers at Google, Spotify, and Airbnb from day one.",
    grades:["g9g10","g11g12","college"], tech:["general","data","applications"], industries:["business","finance","climate"],
    levels:["beginner","intermediate"] },
  { id:"mit_ocw", type:"course", title:"MIT OpenCourseWare · Artificial Intelligence", institution:"MIT",
    url:"https://ocw.mit.edu/", desc:"Full MIT lecture materials, problem sets, and exams — free. Rigorous and comprehensive.",
    whyJoin:"MIT OCW gives you exactly what MIT students study — no paywalls, no simplified versions. If you can work through the problem sets, you'll have a foundation that holds up at any university or top tech company.",
    grades:["g11g12","college"], tech:["general","algorithms"], industries:["general"],
    levels:["intermediate","advanced"] },
  { id:"cs188", type:"course", title:"CS188: Introduction to Artificial Intelligence", institution:"UC Berkeley",
    url:"https://inst.eecs.berkeley.edu/~cs188/", desc:"Classic AI course: search, Bayesian networks, Markov models, RL. Full materials open.",
    whyJoin:"Berkeley's CS188 has trained more working AI engineers than almost any other single course. Its search and probabilistic reasoning modules directly map to skills tested in ML engineering interviews at top companies.",
    grades:["g11g12","college"], tech:["general","robotics","data","algorithms"], industries:["general","climate"],
    levels:["intermediate","advanced"] },
  { id:"cs224n", type:"course", title:"CS224N: NLP with Deep Learning", institution:"Stanford University",
    url:"https://web.stanford.edu/class/cs224n/", desc:"Gold standard NLP course. Covers transformers, LLMs, RLHF. Fully updated for the LLM era.",
    whyJoin:"CS224N is the course virtually every NLP researcher cites as foundational. If you want to understand how GPT-4 works under the hood — or build your own LLM application — this is where to start.",
    grades:["g11g12","college"], tech:["nlp"], industries:["business","law","education","healthcare"],
    levels:["intermediate","advanced"] },
  { id:"cs231n", type:"course", title:"CS231N: Deep Learning for Computer Vision", institution:"Stanford University",
    url:"http://cs231n.stanford.edu/", desc:"Definitive CV course. CNNs, object detection, image generation, 3D perception.",
    whyJoin:"Computer vision is one of the highest-paying specializations in AI. CS231N's project-based format means you finish with real code you can show internship interviewers — and the skills transfer directly to autonomous vehicles, medical imaging, and robotics.",
    grades:["g11g12","college"], tech:["cv","robotics"], industries:["healthcare","biology","climate"],
    levels:["intermediate","advanced"] },
  { id:"dli", type:"course", title:"NVIDIA Deep Learning Institute (DLI)", institution:"NVIDIA",
    url:"https://www.nvidia.com/en-us/training/", desc:"GPU-accelerated training in DL, CV, NLP, and autonomous vehicles. Certificates included.",
    whyJoin:"NVIDIA certificates are recognized by employers because NVIDIA hardware powers most production AI. Completing a DLI course proves you can work with real GPUs — not just cloud APIs — which is a meaningful signal to hiring managers.",
    grades:["g11g12","college"], tech:["general","cv","robotics","applications"], industries:["general","climate"],
    levels:["beginner","intermediate"] },
  { id:"hai", type:"course", title:"Stanford HAI / AIMI Summer Research Program", institution:"Stanford HAI",
    url:"https://hai.stanford.edu/", desc:"Stanford Human-Centered AI summer programs for high schoolers. Research with Stanford faculty.",
    whyJoin:"Stanford HAI summer programs put you in direct contact with the researchers shaping AI policy and responsible AI. The network you build — fellow students, faculty, and guest speakers — has real long-term career value that lasts well beyond the program itself.",
    grades:["g11g12"], tech:["ethics","general"], industries:["healthcare","education","law"],
    levels:["intermediate","advanced"] },
  { id:"hdsi", type:"course", title:"HDSI: Halicioglu Data Science Institute Programs", institution:"UC San Diego",
    url:"https://hdsi.ucsd.edu/", desc:"Data science and AI resources from intro to research-level.",
    whyJoin:"UCSD's HDSI has one of the most applied data science curricula in the UC system. Their resources are specifically designed to take students from zero to research-ready — with a clear pathway from intro courses to faculty-mentored projects.",
    grades:["g11g12","college"], tech:["data","general"], industries:["biology","healthcare","finance"],
    levels:["beginner","intermediate","advanced"] },

  // ── Competitions / Challenges ─────────────────────────────────────────────
  { id:"kaggle", type:"competition", title:"Kaggle Competitions", institution:"Kaggle (Google)",
    url:"https://www.kaggle.com/competitions", desc:"Real data science challenges with cash prizes. Great for building ML intuition and portfolio projects.",
    whyJoin:"Kaggle is the fastest way to build an ML portfolio employers actually notice. A top-10% finish on any public competition makes your resume stand out immediately — the datasets are free and the community is the most supportive in data science.",
    grades:["g9g10","g11g12","college"], tech:["general","data","cv","nlp"], industries:["business","finance","healthcare","biology"],
    levels:["beginner","intermediate","advanced"] },
  { id:"ioai", type:"competition", title:"International Olympiad in Artificial Intelligence (IOAI)", institution:"IOAI",
    url:"https://ioai-official.org/", desc:"The Olympics of AI for high schoolers. Theory exam + practical ML coding challenge.",
    whyJoin:"IOAI is the most prestigious AI competition for high schoolers globally. Even qualifying for your national team is a credential recognized by university admissions at MIT, Stanford, and CMU — and medal winners regularly receive direct outreach from top tech companies.",
    grades:["g9g10","g11g12"], tech:["general","algorithms","data"], industries:["general"],
    levels:["advanced"] },
  { id:"swift", type:"competition", title:"Apple Swift Student Challenge", institution:"Apple",
    url:"https://developer.apple.com/swift-student-challenge/", desc:"Annual app competition. Winners get WWDC invitations and recognition from Apple.",
    whyJoin:"Apple's WWDC invitation alone is worth the application — only a few hundred students globally are selected each year. Past winners have received Apple internship offers directly through the challenge, and the credential is immediately recognizable on any tech resume.",
    grades:["g9g10","g11g12","college"], tech:["applications","general"], industries:["education","art","business"],
    levels:["intermediate","advanced"] },
  { id:"google_sol", type:"competition", title:"Google Solution Challenge", institution:"Google",
    url:"https://developers.google.com/community/gdsc/solution-challenge", desc:"Build a UN SDG solution using Google tech. Teams win mentorship and cash prizes.",
    whyJoin:"Google Solution Challenge winners get mentorship from Google engineers and real international visibility. The UN SDG framing also gives you a powerful college essay narrative around real-world AI impact — something admissions officers respond to strongly.",
    grades:["g11g12","college"], tech:["applications","ethics","general"], industries:["climate","education","healthcare","law"],
    levels:["beginner","intermediate","advanced"] },

  // ── Research Programs ─────────────────────────────────────────────────────
  { id:"spirit", type:"research", title:"Spirit AI High School Research Program", institution:"Spirit AI",
    url:"", desc:"Mentored AI research for high schoolers. Real publication potential.",
    whyJoin:"Spirit AI is specifically designed for high schoolers — most research programs are for undergrads only. A peer-reviewed publication from high school is an exceptional differentiator for college applications to top CS programs, and the mentors are researchers at leading AI labs.",
    grades:["g9g10","g11g12"], tech:["general","nlp","cv","robotics","ethics"], industries:["general","healthcare","education"],
    levels:["beginner","intermediate"] },
  { id:"rsi", type:"research", title:"RSI — Research Science Institute", institution:"MIT / CEE",
    url:"https://www.cee.org/research-science-institute", desc:"6-week on-campus research at MIT — among the most prestigious science programs in the world.",
    whyJoin:"RSI is among the most selective programs in the world (~1.5% acceptance rate). Alumni include Intel STS finalists and students admitted to MIT, Harvard, and Stanford at exceptionally high rates. The on-campus research experience is unmatched for a high school student.",
    grades:["g11g12"], tech:["general","algorithms","data"], industries:["biology","healthcare","climate"],
    levels:["advanced"] },

  // ── Internships ───────────────────────────────────────────────────────────
  { id:"internship_live", type:"internship", title:"Live AI/ML Internship Listings", institution:"Uni AI Hub",
    url:"/internship", desc:"Browse our live board for current AI/ML openings — updated daily. Includes industry and non-profit roles.",
    whyJoin:"Our live board aggregates roles from the most active AI job feeds — updated daily. Most students miss great openings simply because they don't check consistently. Setting a 2-minute daily check is how most people catch roles before they close.",
    grades:["g11g12","college"], tech:["general","nlp","cv","data","robotics","applications"],
    industries:["business","healthcare","biology","finance","climate","education","art"],
    levels:["intermediate","advanced"] },
  { id:"gsoc", type:"internship", title:"Google Summer of Code (18+)", institution:"Google",
    url:"https://summerofcode.withgoogle.com/", desc:"Paid open-source internship. Work on real projects for top organizations.",
    whyJoin:"Google Summer of Code pays you to contribute to open-source AI projects — stipends range from $1,500 to $6,600. The alumni network is one of the strongest in open-source software, and GSoC on your resume signals genuine engineering ability to any technical hiring manager.",
    grades:["college"], tech:["general","nlp","cv","applications"], industries:["education","business","general"],
    levels:["intermediate","advanced"] },

  // ── Volunteer ─────────────────────────────────────────────────────────────
  { id:"gdsc", type:"volunteer", title:"Google Developer Student Clubs (GDSC)", institution:"Google",
    url:"https://developers.google.com/community/gdsc", desc:"Student-led community clubs sponsored by Google. Lead AI workshops and projects.",
    whyJoin:"Leading a GDSC chapter gives you a title, a Google-sponsored budget, and direct access to Google engineers. Both universities and employers value the leadership and community impact — and it's one of the few high school activities directly tied to a Google credential.",
    grades:["g11g12","college"], tech:["general","applications"], industries:["education","business"],
    levels:["beginner","intermediate"] },
  { id:"codeorg", type:"volunteer", title:"Code.org — Volunteer Educator", institution:"Code.org",
    url:"https://code.org/volunteer", desc:"Teach CS and AI to K-12 students. Great for education-focused students.",
    whyJoin:"Teaching CS through Code.org is one of the clearest ways to prove you understand AI well enough to explain it — a skill that matters enormously in both research and industry. It also builds a genuine record of community impact for college applications.",
    grades:["g9g10","g11g12","college"], tech:["general","ethics"], industries:["education"],
    levels:["beginner","intermediate"] },
  { id:"aiforgood_vol", type:"volunteer", title:"AI for Good — Youth Ambassador", institution:"ITU / UN",
    url:"https://aiforgood.itu.int/", desc:"Represent AI for Good at global events. Focus on SDGs, policy, and developing-world AI applications.",
    whyJoin:"ITU's AI for Good program has UN backing and connects students directly to global policymakers. Youth Ambassador status has led to speaking invitations at UN-affiliated conferences — and the international network is unlike anything available through a typical school program.",
    grades:["g11g12","college"], tech:["ethics","applications"], industries:["healthcare","education","climate","law"],
    levels:["intermediate","advanced"] },
  { id:"first_mentor", type:"volunteer", title:"FIRST Robotics — Student Mentor", institution:"FIRST",
    url:"https://www.firstinspires.org/", desc:"Mentor younger teams in robotics and AI systems. Builds leadership skills.",
    whyJoin:"Mentoring a FIRST team shows universities you're committed to giving back — not just consuming knowledge. It also builds the technical communication skills that matter in every engineering career, and FIRST alumni networks are active in robotics and hardware AI roles.",
    grades:["g11g12","college"], tech:["robotics","general"], industries:["education","general"],
    levels:["intermediate"] },

  // ── Lectures ──────────────────────────────────────────────────────────────
  { id:"karpathy", type:"lecture", title:"Neural Networks: Zero to Hero", institution:"Andrej Karpathy · YouTube",
    url:"https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", desc:"Build LLMs from scratch. The most hands-on introduction to deep learning available for free.",
    whyJoin:"Andrej Karpathy built Tesla's AI curriculum and was a founding member of OpenAI. His content is trusted by ML practitioners worldwide — more rigorous than most university courses and completely free. Engineers at top labs cite this series as essential viewing.",
    grades:["g9g10","g11g12","college"], tech:["general","nlp","algorithms"], industries:["general"],
    levels:["beginner","intermediate"] },
  { id:"deepmind", type:"lecture", title:"Google DeepMind Research Talks", institution:"Google DeepMind · YouTube",
    url:"https://www.youtube.com/@Google_DeepMind", desc:"Frontier research talks on RL, LLMs, and science applications from DeepMind researchers.",
    whyJoin:"DeepMind produced AlphaFold, AlphaGo, and Gemini. Watching their researchers present work-in-progress gives you a real sense of what frontier AI research actually looks like — essential context if you're considering a PhD or research career.",
    grades:["g11g12","college"], tech:["general","algorithms","cv"], industries:["biology","healthcare","climate"],
    levels:["intermediate","advanced"] },
  { id:"stanfordhai_lec", type:"lecture", title:"Stanford HAI Public Lectures", institution:"Stanford HAI · YouTube",
    url:"https://www.youtube.com/@stanfordhai", desc:"Fei-Fei Li and guests on human-centered AI, policy, and societal impact.",
    whyJoin:"Stanford HAI shapes AI policy at the state and federal level. Understanding the human-centered AI framework they champion makes you a more thoughtful engineer or researcher — and gives you a strong, distinctive perspective for college essays and interviews about AI's future.",
    grades:["g9g10","g11g12","college"], tech:["ethics","general"], industries:["law","education","healthcare","business"],
    levels:["beginner","intermediate","advanced"] },

  // ── Conferences ───────────────────────────────────────────────────────────
  { id:"ted_ai_conf", type:"conference", title:"TED AI Conference", institution:"TED",
    url:"https://ted.com/ai", desc:"Top researchers and entrepreneurs on generative AI, ethics, and society. Student tickets available.",
    whyJoin:"TED AI attracts decision-makers, not just engineers. Attending (or watching the free livestream) exposes you to the business, policy, and creative dimensions of AI that most technical courses miss — and the talks often surface emerging opportunities months before they go mainstream.",
    grades:["g11g12","college"], tech:["ethics","general","applications"], industries:["business","law","education","art"],
    levels:["beginner","intermediate","advanced"] },
  { id:"nvidia_gtc", type:"conference", title:"NVIDIA GTC — Keynote & Sessions", institution:"NVIDIA",
    url:"https://www.nvidia.com/gtc/", desc:"Jensen Huang + NVIDIA researchers on AI hardware, deep learning, and robotics. Free online access.",
    whyJoin:"GTC is where NVIDIA announces what the next generation of AI hardware and software will look like — before it ships. Free online access means you follow the same sessions that ML engineers at major labs attend, giving you an early read on where the field is heading.",
    grades:["g11g12","college"], tech:["general","cv","robotics","algorithms"], industries:["business","climate","general"],
    levels:["beginner","intermediate","advanced"] },
];

// ── Scoring ───────────────────────────────────────────────────────────────────
function score(r, grade, tech, industry, level) {
  let s = 0;
  if (r.grades.includes(grade))                        s += 2;
  if (tech     && r.tech?.includes(tech))              s += 2;
  if (industry && r.industries?.includes(industry))    s += 2;
  if (r.levels.includes(level))                        s += 1;
  return s;
}

// ── Type metadata ─────────────────────────────────────────────────────────────
const TYPE_COLORS = {
  course:      "bg-blue-50 text-blue-700",
  competition: "bg-yellow-50 text-yellow-700",
  internship:  "bg-green-50 text-green-700",
  research:    "bg-purple-50 text-purple-700",
  opportunity: "bg-orange-50 text-orange-700",
  volunteer:   "bg-teal-50 text-teal-700",
  lecture:     "bg-indigo-50 text-indigo-700",
  conference:  "bg-rose-50 text-rose-700",
};

// ── UI strings ────────────────────────────────────────────────────────────────
const UI = {
  en: {
    title:"AI Opportunity Match", sub:"Tell us about yourself — get personalized AI learning recommendations",
    gradeLabel:"Your Grade / Level", techLabel:"Tech Area", industryLabel:"Industry Area", levelLabel:"Coding Experience",
    btn:"Find My Match →", resultsTitle:"Recommended for You", noResults:"Try a different combination — we're always adding more!",
    whyJoinLabel:"Why Join",
    visitBtn:"Visit →",
    grades:{ g9g10:"9th – 10th Grade", g11g12:"11th – 12th Grade", college:"College / University" },
    tech:{ general:"General AI / Not Sure", nlp:"NLP & Large Language Models", cv:"Computer Vision", robotics:"Robotics & Autonomous Systems", data:"Data Science & Analytics", ethics:"AI Ethics & Policy", applications:"AI Product Building", algorithms:"Algorithms & Theory" },
    industries:{ general:"No specific industry", healthcare:"AI + Healthcare & Medicine", biology:"AI + Biology & Life Sciences", education:"AI + Education (EdTech)", finance:"AI + Finance & FinTech", climate:"AI + Climate & Environment", art:"AI + Art & Creative Industries", business:"AI + Business & Strategy", law:"AI + Law & Policy" },
    levels:{ beginner:"Beginner (no coding yet)", intermediate:"Intermediate (some Python)", advanced:"Advanced (ML projects)" },
    types:{ course:"Course", competition:"Competition", internship:"Internship", research:"Research", opportunity:"Opportunity", volunteer:"Volunteer", lecture:"Lecture", conference:"Conference" },
  },
  zh: {
    title:"AI 机会匹配", sub:"告诉我们你的情况，获取个性化 AI 学习推荐",
    gradeLabel:"你的年级", techLabel:"技术方向", industryLabel:"行业方向", levelLabel:"编程水平",
    btn:"为我匹配 →", resultsTitle:"为你推荐", noResults:"换个组合试试，我们会持续添加更多资源！",
    whyJoinLabel:"为什么值得参与",
    visitBtn:"访问 →",
    grades:{ g9g10:"高一 / 高二（9–10年级）", g11g12:"高三 / 高四（11–12年级）", college:"大学生" },
    tech:{ general:"AI 通识 / 还没想好", nlp:"自然语言处理 & 大模型", cv:"计算机视觉", robotics:"机器人 & 自动驾驶", data:"数据科学", ethics:"AI 伦理与政策", applications:"AI 产品开发", algorithms:"算法与理论" },
    industries:{ general:"不限行业", healthcare:"AI + 医疗健康", biology:"AI + 生物与生命科学", education:"AI + 教育（EdTech）", finance:"AI + 金融科技", climate:"AI + 气候与环境", art:"AI + 艺术与创意", business:"AI + 商业与战略", law:"AI + 法律与政策" },
    levels:{ beginner:"零基础（无编程经验）", intermediate:"初级（有一些 Python 经验）", advanced:"进阶（有 ML 项目经验）" },
    types:{ course:"课程", competition:"竞赛", internship:"实习", research:"科研", opportunity:"机会", volunteer:"志愿", lecture:"讲座", conference:"会议" },
  },
  ja: {
    title:"AI 機会マッチング", sub:"あなたの情報を入力して最適なリソースを見つけましょう",
    gradeLabel:"学年", techLabel:"技術分野", industryLabel:"業界", levelLabel:"コーディング経験",
    btn:"マッチングする →", resultsTitle:"おすすめ", noResults:"別の組み合わせを試してください！",
    whyJoinLabel:"参加する理由",
    visitBtn:"訪問 →",
    grades:{ g9g10:"高校1–2年生", g11g12:"高校3–4年生", college:"大学生" },
    tech:{ general:"AI全般 / 未定", nlp:"NLP & LLM", cv:"コンピュータビジョン", robotics:"ロボティクス", data:"データサイエンス", ethics:"AI倫理", applications:"AIプロダクト", algorithms:"アルゴリズム" },
    industries:{ general:"業界不問", healthcare:"AI + 医療", biology:"AI + 生命科学", education:"AI + 教育", finance:"AI + 金融", climate:"AI + 環境", art:"AI + アート", business:"AI + ビジネス", law:"AI + 法律" },
    levels:{ beginner:"初心者", intermediate:"中級", advanced:"上級" },
    types:{ course:"コース", competition:"コンペ", internship:"インターン", research:"研究", opportunity:"機会", volunteer:"ボランティア", lecture:"講義", conference:"カンファレンス" },
  },
};

function getUI(locale) { return UI[locale] || UI.en; }

// ── Result card with expand/collapse ─────────────────────────────────────────
function ResultCard({ r, u }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-gray-100 bg-background overflow-hidden transition-all hover:border-brand-start/30 hover:shadow-sm">
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TYPE_COLORS[r.type] || TYPE_COLORS.course}`}>
              {u.types[r.type] || r.type}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug">{r.title}</p>
          <p className="text-[11px] text-muted mt-0.5">{r.institution}</p>
          <p className="text-xs text-muted mt-1.5 leading-relaxed">{r.desc}</p>
        </div>
        <span className="text-gray-400 text-xs mt-1 flex-shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {/* Expanded — why join + visit button */}
      {open && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-end mt-3 mb-1">
            {u.whyJoinLabel}
          </p>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">{r.whyJoin}</p>
          {r.url && (
            <a
              href={r.url}
              target={r.url.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-white brand-gradient rounded-lg px-3 py-1.5 transition-opacity hover:opacity-90"
            >
              {u.visitBtn}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function OpportunityMatch({ locale }) {
  const u = getUI(locale);
  const [grade,    setGrade]    = useState("");
  const [tech,     setTech]     = useState("");
  const [industry, setIndustry] = useState("");
  const [level,    setLevel]    = useState("");
  const [results,  setResults]  = useState(null);

  function handleMatch() {
    if (!grade || !level) return;
    const scored = RESOURCES
      .map((r) => ({ ...r, _score: score(r, grade, tech, industry, level) }))
      .filter((r) => r._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 6);
    setResults(scored);
  }

  const ready = grade && level;

  const Select = ({ label, value, onChange, options }) => (
    <div>
      <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">{label}</label>
      <select value={value} onChange={(e) => { onChange(e.target.value); setResults(null); }}
        className="w-full rounded-xl border border-gray-200 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-start/40">
        <option value="">—</option>
        {Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </div>
  );

  return (
    <div className="mt-10 card-surface rounded-2xl p-5">
      <div className="mb-5">
        <h2 className="text-base font-bold">{u.title}</h2>
        <p className="text-xs text-muted mt-0.5">{u.sub}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-3">
        <Select label={u.gradeLabel} value={grade} onChange={setGrade} options={u.grades} />
        <Select label={u.levelLabel} value={level} onChange={setLevel} options={u.levels} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 mb-4">
        <Select label={u.techLabel}     value={tech}     onChange={setTech}     options={u.tech} />
        <Select label={u.industryLabel} value={industry} onChange={setIndustry} options={u.industries} />
      </div>

      <button onClick={handleMatch} disabled={!ready}
        className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          ready ? "brand-gradient text-white hover:opacity-90 shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}>
        {u.btn}
      </button>

      {results !== null && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">{u.resultsTitle}</p>
          {results.length === 0 ? (
            <p className="text-sm text-muted">{u.noResults}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((r) => (
                <ResultCard key={r.id} r={r} u={u} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
