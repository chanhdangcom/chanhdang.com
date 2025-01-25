"use client";

import { Button } from '@/components/button';
import React, { useState } from 'react'

// state
// props (properties)

type IProps = {
  fullName?: string;
  defaultIsLike: boolean;
}

export const Reaction = (props: IProps) => {
  const [isLike, setIsLike] = useState(props.defaultIsLike);

  const handleReactionClick = () => {
    setIsLike((prevIsLike) => !prevIsLike)
  }

  console.log("isLike in component", isLike);

  return (
    <div className='flex items-center gap-4'>
      <div>FullName: {props.fullName}</div>

      <Button title={isLike ? "Dislike" : "Like"} onClick={handleReactionClick} />

      <Button title='Comment' />
    </div>
  )
}

// const handleReactionClick = () => {
//   setLikeCount((prevLikeCount) => prevLikeCount + 1)
//   setLikeCount((prevLikeCount) => prevLikeCount + 1)
// }

// return (
//   <div>
//     <button onClick={handleReactionClick}>
//       Like ({likeCount})
//     </button>
//   </div>
// )