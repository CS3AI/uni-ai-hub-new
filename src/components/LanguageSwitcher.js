"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/navigation";
import { routing } from "@/i18n/routing";

const LANGUAGE_NAMES = {
  en: "EN",
  zh: "中文",
  fr: "FR",
  es: "ES",
  de: "DE",
  ja: "日本語",
  ru: "RU",
  ko: "한국어",
};

const LANGUAGE_FULL = {
  en: "English",
  zh: "中文",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  ja: "日本語",
  ru: "Русский",
  ko: "한국어",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(e) {
    router.replace(pathname, { locale: e.target.value });
  }

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={handleChange}
        aria-label="Language / 语言"
        className="appearance-none cursor-pointer rounded-lg border border-gray-200 bg-surface px-2.5 py-1 pr-6 text-xs font-medium text-muted outline-none transition hover:border-brand-end focus:border-brand-end"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {LANGUAGE_FULL[loc]}
          </option>
        ))}
      </select>
      {/* Custom chevron */}
      <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-muted">
        ▾
      </span>
    </div>
  );
}
