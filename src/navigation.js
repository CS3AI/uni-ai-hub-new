import { createNavigation } from "next-intl/navigation";
import { routing } from "./i18n/routing";

// Locale-aware navigation primitives.
// Use these instead of next/link / next/navigation in all components.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
