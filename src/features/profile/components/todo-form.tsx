import React, { memo, useState } from 'react'

type IProps = {
  onAdd: (title: string) => void;
}

export const TodoForm = memo(({ onAdd }: IProps) => {
  const [title, setTitle] = useState<string>("");

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const inputValue = event.target.value;
    setTitle(inputValue)
  }

  const handleButtonClick = () => {
    onAdd(title)
  }

  console.log("Render TodoForm");

  return (
    <div className='space-x-2 mt-4'>
      <input placeholder="Todo title" className='border rounded-md' value={title} onChange={handleTitleChange} />
      <button className='bg-black text-white rounded-md px-2' onClick={handleButtonClick}>Add todo</button>
    </div>
  )
});

TodoForm.displayName = "TodoForm"
