"use client";
import { usePathname } from "next/navigation";
import { Link } from "@/navigation";

export default function NavLinks({ links }) {
  const pathname = usePathname();

  return (
    <nav className="hidden gap-6 text-sm font-medium sm:flex">
      {links.map((l) => {
        // Match if the pathname contains the href segment (handles locale prefix)
        const isActive = pathname.includes(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`transition-colors ${
              isActive
                ? "text-foreground font-semibold"
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
