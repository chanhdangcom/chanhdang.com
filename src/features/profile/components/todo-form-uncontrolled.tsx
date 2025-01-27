import React, { memo, useRef } from 'react'

type IProps = {
  onAdd: (title: string) => void;
}

// Uncontrolled Input

export const TodoFormUncontrolled = memo(({ onAdd }: IProps) => {
  // const [title, setTitle] = useState<string>("");

  const titleRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const inputValue = event.target.value;
    // setTitle(inputValue)

    titleRef.current = inputValue;
  }

  const handleButtonClick = () => {
    onAdd(titleRef.current)

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  console.log("Render TodoForm");

  return (
    <div className='space-x-2 mt-4'>
      <input ref={inputRef} placeholder="Todo title" className='border rounded-md' defaultValue="" onChange={handleTitleChange} />
      <button className='bg-black text-white rounded-md px-2' onClick={handleButtonClick}>Add todo</button>
    </div>
  )
});

TodoFormUncontrolled.displayName = "TodoFormUncontrolled"
