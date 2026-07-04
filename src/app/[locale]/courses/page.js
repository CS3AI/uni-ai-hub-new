import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageHeader from "@/components/PageHeader";
import CourseTabs from "@/components/CourseTabs";
import LogoImg from "@/components/LogoImg";
import { getCoursesData } from "@/lib/courses";
import {
  UniCourseList, CompanyProgramList,
  LectureList, ConferenceList, VolunteerList,
  SummerSchoolList, ResearchProgramList,
} from "@/components/CourseAccordion";

export const revalidate = 600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CoursesPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("courses");
  const data = await getCoursesData();

  const TABS = [
    { id: "universities",      label: t("universities") },
    { id: "companies",         label: t("companies") },
    { id: "lectures",          label: t("onlineLectures") },
    { id: "conferences",       label: t("conferencesEvents") },
    { id: "volunteering",      label: t("volunteering") },
    { id: "summer-schools",    label: t("summerSchools") },
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

        {/* ── Universities ── */}
        <Section id="universities" title={t("universities")}>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.universities.map((uni) => (
              <div key={uni.name} className="card-surface rounded-xl overflow-hidden flex">
                <LogoImg
                  src={uni.logo} alt={uni.name}
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

        {/* ── Companies ── */}
        <Section id="companies" title={t("companies")}>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.companies.map((co) => (
              <div key={co.name} className="card-surface rounded-xl overflow-hidden flex">
                <LogoImg
                  src={co.logo} alt={co.name}
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

        {/* ── Online Lectures ── */}
        <Section id="lectures" title={t("onlineLectures")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <LectureList lectures={data.lectures || []} />
          </div>
        </Section>

        {/* ── Conferences & Events ── */}
        <Section id="conferences" title={t("conferencesEvents")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <ConferenceList conferences={data.conferences || []} />
          </div>
        </Section>

        {/* ── Volunteer Opportunities ── */}
        <Section id="volunteering" title={t("volunteering")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <VolunteerList programs={data.volunteering || []} />
          </div>
        </Section>

        {/* ── Summer Schools ── */}
        <Section id="summer-schools" title={t("summerSchools")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <SummerSchoolList programs={data.summerSchools || []} />
          </div>
        </Section>

        {/* ── Research Programs ── */}
        <Section id="research-programs" title={t("researchPrograms")}>
          <div className="grid gap-4 sm:grid-cols-2">
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
