// import { BlogDetailsPageClient } from "@/features/blog/page-details-client";
import { getPosts } from "@/apii/blog/get-posts";
import { BlogDetailsPageServer } from "@/features/blog/blog-details-page-server";

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 minutes
export const revalidate = 600;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type IPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: IPageProps) {
  const paramsData = await params;
  const slug = paramsData.slug;

  return <BlogDetailsPageServer slug={slug} />;
}
