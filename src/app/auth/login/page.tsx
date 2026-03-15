import { redirect } from "next/navigation";

const DEFAULT_LOCALE = "en";

/**
 * NextAuth redirect tới /auth/login (không có locale) nhưng trang login thực tế ở /[locale]/auth/login.
 * Trang này redirect sang /[locale]/auth/login và giữ nguyên query (callbackUrl, error) để xử lý OAuth.
 */
export default async function AuthLoginRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params?.callbackUrl) {
    const v = params.callbackUrl;
    query.set("callbackUrl", typeof v === "string" ? v : v[0] ?? "");
  }
  if (params?.error) {
    const v = params.error;
    query.set("error", typeof v === "string" ? v : v[0] ?? "");
  }
  const qs = query.toString();
  redirect(`/${DEFAULT_LOCALE}/auth/login${qs ? `?${qs}` : ""}`);
}
