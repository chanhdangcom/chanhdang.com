// import { BlogDetailsPageClient } from "@/features/blog/page-details-client";
import { getPosts } from "@/api/blog/get-posts";
import { BlogDetailsPageServer } from "@/features/blog/blog-details-page-server";
import type { Metadata } from "next";

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

export async function generateMetadata({
  params,
}: IPageProps): Promise<Metadata> {
  const paramsData = await params;
  const slug = paramsData.slug;

  try {
    const res = await fetch(
      `https://api.quaric.com/api/articles/custom/${slug}`,
      { next: { revalidate: 600 } }
    );

    if (!res.ok) {
      return {
        title: "Blog Post - ChanhDang Developer Blog",
        description:
          "Read articles about web development, design, and technology insights.",
        robots: {
          index: true,
          follow: true,
        },
      };
    }

    const jsonData = (await res.json()) as { data: IPost | null };
    const post = jsonData.data;

    if (!post) {
      return {
        title: "Blog Post - ChanhDang Developer Blog",
        description:
          "Read articles about web development, design, and technology insights.",
        robots: {
          index: true,
          follow: true,
        },
      };
    }

    const title = `${post.title} - ChanhDang Developer Blog`;
    const description =
      post.description ||
      "Read articles about web development, design, and technology insights.";

    return {
      title,
      description,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
      openGraph: {
        title,
        description,
        url: `https://chanhdang.com/blog/${slug}`,
        type: "article",
        publishedTime: post.createdAt,
        images: post.cover?.formats?.medium?.url
          ? [
              {
                url: post.cover.formats.medium.url,
                width: post.cover.formats.medium.width,
                height: post.cover.formats.medium.height,
                alt: post.title,
              },
            ]
          : undefined,
      },
      alternates: {
        canonical: `https://chanhdang.com/blog/${slug}`,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Blog Post - ChanhDang Developer Blog",
      description:
        "Read articles about web development, design, and technology insights.",
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

type IPost = {
  title: string;
  description: string;
  createdAt: string;
  slug: string;
  cover?: {
    formats?: {
      medium?: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
};

export default async function Page({ params }: IPageProps) {
  const paramsData = await params;
  const slug = paramsData.slug;

  return <BlogDetailsPageServer slug={slug} />;
}
