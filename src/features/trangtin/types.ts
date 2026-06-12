export type NewsCategory = {
  name: string;
  slug: string;
  description: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  categorySlug: string;
  categoryName: string;
  coverImage: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
};

export type ArticleInput = {
  title: string;
  slug?: string;
  description: string;
  content: string;
  categorySlug: string;
  coverImage?: string;
  author?: string;
  isPublished?: boolean;
};
