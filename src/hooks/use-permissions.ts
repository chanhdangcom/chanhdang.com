"use client";

import { useUser } from "./use-user";
import { getPermissions, hasPermission, type UserRole, type UserPermissions } from "@/lib/permissions";

/**
 * Hook to get user permissions based on their role
 */
export function usePermissions(): UserPermissions & { role: UserRole | null } {
  const { user } = useUser();
  const role = (user?.role || null) as UserRole | null;
  const permissions = getPermissions(role);

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
  const role = (user?.role || null) as UserRole | null;
  return hasPermission(role, permission);
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { user } = useUser();
  return !!user && user.role !== "guest";
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  const { user } = useUser();
  return user?.role === "admin";
}

