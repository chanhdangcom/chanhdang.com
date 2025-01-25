"use client"

import React, { memo } from 'react'

type IProps = {
  id: number;
  title: string;
  isDone: boolean;
  onTick: (id: number, isDone: boolean) => void;
}

export const TodoItem = memo(({ id, title, isDone, onTick }: IProps) => {
  console.log("Render TodoItem", title);

  return (
    <div className='flex items-center gap-4'>
      <input
        type="checkbox"
        defaultChecked={isDone}
        onChange={(e) => {
          const newIsDone = e.target.checked;
          onTick?.(id, newIsDone);
        }}
      />
      <div className={isDone ? "line-through text-red-500" : ""}>{title}</div>
    </div>
  )
})

TodoItem.displayName = "TodoItem"
