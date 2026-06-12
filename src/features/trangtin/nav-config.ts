export const TRANGTIN_NAV_ITEMS = [
  { label: "Home", href: (locale: string) => `/${locale}/trangtin` },
  {
    label: "Search",
    href: (locale: string) => `/${locale}/trangtin/tim-kiem`,
  },
  { label: "Contact", href: (locale: string) => `/${locale}/trangtin/lien-he` },
  { label: "Admin", href: (locale: string) => `/${locale}/trangtin/admin` },
] as const;
