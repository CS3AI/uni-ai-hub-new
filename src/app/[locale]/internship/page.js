import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageHeader from "@/components/PageHeader";
import Tag from "@/components/Tag";
import InternshipList from "@/components/InternshipList";
import { getInternshipListings } from "@/lib/internships";

export const revalidate = 21600; // 6-hour ISR

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
      url: "https://careers.blizzard.com/",
      note: ir("blizzardNote"),
    },
    {
      company: "Rivian",
      url: "https://www.rivian.com/careers",
      note: ir("rivianNote"),
    },
  ];

  const RESUME_RESOURCES = [
    { label: ir("resumeLabel"), detail: ir("resumeDetail") },
    { label: ir("professorLabel"), detail: ir("professorDetail") },
    { label: ir("industryLabel"), detail: ir("industryDetail") },
  ];

  const TIMELINE = [
    { period: ir("period0"), items: [ir("period0item0"), ir("period0item1")] },
    { period: ir("period1"), items: [ir("period1item0"), ir("period1item1")] },
    { period: ir("period2"), items: [ir("period2item0"), ir("period2item1")] },
    { period: ir("period3"), items: [ir("period3item0"), ir("period3item1")] },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("desc")}
        meta={t("listingsMeta", { count: listings.length })}
      />

      <Section title={t("liveListings")}>
        <InternshipList items={listings} />
      </Section>

      <Section title={t("referralOpportunities")}>
        <div className="grid gap-4 sm:grid-cols-2">
          {REFERRALS.map((r, idx) => (
            <div key={idx} className="card-surface rounded-xl p-4">
              <h3 className="font-semibold">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-end hover:underline"
                >
                  {r.company}
                </a>
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
              <Tag tone="brand">{m.period}</Tag>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {m.items.map((it, i2) => (
                  <li key={i2}>· {it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
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
