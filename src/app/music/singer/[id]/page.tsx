"use client";

import { SingerPage } from "@/features/music/singer-page";
import { useParams } from "next/navigation";

export default function SingerDetailPage() {
  const { id } = useParams();
  return <SingerPage idSinger={id as string} />;
}
