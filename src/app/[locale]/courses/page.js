import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageHeader from "@/components/PageHeader";
import Tag from "@/components/Tag";
import { getCoursesData } from "@/lib/courses";

export const revalidate = 600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CoursesPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("courses");

  const data = await getCoursesData();

  return (
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
                      {c.level && <Tag>{c.level}</Tag>}
                      {c.format && <Tag>{c.format}</Tag>}
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
                        <Tag>{p.format}</Tag>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t("competitions")}>
        <div className="grid gap-4 sm:grid-cols-3">
          {data.competitions.map((c, idx) => (
            <div key={idx} className="card-surface rounded-xl p-4">
              <h3 className="font-semibold">
                <CourseLink url={c.url} title={c.name} />
              </h3>
              <p className="mt-1 text-xs text-muted">{c.host}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.type && <Tag>{c.type}</Tag>}
              </div>
              {c.audience && (
                <p className="mt-2 text-xs text-muted">
                  {t("audience")}: {c.audience}
                </p>
              )}
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
