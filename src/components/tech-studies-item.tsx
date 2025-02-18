type IProp = {
  techName: string;
};

export const TechStudiesItem = ({ techName }: IProp) => {
  return (
    <div className="w-fit rounded-xl border border-zinc-800 p-1 text-gray-400">
      {techName}
    </div>
  );
};
