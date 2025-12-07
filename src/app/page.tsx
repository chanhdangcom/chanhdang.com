import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

// Root page should redirect to default locale
// The middleware should handle this, but this is a fallback
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
