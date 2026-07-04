import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageHeader from "@/components/PageHeader";
import Tag from "@/components/Tag";
import InternshipList from "@/components/InternshipList";
import PeerDebriefs from "@/components/PeerDebriefs";
import ReferralAccordion from "@/components/ReferralAccordion";
import { getInternshipListings } from "@/lib/internships";

export const revalidate = 21600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function InternshipPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("internship");
  const ir = await getTranslations("internshipResources");

  const listings = await getInternshipListings({ revalidate: 21600, limit: 80, aiOnly: true });

  const REFERRALS = [
    {
      company: "Blizzard Entertainment",
      logo: "/logos/blizzard.png",
      url: "https://careers.blizzard.com/",
      note: ir("blizzardNote"),
      workDesc: "Game AI systems, player behavior modeling, NPC pathfinding, matchmaking algorithms, and anti-cheat ML models. Blizzard interns often work on live game features shipped to millions of players.",
      timeline: "Rolling applications year-round. Summer internships close around December–February; apply early as spots fill quickly.",
      requirements: "CS, SE, or related major. Python/C++ proficiency. Game development coursework or personal projects are a strong differentiator. No gaming experience required but passion for games helps.",
    },
    {
      company: "Rivian",
      logo: "https://icon.horse/icon/rivian.com",
      url: "https://www.rivian.com/careers",
      note: ir("rivianNote"),
      workDesc: "Autonomous driving perception, sensor fusion (camera + LiDAR + radar), EV battery management systems, vehicle software, and fleet data analytics. Projects directly impact production vehicles.",
      timeline: "Summer internships open August–October for the following summer. Apply by November for best chances — high competition from top engineering schools.",
      requirements: "EE, ME, CS, or robotics major. Strong in Python, C++, or embedded systems. Coursework in control systems, computer vision, or robotics is valued. US work authorization required.",
    },
    {
      company: "Google",
      logo: "https://cdn.simpleicons.org/google/4285F4",
      url: "https://careers.google.com/students/",
      note: ir("googleNote"),
      workDesc: "Search ranking, Ads ML, Google Maps AI, YouTube recommendations, Google Cloud AI services, or Android intelligence features. STEP interns work on real product teams alongside full-time engineers.",
      timeline: "Applications open September–October for the following summer. The STEP program for freshmen/sophomores opens slightly later (October–December). Apply to both STEP and standard SWE Intern.",
      requirements: "STEP: Freshmen/sophomores from underrepresented groups. SWE Intern: Any year, strong CS fundamentals (data structures, algorithms, systems). Coding interviews use LeetCode-style problems.",
    },
    {
      company: "Microsoft",
      logo: "/logos/microsoft.png",
      url: "https://careers.microsoft.com/students/",
      note: ir("microsoftNote"),
      workDesc: "Azure ML infrastructure, Copilot features in Office 365, Teams AI, Bing Search AI, or Windows AI integrations. Microsoft Explore interns rotate across two different teams over 12 weeks.",
      timeline: "Explore (freshmen/sophomores) and SWE Intern applications open October–January. Apply by December for priority consideration — Microsoft hires very large intern classes (~2,000 per summer).",
      requirements: "Explore: Freshmen/sophomores, any CS background, no prior internship required. SWE Intern: Junior+, data structures/algorithms proficiency. All require behavioral interview preparation.",
    },
    {
      company: "Meta",
      logo: "https://cdn.simpleicons.org/meta/0082FB",
      url: "https://www.metacareers.com/students/",
      note: ir("metaNote"),
      workDesc: "ML infrastructure at trillion-parameter scale, Instagram recommendation systems, WhatsApp AI, Meta AI (Llama), VR/AR scene understanding, or the Reality Labs research division.",
      timeline: "Applications open September–November for summer. Meta University for high school juniors/seniors opens January–March. AI Research Scientist Intern applications are rolling.",
      requirements: "SWE Intern: CS junior+, strong algorithms (LeetCode Medium/Hard). ML roles: ML coursework, PyTorch experience preferred. Meta University: High school juniors/seniors with coding experience.",
    },
    {
      company: "Tesla",
      logo: "https://cdn.simpleicons.org/tesla/CC0000",
      url: "https://www.tesla.com/careers/search/?type=4",
      note: ir("teslaNote"),
      workDesc: "Autopilot neural network training (computer vision, occupancy networks), Dojo supercomputer software, Optimus humanoid robot AI, energy grid optimization, or manufacturing automation AI.",
      timeline: "Year-round rolling applications — Tesla hires interns every quarter. Summer positions fill fast (apply by February). Returning offers are common; many interns convert to full-time.",
      requirements: "Any engineering major (EE, ME, CS, MathE). Autopilot/AI roles need Python and ML familiarity. Tesla values hands-on project work over academic credentials — strong GitHub portfolio matters.",
    },
    {
      company: "Waymo",
      logo: "https://icon.horse/icon/waymo.com",
      url: "https://waymo.com/careers/",
      note: ir("waymoNote"),
      workDesc: "Autonomous driving perception (object detection, tracking), motion prediction, mapping, simulation infrastructure, sensor calibration, or ML safety systems. Real-world deployment impact from day one.",
      timeline: "Summer applications open October–December. Waymo is selective — typically hires CS/ML seniors and graduate students. Rolling for off-cycle. Check for part-time student researcher roles too.",
      requirements: "Strong CS/ML background required (graduate-level preferred). Proficiency in Python, TensorFlow or PyTorch, and ideally experience with 3D data, point clouds, or robotics. US work authorization required.",
    },
    {
      company: "OpenAI",
      logo: "/logos/openai.png",
      url: "https://openai.com/careers/",
      note: ir("openaiNote"),
      workDesc: "LLM training and fine-tuning, RLHF pipeline development, safety and alignment research, ChatGPT product features, API infrastructure, or interpretability research with top safety researchers.",
      timeline: "Rolling applications throughout the year. Research Scientist Intern applications are highly competitive and primarily for PhD students. SWE Intern roles open more broadly — apply early.",
      requirements: "SWE Intern: Strong Python, distributed systems, ML infrastructure knowledge. Research Intern: Active ML research background (publications or research experience strongly preferred). All require demonstrated AI interest.",
    },
  ];

  const RESUME_RESOURCES = [
    { label: ir("resumeLabel"), detail: ir("resumeDetail") },
    { label: ir("professorLabel"), detail: ir("professorDetail") },
    { label: ir("industryLabel"), detail: ir("industryDetail") },
  ];

  const INTERVIEW_TIPS = [
    {
      label: "GitHub Portfolio Management",
      detail: "Your pinned repos get ~30 seconds of attention from recruiters. Pin your best 3–4 projects with a clear README: architecture diagram, demo GIF or screenshot, and a one-click run script. Star/fork counts and commit history signal active development.",
    },
    {
      label: "Technical Interview & Coding Communication",
      detail: "Interviews at companies like Meta or Tesla focus on Think Out Loud — narrate your reasoning as you write code. Practice on LeetCode while speaking aloud. Explain time/space complexity unprompted. CS231N (Lecture 1–3) covers CV fundamentals often asked in vision roles.",
    },
    {
      label: "Behavioral Interview (STAR Method)",
      detail: "Prepare one strong story about the biggest technical bug you fixed — be specific: what broke, how long it took, what docs or tools helped, and what you learned. STAR: Situation → Task → Action → Result. 2-minute delivery, rehearse out loud.",
    },
  ];

  const TIMELINE = [
    { period: ir("period0"), items: [ir("period0item0"), ir("period0item1")] },
    { period: ir("period1"), items: [ir("period1item0"), ir("period1item1")] },
    { period: ir("period2"), items: [ir("period2item0"), ir("period2item1")] },
    { period: ir("period3"), items: [ir("period3item0"), ir("period3item1")] },
  ];

  return (
    <div className="min-h-screen bg-green-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <PageHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("desc")}
          meta={t("listingsMeta", { count: listings.length })}
        />

        <Section title={t("liveListings")}>
          <InternshipList items={listings} theme="green" />
        </Section>

        <Section title={t("referralOpportunities")}>
          <ReferralAccordion referrals={REFERRALS} />
        </Section>

        <Section title={ir("resumeTitle")}>
          <p className="mb-3 text-sm text-muted">{ir("resumeDesc")}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {RESUME_RESOURCES.map((r, idx) => (
              <div key={idx} className="card-surface rounded-xl p-4">
                <h3 className="text-sm font-semibold">{r.label}</h3>
                <p className="mt-1 text-sm text-muted">{r.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title={ir("timelineTitle")}>
          <p className="mb-3 text-sm text-muted">{ir("timelineDesc")}</p>
          <div className="grid gap-4 sm:grid-cols-4">
            {TIMELINE.map((m, idx) => (
              <div key={idx} className="card-surface rounded-xl p-4">
                <Tag tone="green">{m.period}</Tag>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {m.items.map((it, i2) => (<li key={i2}>· {it}</li>))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Section C: Tech Interview & Portfolio Tips */}
        <Section title={ir("interviewTipsTitle")}>
          <div className="grid gap-4 sm:grid-cols-3">
            {INTERVIEW_TIPS.map((tip, idx) => (
              <div key={idx} className="card-surface rounded-xl p-4">
                <h3 className="text-sm font-semibold">{tip.label}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{tip.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Peer Interview Debriefs */}
        <Section title={ir("peerDebriefsTitle")}>
          <PeerDebriefs
            title={ir("peerDebriefsTitle")}
            desc={ir("peerDebriefsDesc")}
            submitBtn={ir("submitBtn")}
            nickPlaceholder={ir("nickPlaceholder")}
            msgPlaceholder={ir("msgPlaceholder")}
            submitDone={ir("submitDone")}
            submitNote={ir("submitNote")}
          />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
