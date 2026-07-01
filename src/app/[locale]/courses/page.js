import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageHeader from "@/components/PageHeader";
import CourseTabs from "@/components/CourseTabs";
import { getCoursesData } from "@/lib/courses";

export const revalidate = 600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
  if (f.includes("volunteer") || f.includes("club")) return "bg-teal-100 text-teal-700";
  if (f.includes("residential") || f.includes("funded")) return "bg-orange-100 text-orange-700";
  if (f.includes("remote") || f.includes("mentorship")) return "bg-indigo-100 text-indigo-700";
  if (f.includes("competition") || f.includes("science")) return "bg-yellow-100 text-yellow-700";
  if (f.includes("free") || f.includes("open course")) return "bg-green-100 text-green-700";
  if (f.includes("youtube") || f.includes("online")) return "bg-blue-100 text-blue-700";
  if (f.includes("ted")) return "bg-red-100 text-red-700";
  if (f.includes("research") || f.includes("public lecture")) return "bg-purple-100 text-purple-700";
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

  const TABS = [
    { id: "universities",     label: t("universities") },
    { id: "companies",        label: t("companies") },
    { id: "lectures",         label: t("onlineLectures") },
    { id: "conferences",      label: t("conferencesEvents") },
    { id: "volunteering",     label: t("volunteering") },
    { id: "summer-schools",   label: t("summerSchools") },
    { id: "research-programs", label: t("researchPrograms") },
  ];

  return (
    <div className="min-h-screen bg-red-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <PageHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("desc")}
          meta={`${t("lastUpdated")}: ${data.lastUpdated}`}
        />

        <CourseTabs tabs={TABS} />

        <Section id="universities" title={t("universities")}>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.universities.map((uni) => (
              <div key={uni.name} className="card-surface rounded-xl p-4">
                <h3 className="font-semibold">{uni.name}</h3>
                <ul className="mt-2 space-y-2">
                  {uni.courses.map((c, idx) => (
                    <li key={idx} className="text-sm">
                      <CourseLink url={c.url} title={`${c.code ? c.code + " · " : ""}${c.title}`} />
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

        <Section id="companies" title={t("companies")}>
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

        <Section id="lectures" title={t("onlineLectures")}>
          <div className="grid gap-4 sm:grid-cols-2">
            {(data.lectures || []).map((lec, idx) => (
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
                {lec.topic && <p className="mt-2 text-xs text-muted">{lec.topic}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Section id="conferences" title={t("conferencesEvents")}>
          <div className="grid gap-4 sm:grid-cols-2">
            {(data.conferences || []).map((lec, idx) => (
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
                {lec.topic && <p className="mt-2 text-xs text-muted">{lec.topic}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Section id="volunteering" title={t("volunteering")}>
          <div className="grid gap-4 sm:grid-cols-2">
            {(data.volunteering || []).map((v, idx) => (
              <div key={idx} className="card-surface rounded-xl p-4">
                <h3 className="font-semibold text-sm leading-snug">
                  <CourseLink url={v.url} title={v.name} />
                </h3>
                <p className="mt-1 text-xs text-muted">{v.speaker}</p>
                <p className="text-xs text-muted">{v.org}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {v.level && <ColorTag color={levelColor(v.level)}>{v.level}</ColorTag>}
                  {v.format && <ColorTag color={formatColor(v.format)}>{v.format}</ColorTag>}
                </div>
                {v.topic && <p className="mt-2 text-xs text-muted">{v.topic}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Section id="summer-schools" title={t("summerSchools")}>
          <div className="grid gap-4 sm:grid-cols-2">
            {(data.summerSchools || []).map((s, idx) => (
              <div key={idx} className="card-surface rounded-xl p-4">
                <h3 className="font-semibold text-sm leading-snug">
                  <CourseLink url={s.url} title={s.name} />
                </h3>
                <p className="mt-1 text-xs text-muted">{s.org}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.audience && <ColorTag color="bg-orange-100 text-orange-700">{s.audience}</ColorTag>}
                  {s.format && <ColorTag color={formatColor(s.format)}>{s.format}</ColorTag>}
                </div>
                {s.desc && <p className="mt-2 text-xs text-muted leading-relaxed">{s.desc}</p>}
              </div>
            ))}
          </div>
        </Section>

        <Section id="research-programs" title={t("researchPrograms")}>
          <div className="grid gap-4 sm:grid-cols-2">
            {(data.researchPrograms || []).map((r, idx) => (
              <div key={idx} className="card-surface rounded-xl p-4">
                <h3 className="font-semibold text-sm leading-snug">
                  <CourseLink url={r.url} title={r.name} />
                </h3>
                <p className="mt-1 text-xs text-muted">{r.org}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.audience && <ColorTag color="bg-purple-100 text-purple-700">{r.audience}</ColorTag>}
                  {r.format && <ColorTag color={formatColor(r.format)}>{r.format}</ColorTag>}
                </div>
                {r.desc && <p className="mt-2 text-xs text-muted leading-relaxed">{r.desc}</p>}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="mb-10 scroll-mt-28">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function CourseLink({ url, title }) {
  if (!url) return <span>{title}</span>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-end hover:underline">
      {title}
    </a>
  );
}
