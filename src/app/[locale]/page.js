import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Link } from "@/navigation";
import digest from "@/data/digest.json";
import WeeklyDigest from "@/components/WeeklyDigest";
import OpportunityMatch from "@/components/OpportunityMatch";

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

      {/* About */}
      <div className="mt-10 card-surface rounded-2xl p-5 text-sm text-muted">
        <p className="font-medium text-foreground">{t("about.title")}</p>
        <p className="mt-1">{t("about.desc")}</p>
      </div>

      {/* Weekly Digest */}
      <WeeklyDigest digest={digest} locale={locale} />

      {/* User Feedback Wall */}
      <div className="mt-8 card-surface rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-base">{t("feedbackWallTitle")}</p>
          <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded-full border border-gray-200 text-muted">
            Coming Soon
          </span>
        </div>
        <p className="mt-3 text-sm text-muted italic">— — —</p>
      </div>
    </div>
  );
}
