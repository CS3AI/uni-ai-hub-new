import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ViewCounter from "./ViewCounter";
import NavLinks from "./NavLinks";

export default async function Navbar() {
  const t = await getTranslations("nav");

  const LINKS = [
    { href: "/information", label: t("information") },
    { href: "/courses", label: t("courses") },
    { href: "/internship", label: t("internship") },
    { href: "/opportunity", label: t("activity") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg brand-gradient" aria-hidden />
            <span className="text-base font-semibold tracking-tight">Uni AI Hub</span>
          </Link>
          <ViewCounter />
        </div>
        <NavLinks links={LINKS} />
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs font-semibold tracking-widest uppercase brand-gradient-text select-none">
            YCM Studio
          </span>
          <div className="hidden sm:block h-4 w-px bg-border" aria-hidden />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
