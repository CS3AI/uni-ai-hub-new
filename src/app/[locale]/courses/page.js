import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageHeader from "@/components/PageHeader";
import { getCoursesData } from "@/lib/courses";

export const revalidate = 600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Level -> color mapping for colored tags
function levelColor(level = "") {
  const l = level.toLowerCase();
  if (l.includes("begin")) return "bg-green-100 text-green-700";
  if (l.includes("inter")) return "bg-blue-100 text-blue-700";
  if (l.includes("advan")) return "bg-purple-100 text-purple-700";
  if (l.includes("all")) return "bg-gray-100 text-gray-600";
  if (l.includes("high school")) return "bg-orange-100 text-orange-700";
  return "bg-gray-100 text-gray-600";
}

function formatColor(format = "") {
  const f = format.toLowerCase();
  if (f.includes("in-person") || f.includes("workshop") || f.includes("conference")) return "bg-red-100 text-red-700";
  if (f.includes("free")) return "bg-green-100 text-green-700";
  if (f.includes("youtube") || f.includes("online") || f.includes("open course")) return "bg-blue-100 text-blue-700";
  if (f.includes("ted")) return "bg-red-100 text-red-700";
  if (f.includes("research")) return "bg-purple-100 text-purple-700";
  return "bg-gray-100 text-gray-600";
}

function ColorTag({ children, color }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {children}
    </span>
  );
}

export default async function CoursesPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("courses");

  const data = await getCoursesData();

  return (
    <div className="min-h-screen bg-red-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <PageHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("desc")}
          meta={`${t("lastUpdated")}: ${data.lastUpdated}`}
        />

        <Section title={t("universities")}>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.universities.map((uni) => (
              <div key={uni.name} className="card-surface rounded-xl p-4">
                <h3 className="font-semibold">{uni.name}</h3>
                <ul className="mt-2 space-y-2">
                  {uni.courses.map((c, idx) => (
                    <li key={idx} className="text-sm">
                      <CourseLink
                        url={c.url}
                        title={`${c.code ? c.code + " · " : ""}${c.title}`}
                      />
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {c.level && <ColorTag color={levelColor(c.level)}>{c.level}</ColorTag>}
                        {c.format && <ColorTag color={formatColor(c.format)}>{c.format}</ColorTag>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title={t("companies")}>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.companies.map((co) => (
              <div key={co.name} className="card-surface rounded-xl p-4">
                <h3 className="font-semibold">{co.name}</h3>
                <ul className="mt-2 space-y-2">
                  {co.programs.map((p, idx) => (
                    <li key={idx} className="text-sm">
                      <CourseLink url={p.url} title={p.title} />
                      {p.format && (
                        <div className="mt-1">
                          <ColorTag color={formatColor(p.format)}>{p.format}</ColorTag>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title={t("lectures")}>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.lectures.map((lec, idx) => (
              <div key={idx} className="card-surface rounded-xl p-4">
                <h3 className="font-semibold text-sm leading-snug">
                  <CourseLink url={lec.url} title={lec.name} />
                </h3>
                <p className="mt-1 text-xs text-muted">{lec.speaker}</p>
                <p className="text-xs text-muted">{lec.org}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {lec.level && <ColorTag color={levelColor(lec.level)}>{lec.level}</ColorTag>}
                  {lec.format && <ColorTag color={formatColor(lec.format)}>{lec.format}</ColorTag>}
                </div>
                {lec.topic && (
                  <p className="mt-2 text-xs text-muted">{lec.topic}</p>
                )}
              </div>
            ))}
          </div>
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

function CourseLink({ url, title }) {
  if (!url) return <span>{title}</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-brand-end hover:underline"
    >
      {title}
    </a>
  );
}
