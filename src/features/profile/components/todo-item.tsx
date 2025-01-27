"use client"

import React, { memo, useState } from 'react'
import { TodoItemForm } from './todo-item-form';

type IProps = {
  id: number;
  title: string;
  isDone: boolean;
  onTick: (id: number, isDone: boolean) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, title: string) => void;
}

export const TodoItem = memo(({ id, title, isDone, onTick, onDelete, onUpdate }: IProps) => {
  const [isEdit, setIsEdit] = useState(false)

  console.log("Render TodoItem", title);

  const handleTickChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newIsDone = event.target.checked;
    onTick(id, newIsDone);
  }

  const handleDeleteClick = () => {
    onDelete(id);
  }

  const handleEditClick = () => {
    setIsEdit(true)
  }

  const handleCancelEditClick = () => {
    setIsEdit(false)
  }

  if (isEdit) {
    return (
      <TodoItemForm
        id={id}
        title={title}
        onCancelEditClick={handleCancelEditClick}
        onUpdate={onUpdate}
      />
    )
  }

  return (
    <div className='flex items-center gap-4'>
      <input
        type="checkbox"
        defaultChecked={isDone}
        onChange={handleTickChange}
      />
      <div className={isDone ? "line-through text-gray-500" : ""}>{title}</div>
      <button className='text-blue-500' onClick={handleEditClick}>Edit</button>
      <button className='text-red-500' onClick={handleDeleteClick}>Delete</button>
    </div>
  )
})

TodoItem.displayName = "TodoItem"
