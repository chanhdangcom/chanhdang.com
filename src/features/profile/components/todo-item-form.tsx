import React, { useState } from 'react'

type IProps = {
  id: number;
  title: string;
  onCancelEditClick: () => void;
  onUpdate: (id: number, title: string) => void;
}

export const TodoItemForm = ({ id, title, onCancelEditClick, onUpdate }: IProps) => {
  const [inputTitle, setInputTitle] = useState<string>(title)

  const handleInputTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const inputValue = event.target.value;
    setInputTitle(inputValue);
  }

  const handleSaveClick = () => {
    onUpdate(id, inputTitle)
    onCancelEditClick()
  }

  return (
    <div className='flex items-center gap-4'>
      <input
        className='w-full'
        placeholder='Todo title'
        value={inputTitle}
        onChange={handleInputTitleChange}
      />

      <button
        className='text-blue-500 border border-blue-500 px-2 rounded-md'
        onClick={handleSaveClick}
      >
        Save
      </button>

      <button
        className='text-red-500'
        onClick={onCancelEditClick}
      >
        Cancel
      </button>
    </div>
  )
}