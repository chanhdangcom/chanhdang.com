import { TechStudiesItem } from "@/components/tech-studies-item";

type IProp = {
  techName: string;
};
const ITechList: IProp[] = [
  {
    techName: "React",
  },
  {
    techName: "Next.js",
  },
  {
    techName: "Tailwind CSS",
  },
  {
    techName: "Docker",
  },
  {
    techName: "TypeScript",
  },
  {
    techName: "Github",
  },
  {
    techName: "UX/UI",
  },
  {
    techName: "Libray",
  },
];
export const TechStudiesListQuaric = ({}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {ITechList.map((item, key) => (
        <div key={key} className="">
          <div className="">
            <TechStudiesItem techName={item.techName} />
          </div>
        </div>
      ))}
    </div>
  );
};
