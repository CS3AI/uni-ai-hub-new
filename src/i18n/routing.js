import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // All supported locales
  locales: ["en", "zh", "fr", "es", "de", "ja", "ru", "ko"],

  // English is the default — no /en prefix, just /
  defaultLocale: "en",
  localePrefix: "as-needed",
});
