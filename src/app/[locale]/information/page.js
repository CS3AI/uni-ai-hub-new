import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import PageHeader from "@/components/PageHeader";
import InformationFeed from "@/components/InformationFeed";
import { getInformationFeed } from "@/lib/information";

export const revalidate = 1800; // 30-minute ISR

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function InformationPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("information");

  const items = await getInformationFeed({ revalidate: 1800, limit: 200 });

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <PageHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("desc")}
          meta={t("itemCount", { count: items.length })}
        />
        <InformationFeed items={items} />
      </div>
    </div>
  );
}
