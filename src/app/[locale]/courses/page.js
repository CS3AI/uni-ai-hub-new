import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageHeader from "@/components/PageHeader";
import CourseTabs from "@/components/CourseTabs";
import LogoImg from "@/components/LogoImg";
import { getCoursesData } from "@/lib/courses";
import { UniCourseList, CompanyProgramList, LectureList, ConferenceList, SummerSchoolList, ResearchProgramList } from "@/components/CourseAccordion";

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
              <div key={uni.name} className="card-surface rounded-xl overflow-hidden flex">
                <LogoImg
                  src={uni.logo}
                  alt={uni.name}
                  wrapperClass="w-16 flex-shrink-0 flex items-center justify-center bg-white/70 border-r border-gray-100 p-3"
                  className="w-11 h-11"
                />
                <div className="flex-1 p-4">
                  <h3 className="font-bold text-base leading-tight mb-2">{uni.name}</h3>
                  <UniCourseList courses={uni.courses} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="companies" title={t("companies")}>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.companies.map((co) => (
              <div key={co.name} className="card-surface rounded-xl overflow-hidden flex">
                <LogoImg
                  src={co.logo}
                  alt={co.name}
                  wrapperClass="w-16 flex-shrink-0 flex items-center justify-center bg-white/70 border-r border-gray-100 p-3"
                  className="w-11 h-11"
                />
                <div className="flex-1 p-4">
                  <h3 className="font-bold text-base leading-tight mb-2">{co.name}</h3>
                  <CompanyProgramList programs={co.programs} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="lectures" title={t("onlineLectures")}>
          <div className="card-surface rounded-xl p-4">
            <LectureList lectures={data.lectures || []} />
          </div>
        </Section>

        <Section id="conferences" title={t("conferencesEvents")}>
          <div className="card-surface rounded-xl p-4">
            <ConferenceList conferences={data.conferences || []} />
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
          <div className="card-surface rounded-xl p-4">
            <SummerSchoolList programs={data.summerSchools || []} />
          </div>
        </Section>

        <Section id="research-programs" title={t("researchPrograms")}>
          <div className="card-surface rounded-xl p-4">
            <ResearchProgramList programs={data.researchPrograms || []} />
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
