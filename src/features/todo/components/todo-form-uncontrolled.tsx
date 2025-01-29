import React, { memo, useRef } from "react";

type IProps = {
  onAdd: (title: string) => void;
};

// Uncontrolled Input

export const TodoFormUncontrolled = memo(({ onAdd }: IProps) => {
  // const [title, setTitle] = useState<string>("");

  const titleRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const inputValue = event.target.value;
    // setTitle(inputValue)

    titleRef.current = inputValue;
  };

  const handleButtonClick = () => {
    onAdd(titleRef.current);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  console.log("Render TodoForm");

  return (
    <div className="mt-4 space-x-2">
      <input
        ref={inputRef}
        placeholder="Todo title"
        className="rounded-md border"
        defaultValue=""
        onChange={handleTitleChange}
      />
      <button
        className="rounded-md bg-black px-2 text-white"
        onClick={handleButtonClick}
      >
        Add todo
      </button>
    </div>
  );
});

TodoFormUncontrolled.displayName = "TodoFormUncontrolled";
