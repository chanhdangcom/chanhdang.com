import { TechStudiesItem } from "@/components/tech-studies-item";

type IProp = {
  techName: string;
};
const ITechList: IProp[] = [
  {
    techName: "C/C++",
  },
  {
    techName: "Java",
  },
  {
    techName: ".NET",
  },
  {
    techName: "PHP",
  },
  {
    techName: "JavaScript",
  },
  {
    techName: "Team work",
  },
];
export const TechStudiesListAGU = ({}) => {
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
