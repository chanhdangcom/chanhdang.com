"use client";

import React, { useCallback, useState } from 'react'
import { TodoItem } from './todo-item'
// import { TodoForm } from './todo-form';
import { TodoFormUncontrolled } from './todo-form-uncontrolled';

type ITodoItem = {
  id: number;
  title: string;
  isDone: boolean;
  dueDate?: string;
}

// [x] useState
// [x] useRef
// [x] useCallback
// useEffect

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

  const handleAdd = useCallback((title: string) => {
    setTodoList((prevTodoList) => {
      return [...prevTodoList, {
        id: prevTodoList.length + 1,
        title: title,
        isDone: false
      }]
    })
  }, []);

  const handleDelete = useCallback((id: number) => {
    setTodoList((prevTodoList) => {
      return prevTodoList.filter((todoItem) => todoItem.id !== id);
    });
  }, [])

  const handleUpdate = useCallback((id: number, title: string, dueDate: string) => {
    setTodoList((prevTodoList) => {
      const todo = prevTodoList.find((todoItem) => todoItem.id === id);

      if (!todo) {
        return prevTodoList;
      }

      todo.title = title;
      todo.dueDate = dueDate;

      return [...prevTodoList];
    });
  }, [])

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
            <TodoItem
              key={item.id}

              id={item.id}
              title={item.title}
              isDone={item.isDone}
              dueDate={item.dueDate}

              onTick={handleTick}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          )
        })}
      </div>

      <TodoFormUncontrolled onAdd={handleAdd} />
    </div>
  )
}