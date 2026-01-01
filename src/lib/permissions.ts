/**
 * Permission system for the music platform
 * Roles: guest, user, admin
 */

export type UserRole = "guest" | "user" | "admin";

export interface UserPermissions {
  canAddMusic: boolean;
  canAddSinger: boolean;
  canManageSystem: boolean;
  canListenWithoutAds: boolean;
  canCreateArtistProfile: boolean;
}

/**
 * Get permissions based on user role
 */
export function getPermissions(role: UserRole | null | undefined): UserPermissions {
  switch (role) {
    case "admin":
      return {
        canAddMusic: true,
        canAddSinger: true,
        canManageSystem: true,
        canListenWithoutAds: true,
        canCreateArtistProfile: true,
      };
    case "user":
      return {
        canAddMusic: true,
        canAddSinger: false, // Only admin can add singers freely
        canManageSystem: false,
        canListenWithoutAds: true,
        canCreateArtistProfile: true, // Users can create their own artist profile
      };
    case "guest":
    default:
      return {
        canAddMusic: false,
        canAddSinger: false,
        canManageSystem: false,
        canListenWithoutAds: false, // Guests hear ads
        canCreateArtistProfile: false,
      };
  }
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  role: UserRole | null | undefined,
  permission: keyof UserPermissions
): boolean {
  const permissions = getPermissions(role);
  return permissions[permission];
}

/**
 * Require authentication (user or admin)
 */
export function requireAuth(role: UserRole | null | undefined): boolean {
  return role === "user" || role === "admin";
}

/**
 * Require admin role
 */
export function requireAdmin(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

