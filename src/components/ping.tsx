export const Ping = () => {
  return (
    <span className="relative flex h-3 w-3 items-center justify-center">
      <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
      <span className="relative h-2 w-2 rounded-full bg-green-500"></span>
    </span>
  );
};
