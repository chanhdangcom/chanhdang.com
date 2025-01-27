"use client";

import React, { useState } from 'react';
import { NotesItem } from './notes-item';
import { NotesForm } from './notes-form';

type INotesItem = {
    id: number;
    title: string;
    content: string;
}

const DAFAULT_NOTES_LIST: INotesItem[] = [
    {
        id: 1,
        title: "title 1",
        content: "content 1"
    },
    {
        id: 2,
        title: "title 2",
        content: "content 2"
    },
    {
        id: 3,
        title: "title 3",
        content: "content 3"
    }
]    

export const NotesList = () => {
    const[notesList, setNotesList] = useState<INotesItem[]>(DAFAULT_NOTES_LIST);

    const handleAdd = (title: string) => {
        setNotesList((prevNotesList) => {
            return [...prevNotesList, {
                id: prevNotesList.length + 1,
                title: title,
                content: "content"
            }]
        })
    }

    const handleDelete = (id: number) => {
        setNotesList((prevNotesList) => {
          return prevNotesList.filter((notesItem) => notesItem.id !== id);
        });
      }

    return (
        <div>
                {notesList.map((item) => {
                return (
                    <NotesItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        content={item.content}
                        onDelete={handleDelete}
                    />
                )
            })}

            <NotesForm
                onAdd={handleAdd}
            />
        </div>
    )
    }
