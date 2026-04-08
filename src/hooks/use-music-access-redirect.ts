"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export function useMusicAccessRedirect(
  shouldRedirect: boolean,
  isCheckingAccess: boolean
) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "vi";

  useEffect(() => {
    if (!isCheckingAccess && shouldRedirect) {
      router.replace(`/${locale}/music/premium`);
    }
  }, [isCheckingAccess, locale, router, shouldRedirect]);

  return isCheckingAccess || shouldRedirect;
}
