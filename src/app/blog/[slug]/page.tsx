// import { BlogDetailsPageClient } from "@/features/blog/page-details-client";
import { BlogDetailsPageServer } from "@/features/blog/page-details-server";

type IPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: IPageProps) {
  const paramsData = await params;
  const slug = paramsData.slug;

  // return <BlogDetailsPageClient slug={slug} />;
  return <BlogDetailsPageServer slug={slug} />;
}
