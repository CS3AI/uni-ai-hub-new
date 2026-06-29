import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageHeader from "@/components/PageHeader";
import Tag from "@/components/Tag";
import InternshipList from "@/components/InternshipList";
import PeerDebriefs from "@/components/PeerDebriefs";
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
    { company: "Blizzard Entertainment", url: "https://careers.blizzard.com/", note: ir("blizzardNote") },
    { company: "Rivian", url: "https://www.rivian.com/careers", note: ir("rivianNote") },
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
          <div className="grid gap-4 sm:grid-cols-2">
            {REFERRALS.map((r, idx) => (
              <div key={idx} className="card-surface rounded-xl p-4">
                <h3 className="font-semibold">
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    className="hover:text-brand-end hover:underline">{r.company}</a>
                </h3>
                <p className="mt-1 text-sm text-muted">{r.note}</p>
              </div>
            ))}
          </div>
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
