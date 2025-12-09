import { ComponentListItem } from "./components/component-list-item";

export function ProjectItem() {
  return (
    <div className="">
      <ComponentListItem
        title="chanhdang.com"
        img="/img/tech-stack/nextjs2-dark.svg"
      />

      <ComponentListItem
        title="ChanhDang Music"
        img="/img/tech-stack/nextjs2-dark.svg"
      />

      <ComponentListItem
        title="Library CTDU"
        img="/img/tech-stack/tailwindcss.svg"
      />

      <ComponentListItem
        title="Library CTUM"
        img="/img/tech-stack/nextjs2-dark.svg"
      />

      <ComponentListItem title="DaHuTha Web" img="/img/tech-stack/php.svg" />
    </div>
  );
}
