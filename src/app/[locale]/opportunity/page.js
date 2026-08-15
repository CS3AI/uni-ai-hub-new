"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import activities from "@/data/activities.json";
import LogoImg from "@/components/LogoImg";

/* ─── Translation ──────────────────────────────────────── */
const LANG_MAP = { zh:"zh-CN", fr:"fr", es:"es", de:"de", ja:"ja", ru:"ru", ko:"ko" };

async function translateText(text, tl) {
  if (!text || !tl) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    const r = await fetch(url);
    const d = await r.json();
    return d[0]?.map((c) => c[0]).join("") || text;
  } catch {
    return text;
  }
}

function useTranslateField(texts, locale) {
  const [translated, setTranslated] = useState({});
  const tl = LANG_MAP[locale];
  useEffect(() => {
    if (!tl) { setTranslated({}); return; }
    const unique = [...new Set(texts.filter(Boolean))];
    Promise.all(unique.map((t) => translateText(t, tl).then((r) => [t, r])))
      .then((pairs) => setTranslated(Object.fromEntries(pairs)));
  }, [tl, texts.join("|")]);
  return (orig) => (tl ? translated[orig] || orig : orig);
}

/* ─── Tiny helpers ─────────────────────────────────────── */
function Badge({ text, color = "blue" }) {
  const cls = {
    blue:   "bg-blue-50 text-blue-700 border-blue-200",
    green:  "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    amber:  "bg-amber-50 text-amber-700 border-amber-200",
    red:    "bg-red-50 text-red-700 border-red-200",
    pink:   "bg-pink-50 text-pink-700 border-pink-200",
  }[color] ?? "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${cls}`}>
      {text}
    </span>
  );
}

function TipList({ tips, tr }) {
  return (
    <ul className="mt-2 space-y-1">
      {tips.map((tip, i) => (
        <li key={i} className="flex gap-2 text-xs text-muted">
          <span className="mt-0.5 text-brand-end font-bold shrink-0">→</span>
          <span>{tr(tip)}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─── Tab 1: Global Opportunities ─────────────────────── */
function GlobalOpportunitiesTab({ tr }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      {activities.globalOpportunities.map((opp) => (
        <div key={opp.id} className="card-surface rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpen(open === opp.id ? null : opp.id)}
            className="w-full flex items-stretch text-left hover:bg-gray-50 transition-colors"
          >
            <LogoImg
              src={opp.logo}
              alt={opp.organizer}
              wrapperClass="w-20 flex-shrink-0 flex items-center justify-center bg-white/70 border-r border-gray-100 p-3"
              className="w-12 h-12"
            />
            <div className="flex-1 flex items-start justify-between gap-2 p-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm leading-tight">{opp.name}</h3>
                <p className="text-xs text-muted mt-0.5">{opp.organizer}</p>
                {(opp.deadline || opp.eligibility) && (
                  <div className="grid grid-cols-2 gap-x-3 mt-2 text-[11px] text-muted">
                    {opp.deadline && (
                      <div><span className="font-semibold text-foreground">Timeline: </span>{opp.deadline}</div>
                    )}
                    {opp.eligibility && (
                      <div><span className="font-semibold text-foreground">Eligibility: </span>{opp.eligibility}</div>
                    )}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {opp.difficulty && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">{opp.difficulty}</span>
                  )}
                  {opp.opportunityType && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">{opp.opportunityType}</span>
                  )}
                  {opp.requirement && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{opp.requirement}</span>
                  )}
                </div>
              </div>
              <span className="text-muted text-xs mt-1 shrink-0">{open === opp.id ? "▲" : "▼"}</span>
            </div>
          </button>

          {open === opp.id && (
            <div className="px-4 pb-4 border-t border-border/40 pt-3 space-y-3">
              <p className="text-sm text-muted leading-relaxed">{tr(opp.shortDesc)}</p>

              <div>
                <p className="text-xs font-medium text-foreground mb-1.5">SDG Alignment</p>
                <div className="flex flex-wrap gap-1">
                  {opp.sdgs.map((s) => <Badge key={s} text={s} color="green" />)}
                </div>
              </div>

              {opp.techStack && (
                <div>
                  <p className="text-xs font-medium text-foreground mb-1.5">Tech Stack</p>
                  <div className="flex flex-wrap gap-1">
                    {opp.techStack.map((s) => <Badge key={s} text={s} color="blue" />)}
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                <p className="text-xs font-medium text-amber-800 mb-1">Why this matters for high schoolers</p>
                <p className="text-xs text-amber-700 leading-relaxed">{tr(opp.whyHighSchool)}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-foreground mb-1">Tips</p>
                <TipList tips={opp.tips} tr={tr} />
              </div>

              <a
                href={opp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 rounded-lg bg-amber-500 text-white text-xs font-semibold px-4 py-2 hover:bg-amber-600 transition"
              >
                Visit Official Page →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Tab 2: Open Source & Projects ───────────────────── */
function OpenSourceTab({ tr }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      {activities.openSource.map((proj) => (
        <div key={proj.id} className="card-surface rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpen(open === proj.id ? null : proj.id)}
            className="w-full flex items-start justify-between gap-3 p-4 text-left"
          >
            <div>
              <h3 className="font-semibold text-sm leading-tight">{proj.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-xs text-muted">{proj.organizer}</p>
                <Badge text={proj.difficulty} color="purple" />
              </div>
            </div>
            <span className="text-muted text-xs mt-1 shrink-0">{open === proj.id ? "▲" : "▼"}</span>
          </button>

          {open === proj.id && (
            <div className="px-4 pb-4 border-t border-border/40 pt-3 space-y-3">
              <Badge text={proj.sdg} color="green" />
              <p className="text-sm text-muted leading-relaxed">{tr(proj.desc)}</p>

              <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                <p className="text-xs font-medium text-amber-800 mb-1">Why join?</p>
                <p className="text-xs text-amber-700 leading-relaxed">{tr(proj.whyJoin)}</p>
              </div>

              <a
                href={proj.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 rounded-lg bg-amber-500 text-white text-xs font-semibold px-4 py-2 hover:bg-amber-600 transition"
              >
                Get Involved →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Tab 3: Local Action (California) ────────────────── */
function LocalActionTab({ tr }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted rounded-xl bg-surface border border-border/50 p-4 leading-relaxed">
        {tr(activities.localAction.intro)}
      </p>

      {activities.localAction.programs.map((prog) => (
        <div key={prog.id} className="card-surface rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpen(open === prog.id ? null : prog.id)}
            className="w-full flex items-start justify-between gap-3 p-4 text-left"
          >
            <div>
              <h3 className="font-semibold text-sm leading-tight">{prog.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-xs text-muted">{prog.org}</p>
                <Badge text={prog.type} color="blue" />
              </div>
            </div>
            <span className="text-muted text-xs mt-1 shrink-0">{open === prog.id ? "▲" : "▼"}</span>
          </button>

          {open === prog.id && (
            <div className="px-4 pb-4 border-t border-border/40 pt-3 space-y-3">
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                <span>{prog.location}</span>
                <span>{prog.timeline}</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{tr(prog.desc)}</p>

              <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                <p className="text-xs font-medium text-blue-800 mb-1">How to get involved</p>
                <p className="text-xs text-blue-700 leading-relaxed">{tr(prog.howToJoin)}</p>
              </div>

              <a
                href={prog.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 rounded-lg bg-amber-500 text-white text-xs font-semibold px-4 py-2 hover:bg-amber-600 transition"
              >
                Learn More →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Tab 4: Talks & Events ────────────────────────────── */
function TalksTab({ tr }) {
  const [open, setOpen] = useState(null);
  const typeColors = { "Conference": "blue", "Academic Conference": "purple", "Industry Conference": "blue", "Developer Conference": "green", "Education + Tech Conference": "green", "Public Lecture Series": "amber", "Industry Expo": "red", "Executive Summit": "pink", "Business Conference": "blue" };

  return (
    <div className="space-y-3">
      {activities.talksAndEvents.map((ev) => (
        <div key={ev.id} className="card-surface rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpen(open === ev.id ? null : ev.id)}
            className="w-full flex items-stretch text-left hover:bg-gray-50 transition-colors"
          >
            <LogoImg
              src={ev.logo}
              alt={ev.name}
              wrapperClass="w-20 flex-shrink-0 flex items-center justify-center bg-white/70 border-r border-gray-100 p-3"
              className="w-12 h-12"
            />
            <div className="flex-1 flex items-start justify-between gap-2 p-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm leading-tight">{ev.name}</h3>
                <p className="text-xs text-muted mt-0.5">{ev.org}</p>
                {(ev.location || ev.period) && (
                  <div className="flex gap-3 mt-1.5 text-[11px] text-muted">
                    {ev.location && <span><span className="font-semibold text-foreground">Location: </span>{ev.location}</span>}
                    {ev.period && <span><span className="font-semibold text-foreground">When: </span>{ev.period}</span>}
                  </div>
                )}
                <div className="mt-1.5">
                  <Badge text={ev.type} color={typeColors[ev.type] || "blue"} />
                </div>
              </div>
              <span className="text-muted text-xs mt-1 shrink-0">{open === ev.id ? "▲" : "▼"}</span>
            </div>
          </button>

          {open === ev.id && (
            <div className="px-4 pb-4 border-t border-border/40 pt-3 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <Badge text={ev.format} color="blue" />
                {ev.cost && <Badge text={ev.cost} color="green" />}
              </div>

              <p className="text-sm text-muted leading-relaxed">{tr(ev.desc)}</p>

              <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                <p className="text-xs font-medium text-amber-800 mb-1">Why attend?</p>
                <p className="text-xs text-amber-700 leading-relaxed">{tr(ev.whyAttend)}</p>
              </div>

              <a
                href={ev.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 rounded-lg bg-amber-500 text-white text-xs font-semibold px-4 py-2 hover:bg-amber-600 transition"
              >
                Visit Official Page →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Tab 5: Startup Funding ────────────────────────────── */
const FUNDING_SECTIONS = [
  {
    title: "Student Accelerators & Funds",
    emoji: "🚀",
    color: "blue",
    items: [
      { id: "yc", name: "Y Combinator", org: "YC", funding: "$500K", equity: "7%", eligibility: "Any age / stage", url: "https://www.ycombinator.com/apply", desc: "The world's most prestigious startup accelerator. Actively recruits student founders — no product or traction required. Remote-friendly 12-week batch with weekly dinners, mentorship, and Demo Day in front of top investors.", type: "Accelerator" },
      { id: "drf", name: "Dorm Room Fund", org: "First Round Capital", funding: "$20K", equity: "0%", eligibility: "College students", url: "https://dormroomfund.com/", desc: "Student-run fund backed by First Round Capital. Partners are students at top universities who invest in and mentor fellow students. Zero equity taken — it's a pure grant.", type: "Grant" },
      { id: "rdv", name: "Rough Draft Ventures", org: "General Catalyst", funding: "$25K–$75K", equity: "small", eligibility: "College students", url: "https://www.roughdraft.vc/", desc: "Student-run venture fund from General Catalyst. Backs the earliest-stage ideas from college founders. Has invested in 200+ college startups since 2012.", type: "Fund" },
      { id: "contrary", name: "Contrary Capital", org: "Contrary", funding: "varies", equity: "small", eligibility: "College / HS", url: "https://contrary.com/", desc: "Talent-first fund with campus scouts at 45+ universities. Become a Contrary Fellow to access deal flow, introductions to top founders, and potential investment.", type: "Fund" },
      { id: "1517", name: "1517 Fund", org: "1517", funding: "$20K–$500K", equity: "small", eligibility: "Young founders (all ages)", url: "https://www.1517fund.com/", desc: "Named after Martin Luther's Theses — invests in young founders who build instead of waiting. Fellowship includes a $1K microgrant with no equity for early-stage exploration.", type: "Fund" },
      { id: "pear", name: "Pear VC", org: "Pear VC", funding: "up to $1M", equity: "varies", eligibility: "Bay Area / Stanford", url: "https://pear.vc/", desc: "Pre-seed VC known for backing college startups at idea stage. Runs the $100K Pear Competition for Stanford affiliates, and invests from $250K–$1M pre-seed.", type: "Accelerator" },
    ]
  },
  {
    title: "Pitch Competitions",
    emoji: "🏆",
    color: "amber",
    items: [
      { id: "diamond", name: "Diamond Challenge", org: "University of Delaware", funding: "$10K+ prizes", equity: "0%", eligibility: "High school students", url: "https://diamondchallenge.org/", desc: "International HS entrepreneurship competition with Business and Social Innovation tracks. Teams from 40+ countries compete for cash prizes and mentorship from industry leaders.", type: "Competition" },
      { id: "conrad", name: "Conrad Challenge", org: "Conrad Foundation", funding: "Cash prizes + mentorship", equity: "0%", eligibility: "HS students (13–18)", url: "https://www.conradchallenge.org/", desc: "Multi-phase STEM innovation challenge for high schoolers across 5 categories: Aerospace, Cyber-Technology, Energy & Environment, Health & Nutrition, and Safety. Category winners receive prizes and industry mentorship.", type: "Competition" },
      { id: "mass", name: "MassChallenge", org: "MassChallenge", funding: "$100K+", equity: "0%", eligibility: "Any stage, any age", url: "https://masschallenge.org/", desc: "Zero-equity global accelerator with over $100K in cash awards. One of the largest startup support programs in the world — programs in US, UK, Mexico, Israel, and Switzerland.", type: "Accelerator" },
      { id: "techcrunch", name: "Startup Battlefield", org: "TechCrunch", funding: "$100K", equity: "0%", eligibility: "Early-stage startups", url: "https://techcrunch.com/events/tc-disrupt/", desc: "The most prestigious startup competition at TechCrunch Disrupt. $100K equity-free prize and massive media exposure. Past winners include Dropbox, Mint, and Yammer.", type: "Competition" },
      { id: "rice", name: "Rice Business Plan Competition", org: "Rice University", funding: "$1.5M+", equity: "0%", eligibility: "Grad students worldwide", url: "https://rbpc.rice.edu/", desc: "World's richest grad student startup competition with over $1.5M in prizes and investments. 42 investor teams, 8 industry tracks. Strong STEM / deep-tech focus.", type: "Competition" },
      { id: "mit-100k", name: "MIT $100K Entrepreneurship Competition", org: "MIT", funding: "$100K+", equity: "0%", eligibility: "MIT community", url: "https://www.mit100k.org/", desc: "Oldest university business plan competition, with 100+ successful alumni companies including Akamai and HubSpot. Open to MIT students, faculty, and affiliates.", type: "Competition" },
    ]
  },
  {
    title: "Government Grants",
    emoji: "🏛️",
    color: "green",
    items: [
      { id: "icorps", name: "NSF I-Corps", org: "National Science Foundation", funding: "$50K", equity: "0%", eligibility: "US universities", url: "https://new.nsf.gov/funding/initiatives/i-corps", desc: "NSF program to translate university research into startups. Provides $50K + 7-week intensive customer discovery training for student/faculty teams. Perfect if you have a research-based idea.", type: "Grant" },
      { id: "sbir", name: "SBIR / STTR Phase I", org: "US Federal Government", funding: "up to $275K", equity: "0%", eligibility: "US small businesses", url: "https://www.sbir.gov/", desc: "America's largest source of early-stage R&D funding. Phase I grants up to $275K across 11 agencies (NSF, DOE, NIH, DoD, etc.). STTR variant requires university partnership — great for student founders.", type: "Grant" },
      { id: "doe", name: "DOE Lab Partnering Service", org: "US Dept of Energy", funding: "varies", equity: "0%", eligibility: "US startups", url: "https://lps.doe.gov/", desc: "Connects startups with DOE national labs for R&D partnerships, licensing, and funding. ARPA-E and America's Seed Fund offer grants for clean energy / deep-tech student ventures.", type: "Grant" },
    ]
  },
  {
    title: "University Incubators",
    emoji: "🏫",
    color: "purple",
    items: [
      { id: "skydeck", name: "Berkeley SkyDeck", org: "UC Berkeley", funding: "$100K (Pad & Launch)", equity: "3% (Pad & Launch)", eligibility: "UC Berkeley affiliates", url: "https://skydeck.berkeley.edu/", desc: "UC Berkeley's flagship accelerator. Free HotDesk tier for Berkeley students with no equity. Paid Pad & Launch tier includes office space, $100K funding, and access to SkyDeck's investor network.", type: "Incubator" },
      { id: "startx", name: "Stanford StartX", org: "Stanford University", funding: "Non-dilutive perks ($1M+)", equity: "0%", eligibility: "Stanford affiliates", url: "https://startx.com/", desc: "Stanford's non-profit accelerator for students and alumni. Access to $1M+ in startup perks, mentorship, and events — with zero equity taken. One of the few truly non-dilutive university accelerators.", type: "Incubator" },
      { id: "deltav", name: "MIT delta v", org: "MIT", funding: "$20K stipend", equity: "0%", eligibility: "MIT students", url: "https://entrepreneurship.mit.edu/delta-v/", desc: "MIT's flagship 14-week summer accelerator. Each founder receives a $20K living stipend, access to MIT's global alumni network, and mentorship from entrepreneurs-in-residence.", type: "Incubator" },
      { id: "ilab", name: "Harvard Innovation Labs", org: "Harvard University", funding: "Space + mentorship", equity: "0%", eligibility: "Harvard community", url: "https://innovationlabs.harvard.edu/", desc: "Harvard's startup hub offering co-working space, expert mentorship, and programming across HBS, FAS, SEAS, and other schools. Venture Incubation Program and Launch Lab X are the flagship tracks.", type: "Incubator" },
      { id: "treehouse", name: "Launch Lab X", org: "Harvard / MIT", funding: "Stipend + services", equity: "0%", eligibility: "Harvard / MIT community", url: "https://innovationlabs.harvard.edu/llx/", desc: "Post-graduation startup program for recent Harvard and MIT grads. Provides a year of co-working space, coaching, and community to build your company full-time after graduation.", type: "Incubator" },
    ]
  },
];

const TYPE_COLOR = {
  "Accelerator": "blue", "Grant": "green", "Fund": "purple",
  "Competition": "amber", "Program": "teal", "Incubator": "pink"
};

const SECTION_COLORS = {
  blue:   { header: "bg-blue-50 border-blue-200 text-blue-800",   badge: "bg-blue-100 text-blue-700" },
  amber:  { header: "bg-amber-50 border-amber-200 text-amber-800", badge: "bg-amber-100 text-amber-700" },
  green:  { header: "bg-green-50 border-green-200 text-green-800", badge: "bg-green-100 text-green-700" },
  purple: { header: "bg-purple-50 border-purple-200 text-purple-800", badge: "bg-purple-100 text-purple-700" },
};

const FOUNDER_TIPS = [
  { icon: "💡", tip: "Start with competitions before raising — they give you non-dilutive cash, credibility, and warm investor intros." },
  { icon: "🎓", tip: "Use your student status strategically. Many programs (Dorm Room Fund, StartX, delta v) only accept current students." },
  { icon: "📋", tip: "NSF I-Corps is often overlooked. If your idea has any research angle, $50K with zero equity is hard to beat." },
  { icon: "🤝", tip: "Accelerators want traction OR a strong team + insight. If you have no revenue, lead with your why and unique advantage." },
];

function StartupFundingTab() {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-6">
      {FUNDING_SECTIONS.map((section) => {
        const sc = SECTION_COLORS[section.color];
        return (
          <div key={section.title}>
            <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 mb-3 ${sc.header}`}>
              <h2 className="font-semibold text-sm">{section.title}</h2>
            </div>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item.id} className="card-surface rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpen(open === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${sc.badge}`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-muted">{item.org}</p>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-[11px] text-muted">
                        <span><span className="font-semibold text-foreground">Funding: </span>{item.funding}</span>
                        <span><span className="font-semibold text-foreground">Equity: </span>{item.equity}</span>
                        <span><span className="font-semibold text-foreground">For: </span>{item.eligibility}</span>
                      </div>
                    </div>
                    <span className="text-muted text-xs shrink-0">{open === item.id ? "▲" : "▼"}</span>
                  </button>
                  {open === item.id && (
                    <div className="px-4 pb-4 border-t border-border/40 pt-3 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-lg bg-amber-500 text-white text-xs font-semibold px-4 py-2 hover:bg-amber-600 transition"
                      >
                        Learn More →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Founder Tips */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="font-semibold text-sm text-amber-900 mb-3">💬 Founder Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FOUNDER_TIPS.map((ft, i) => (
            <div key={i} className="text-xs text-amber-800 leading-relaxed">
<span>{ft.tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────── */
export default function OpportunityPage() {
  const t = useTranslations("opportunity");
  const locale = useLocale();
  const [tab, setTab] = useState(0);

  const allTexts = [
    ...activities.globalOpportunities.flatMap(o => [o.shortDesc, o.deadline, o.eligibility, o.whyHighSchool, ...o.tips]),
    ...activities.openSource.flatMap(o => [o.desc, o.whyJoin]),
    activities.localAction.intro,
    ...activities.localAction.programs.flatMap(p => [p.desc, p.howToJoin]),
    ...activities.talksAndEvents.flatMap(e => [e.desc, e.whyAttend]),
  ];
  const tr = useTranslateField(allTexts, locale);

  const TABS = [
    { label: t("tab1"), content: <GlobalOpportunitiesTab tr={tr} /> },
    { label: t("tab2"), content: <OpenSourceTab tr={tr} /> },
    { label: t("tab3"), content: <LocalActionTab tr={tr} /> },
    { label: t("tab4"), content: <TalksTab tr={tr} /> },
    { label: t("tab5"), content: <StartupFundingTab /> },
  ];

  return (
    <div className="min-h-screen bg-yellow-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            {t("eyebrow")}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            {t("desc")}
          </p>
        </div>

        <div className="mb-6 flex gap-2 flex-wrap">
          {TABS.map((tb, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                tab === i
                  ? "bg-amber-500 text-white shadow-sm"
                  : "card-surface border border-border text-muted hover:text-foreground"
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {TABS[tab].content}
      </div>
    </div>
  );
}
