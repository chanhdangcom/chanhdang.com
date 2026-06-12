import type { NewsCategory } from "./types";

export const SITE_NAME = "ChanhDang News";
export const SITE_DESCRIPTION =
  "Tech, programming and design news from Chanh Dang.";

export const CATEGORIES: NewsCategory[] = [
  {
    name: "Technology",
    slug: "cong-nghe",
    description: "Latest tech news and trends",
  },
  {
    name: "Programming",
    slug: "lap-trinh",
    description: "Guides and programming experience",
  },
  {
    name: "Design",
    slug: "thiet-ke",
    description: "UI/UX, graphics and user experience",
  },
  {
    name: "Startup",
    slug: "khoi-nghiep",
    description: "Startups, digital business and product development",
  },
];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((item) => item.slug === slug);
}
