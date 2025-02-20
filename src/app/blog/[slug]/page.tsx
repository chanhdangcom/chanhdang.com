import { PageDetails } from "@/features/blog/page-details";

type IPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: IPageProps) {
  const paramsData = await params;
  const slug = paramsData.slug;
  return <PageDetails slug={slug} />;
}
