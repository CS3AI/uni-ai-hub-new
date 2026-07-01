"use client";
import { usePathname } from "next/navigation";
import { Link } from "@/navigation";

const ACTIVE_STYLES = {
  "/information": "text-blue-700 font-semibold border border-blue-400 bg-blue-50 rounded-md px-2 py-0.5",
  "/courses":     "text-red-700 font-semibold border border-red-400 bg-red-50 rounded-md px-2 py-0.5",
  "/internship":  "text-green-700 font-semibold border border-green-400 bg-green-50 rounded-md px-2 py-0.5",
  "/opportunity": "text-yellow-700 font-semibold border border-yellow-400 bg-yellow-50 rounded-md px-2 py-0.5",
};

export default function NavLinks({ links }) {
  const pathname = usePathname();

  return (
    <nav className="hidden gap-6 text-sm font-medium sm:flex items-center">
      {links.map((l) => {
        const isActive = pathname.includes(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`transition-colors ${
              isActive
                ? ACTIVE_STYLES[l.href] ?? "text-foreground font-semibold"
                : "text-muted hover:text-foreground"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
