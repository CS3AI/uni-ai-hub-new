import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/navigation";
import digest from "@/data/digest.json";
import WeeklyDigest from "@/components/WeeklyDigest";
import OpportunityMatch from "@/components/OpportunityMatch";
import FeedbackWall from "@/components/FeedbackWall";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const SECTIONS = [
    {
      href: "/information",
      title: "Information",
      desc: t("sections.information.desc"),
      tag: t("sections.information.tag"),
      cardBg: "bg-blue-50",
      cardHover: "hover:bg-blue-100",
      accent: "text-blue-600",
    },
    {
      href: "/courses",
      title: "Courses",
      desc: t("sections.courses.desc"),
      tag: t("sections.courses.tag"),
      cardBg: "bg-red-50",
      cardHover: "hover:bg-red-100",
      accent: "text-red-600",
    },
    {
      href: "/internship",
      title: "Internship",
      desc: t("sections.internship.desc"),
      tag: t("sections.internship.tag"),
      cardBg: "bg-green-50",
      cardHover: "hover:bg-green-100",
      accent: "text-green-600",
    },
    {
      href: "/opportunity",
      title: "Opportunity",
      desc: t("sections.activity.desc"),
      tag: t("sections.activity.tag"),
      cardBg: "bg-yellow-50",
      cardHover: "hover:bg-yellow-100",
      accent: "text-yellow-600",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Hero */}
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
        <span className="brand-gradient-text">Uni AI Hub</span>
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">
        {t("subtitle")}
      </p>

      {/* Section cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`${s.cardBg} ${s.cardHover} group flex flex-col justify-between rounded-2xl p-5 shadow-sm transition hover:shadow-md`}
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium text-muted border border-gray-200">
                  {s.tag}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
            <span className={`mt-4 text-sm font-medium ${s.accent} group-hover:underline`}>
              {t("viewMore")}
            </span>
          </Link>
        ))}
      </div>

      {/* AI Opportunity Match */}
      <OpportunityMatch locale={locale} />

      {/* Weekly Digest */}
      <WeeklyDigest digest={digest} locale={locale} />

      {/* Peer Profiles — Coming Soon */}
      <div className="mt-8 card-surface rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-base">{t("peerProfilesTitle")}</p>
            <p className="mt-1 text-sm text-muted">{t("peerProfilesDesc")}</p>
          </div>
          <span className="ml-4 shrink-0 text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded-full border border-gray-200 text-muted">
            Coming Soon
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl border-2 border-dashed border-gray-200 p-4 flex flex-col items-center justify-center text-center min-h-[96px]"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 mb-2" />
              <p className="text-xs text-muted">Profile coming soon</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Feedback Wall */}
      <div className="mt-8">
        <FeedbackWall title={t("feedbackWallTitle")} />
      </div>
    </div>
  );
}
