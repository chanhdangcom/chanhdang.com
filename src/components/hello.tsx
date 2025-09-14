import React from "react";

type HelloProps = {
  message?: string;
};

export const Hello = ({ message = "Hello World!" }: HelloProps) => {
  return (
    <div className="rounded-lg border border-blue-300 bg-blue-100 p-4">
      <p className="font-medium text-blue-800">{message}</p>
    </div>
  );
};
