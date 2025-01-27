"use client"

import React from "react";

type IProps = {
    id: number;
    title: string;
    content: string;
    onDelete: (id: number) => void;
}

export const NotesItem = ({id, title, content, onDelete}: IProps) => {
    const handleDeleteClick = () => {
        onDelete(id);
    }

    return (
        <div className="flex items-center gap-4">
            <div className="space-y-2">
                <div>Id: {id}</div>
                <div>Title: {title}</div>
                <div>Content: {content}</div>
            </div>
            <button className="text-red-500 border rounded-sm" onClick={handleDeleteClick}>Delete</button>
        </div>
        
    )
}