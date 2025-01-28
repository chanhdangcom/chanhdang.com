import React, { memo, useState } from 'react'

type IProps = {
  onAdd: (title: string) => void;
}

// Controlled Input

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
    <div className='flex space-x-2 mt-4'>
      <input placeholder="Todo title" className='border rounded-md' value={title} onChange={handleTitleChange} />

      {title.length < 3 && (
        <div className='text-red-500'>
          Please enter at least 3 characters
        </div>
      )}

      <button className='bg-black text-white rounded-md px-2' onClick={handleButtonClick}>Add todo</button>
    </div>
  )
});

TodoForm.displayName = "TodoForm"
