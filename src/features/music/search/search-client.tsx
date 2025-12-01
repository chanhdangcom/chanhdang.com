"use client";

import { useEffect, useState } from "react";
import { SearchMotion } from "../component/search-motion";

// Client component: quản lý state search và ẩn/hiện carousels bằng DOM
export function SearchClient() {
  const [value, setValue] = useState("");

  useEffect(() => {
    const el = document.getElementById("search-carousels");
    if (!el) return;

    const hasQuery = value.trim().length > 0;
    el.style.display = hasQuery ? "none" : "";
  }, [value]);

  return (
    <div className="z-20 mt-4 md:ml-[270px]">
      <SearchMotion onQueryChange={setValue} />
    </div>
  );
}
