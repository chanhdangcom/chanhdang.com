import React from 'react'
import { TodoList } from './components/todo-list';
// import { Reaction } from './components/reaction';

export const ProfilePage = () => {
  return (
    <div>
      <TodoList />
      {/* <Reaction fullName='Dang2' defaultIsLike={true} /> */}
    </div>
  );
}
