type IProp = {
  title: string;
  onClick: (title: string) => void;
};

export function MusicTypeItem({ title, onClick }: IProp) {
  return (
    <div
      onClick={() => onClick(title)}
      className="shrink-0 cursor-pointer rounded-lg bg-zinc-100/10 px-6 py-2 shadow-sm"
    >
      {title}
    </div>
  );
}
