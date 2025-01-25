"use client";

import React, { useCallback, useState } from 'react'
import { TodoItem } from './todo-item'

type ITodoItem = {
  id: number;
  title: string;
  isDone: boolean;
}

const DEFAULT_TODO_LIST: ITodoItem[] = [
  {
    id: 1,
    title: "Learning Next.js",
    isDone: true,
  },
  {
    id: 2,
    title: "Build Portfolio Website (HTML)",
    isDone: true,
  },
  {
    id: 3,
    title: "Convert Portfolio Website to Next.js",
    isDone: false
  },
]

export const TodoList = () => {
  const [todoList, setTodoList] = useState<ITodoItem[]>(DEFAULT_TODO_LIST);

  const handleTick = useCallback((id: number, isDone: boolean) => {
    setTodoList((prevTodoList) => {
      const todo = prevTodoList.find((todoItem) => todoItem.id === id);

      if (!todo) {
        return prevTodoList;
      }

      todo.isDone = isDone;

      return [...prevTodoList];
    });
  }, []);

  const countDone = todoList.reduce((prevValue, currentValue) => prevValue + (currentValue.isDone ? 1 : 0), 0)
  const countNot = todoList.length - countDone;

  return (
    <div>
      <h1>Todo List</h1>

      <div>
        <p>Done: {countDone} todo(s)</p>
        <p>Not Done: {countNot} todo(s)</p>
      </div>

      <div>
        {todoList.map((item) => {
          return (
            <TodoItem key={item.id} id={item.id} title={item.title} isDone={item.isDone} onTick={handleTick} />
          )
        })}
      </div>
    </div>
  )
}