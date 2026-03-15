/**
 * Permission system for the music platform
 * Roles: guest, user, admin
 * Gói: Free (đã đăng nhập) = không quảng cáo; Premium = đủ tính năng trừ thêm bài/tạo kênh; Premium Creator = đủ tất cả.
 */

export type UserRole = "guest" | "user" | "admin";

export interface PremiumTier {
  isPremium?: boolean;
  isPremiumCreator?: boolean;
}

export interface UserPermissions {
  canAddMusic: boolean;
  canAddSinger: boolean;
  canManageSystem: boolean;
  canListenWithoutAds: boolean;
  canCreateArtistProfile: boolean;
  canManageShopProducts: boolean;
  canManageShopOrders: boolean;
  canManageShopCoupons: boolean;
}

/**
 * Get permissions based on role and premium tier.
 * - Free (logged-in): no ads. No add music / no create artist channel.
 * - Premium: no ads, all features except add music & create artist channel.
 * - Premium Creator: no ads, all features including add music & create artist channel.
 */
export function getPermissions(
  role: UserRole | null | undefined,
  tier?: PremiumTier | null
): UserPermissions {
  const isPremiumCreator = Boolean(tier?.isPremiumCreator);
  const isPremium = Boolean(tier?.isPremium);

  switch (role) {
    case "admin":
      return {
        canAddMusic: true,
        canAddSinger: true,
        canManageSystem: true,
        canListenWithoutAds: true,
        canCreateArtistProfile: true,
        canManageShopProducts: true,
        canManageShopOrders: true,
        canManageShopCoupons: true,
      };
    case "user":
      return {
        canAddMusic: isPremiumCreator,
        canAddSinger: false,
        canManageSystem: false,
        canListenWithoutAds: true, // Đăng nhập = không quảng cáo
        canCreateArtistProfile: isPremiumCreator,
        canManageShopProducts: false,
        canManageShopOrders: false,
        canManageShopCoupons: false,
      };
    case "guest":
    default:
      return {
        canAddMusic: false,
        canAddSinger: false,
        canManageSystem: false,
        canListenWithoutAds: false,
        canCreateArtistProfile: false,
        canManageShopProducts: false,
        canManageShopOrders: false,
        canManageShopCoupons: false,
      };
  }
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  role: UserRole | null | undefined,
  permission: keyof UserPermissions,
  tier?: PremiumTier | null
): boolean {
  const permissions = getPermissions(role, tier);
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

