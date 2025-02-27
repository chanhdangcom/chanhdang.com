type IProp = {
  techName: string;
};

export const TechStudiesItem = ({ techName }: IProp) => {
  return (
    <div className="w-fit gap-2 rounded-full border border-zinc-400 px-1.5 py-0.5 text-xs text-gray-400 dark:border-zinc-800">
      {techName}
    </div>
  );
};
