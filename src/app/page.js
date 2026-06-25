// Stub — this file is superseded by src/app/[locale]/page.js
// next-intl middleware rewrites all requests to the locale-prefixed path
// before Next.js routing, so this file is never served in practice.
import { notFound } from "next/navigation";
export default function Page() {
  notFound();
}