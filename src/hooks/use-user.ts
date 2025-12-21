"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function useUser() {
  const { data, status } = useSession();
  const sessionUser = data?.user;

  const user = sessionUser
    ? {
        id: sessionUser.id,
        username: sessionUser.name || sessionUser.email || "",
        displayName: sessionUser.name || undefined,
        avatarUrl: sessionUser.image || undefined,
      }
    : null;

  return {
    user,
    isLoading: status === "loading",
    login: () => signIn("google"),
    logout: () => signOut(),
    isAuthenticated: !!user,
  };
}