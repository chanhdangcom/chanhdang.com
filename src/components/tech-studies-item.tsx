type IProp = {
  techName: string;
};

export const TechStudiesItem = ({ techName }: IProp) => {
  return (
    <div className="w-fit gap-2 rounded-full border border-zinc-400 p-1 text-sm text-gray-400 dark:border-zinc-800">
      {techName}
    </div>
  );
};
