"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";

export default function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const TABS = [
    { href: "/", label: t("home") },
    { href: "/information", label: t("information") },
    { href: "/courses", label: t("courses") },
    { href: "/internship", label: t("internship") },
    { href: "/activity", label: t("activity") },
  ];

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t bg-surface backdrop-blur sm:hidden">
      <ul className="mx-auto flex max-w-5xl items-stretch justify-between px-2">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={`flex flex-col items-center gap-1 py-2 text-[11px] font-medium ${
                  active ? "text-brand-end" : "text-muted"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    active ? "brand-gradient" : "bg-transparent"
                  }`}
                  aria-hidden
                />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
