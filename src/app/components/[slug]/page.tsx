import { ComponentPage } from "@/app/[locale]/features/component-page/component-page";

type Props = {
  params: { slug: string };
};

export default function ComponentSlugPage({ params }: Props) {
  return <ComponentPage slug={params.slug} />;
}
