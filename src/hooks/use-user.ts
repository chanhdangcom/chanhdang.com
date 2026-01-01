"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export type UserRole = "guest" | "user" | "admin";

interface User {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  email?: string;
  role?: UserRole;
}

export function useUser() {
  const { data: session, status } = useSession();
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  // Load local user từ localStorage (login thường)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setLocalUser(JSON.parse(stored) as User);
      }
    } catch {
      localStorage.removeItem("user");
    } finally {
      setIsLoadingLocal(false);
    }
  }, []);

  // Tách biệt: Google login (session) vs Login thường (localStorage)
  const googleUser = session?.user
    ? {
        id: session.user.id,
        username: session.user.name || session.user.email || "",
        displayName: session.user.name,
        avatarUrl: session.user.image || undefined,
        email: session.user.email || undefined,
        role: ((session.user as { role?: string }).role || "user") as UserRole,
      }
    : null;

  const user = googleUser || localUser;

  // Debug: log để kiểm tra
  useEffect(() => {
    if (session?.user) {
      console.log("Google user avatar:", {
        hasSession: !!session,
        image: session.user.image,
        avatarUrl: googleUser?.avatarUrl,
      });
    }
  }, [session, googleUser?.avatarUrl]);

  const login = (userData?: User) => {
    if (userData) {
      // Login thường: lưu vào localStorage
      setLocalUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      // Login Google: dùng NextAuth
      signIn("google");
    }
  };

  const logout = async () => {
    try {
      // Check if user is logged in via Google (has active session)
      if (session) {
        // Google logout - signOut with redirect disabled
        // This will clear the NextAuth session
        await signOut({
          redirect: false, // We'll handle redirect manually
        });
      }
    } catch (error) {
      console.error("Error during Google logout:", error);
      // Continue with local logout even if Google logout fails
    } finally {
      // Always clear local user data
      setLocalUser(null);
      localStorage.removeItem("user");
    }
  };

  return {
    user,
    isLoading: status === "loading" || isLoadingLocal,
    login,
    logout,
    isAuthenticated: !!user,
  };
}