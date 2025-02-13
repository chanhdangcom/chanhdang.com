import { BlogTrainingPage } from "@/features/blogtraining/page";

type IPageProps = {
  params: Promise<{ slug: string }>;
};
export default async function Page({ params }: IPageProps) {
  const paramData = await params;
  const slug = paramData.slug;

  return <BlogTrainingPage slug={slug} />;
}
