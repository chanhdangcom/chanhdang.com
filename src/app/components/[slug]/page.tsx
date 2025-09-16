import { ComponentPage } from "@/app/[locale]/features/component-page/component-page";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ComponentSlugPage({ params }: Props) {
  const resolvedParams = await params;
  return <ComponentPage slug={resolvedParams.slug} />;
}
