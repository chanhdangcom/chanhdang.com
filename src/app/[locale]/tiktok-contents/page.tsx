"use client";
import { useState } from "react";

export default function Page() {
  const [isDang, setIsDang] = useState(true);

  if (isDang) {
    return (
      <div className="font-sans" onClick={() => setIsDang(false)}>
        Đang
      </div>
    );
  }

  return <div onClick={() => setIsDang(true)}>Không phải Đang</div>;
}
