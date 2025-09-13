/* eslint-disable @next/next/no-img-element */
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

type IProp = {
  title: string;
};

export function ComponentListItem({ title }: IProp) {
  return (
    <>
      <CardSpotlight>
        <div className="flex items-center gap-2 p-4">
          <ArrowRight size={20} />

          <img src="/img/tech-stack/react.svg" alt="icon" className="size-6" />

          <div className="font-mono text-sm hover:underline">{title}</div>
        </div>
      </CardSpotlight>
    </>
  );
}
