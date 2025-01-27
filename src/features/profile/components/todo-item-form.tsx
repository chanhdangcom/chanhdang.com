import React, { useState } from 'react'

type IProps = {
  id: number;
  title: string;
  dueDate?: string;
  onCancelEditClick: () => void;
  onUpdate: (id: number, title: string, dueDate: string) => void;
}

export const TodoItemForm = ({ id, title, dueDate, onCancelEditClick, onUpdate }: IProps) => {
  const [inputTitle, setInputTitle] = useState<string>(title)
  const [inputDate, setInputDate] = useState<string>(dueDate || "")

  const handleInputTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const inputValue = event.target.value;
    setInputTitle(inputValue);
  }

  const handleInputDateChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const inputValue = event.target.value;
    setInputDate(inputValue);
  }

  const handleSaveClick = () => {
    onUpdate(id, inputTitle, inputDate)
    onCancelEditClick()
  }

  return (
    <div className='flex items-center gap-4'>
      <input
        className='w-full border rounded-md'
        placeholder='Todo title'
        value={inputTitle}
        onChange={handleInputTitleChange}
      />

      <input placeholder="Date" className='border rounded-md' value={inputDate} onChange={handleInputDateChange}/>

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