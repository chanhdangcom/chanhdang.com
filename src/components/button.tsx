import React from 'react'

type IProps = {
  title: string;
  onClick?: () => void;
}

export const Button = (props: IProps) => {
  return (
    <button className='bg-white text-black rounded-lg px-4 py-2' onClick={props.onClick}>
      {props.title}
    </button>
  )
}
