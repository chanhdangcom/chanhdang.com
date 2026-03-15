"use client";

import { useUser } from "./use-user";
import { usePremium } from "./use-premium";
import {
  getPermissions,
  hasPermission,
  type UserRole,
  type UserPermissions,
} from "@/lib/permissions";

/**
 * Hook to get user permissions based on role and premium tier.
 * Free (đăng nhập): không quảng cáo. Premium: đủ trừ thêm bài/tạo kênh. Premium Creator: đủ tất cả.
 */
export function usePermissions(): UserPermissions & { role: UserRole | null } {
  const { user } = useUser();
  const { isPremium, isPremiumCreator } = usePremium();
  const role = (user?.role || null) as UserRole | null;
  const permissions = getPermissions(role, {
    isPremium,
    isPremiumCreator,
  });

  return {
    ...permissions,
    role,
  };
}

/**
 * Hook to check if user has a specific permission
 */
export function useHasPermission(permission: keyof UserPermissions): boolean {
  const { user } = useUser();
  const { isPremium, isPremiumCreator } = usePremium();
  const role = (user?.role || null) as UserRole | null;
  return hasPermission(role, permission, { isPremium, isPremiumCreator });
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { user } = useUser();
  return !!user && user.role !== "guest";
}

/**
 * Hook to check if user is admin.
 * Trả về { isAdmin, isLoading } để tránh redirect khi session chưa load (isAdmin tạm false).
 */
export function useIsAdmin(): { isAdmin: boolean; isLoading: boolean } {
  const { user, isLoading } = useUser();
  return {
    isAdmin: user?.role === "admin",
    isLoading,
  };
}

