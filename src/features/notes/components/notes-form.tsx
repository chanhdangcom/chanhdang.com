import React, { useState } from "react";

type IProps = {
    onAdd: (title: string) => void
}

export const NotesForm = ({onAdd}: IProps) => {

    const [title, setTitle]= useState<string>("");

    const handleAddClick = () => {
       onAdd(title)
    }

    const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setTitle(event.target.value)
    }

    return (
        <div>
            <input className="border p-2 rounded-sm" type="text" value={title} placeholder="title" onChange={ handleTitleChange}/>
            <button className="border bg-blue-500 p-2 rounded-sm" onClick={handleAddClick}>Add</button>
        </div>
    )
}

