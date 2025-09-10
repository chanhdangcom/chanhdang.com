"use client";
import React, { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import ReactConfetti from "react-confetti";

// const saveDate = (today: dayjs.Dayjs) => {
//   const nextConfettiDate = today.add(1, "day").toISOString();
//   localStorage.setItem("confettiDate", nextConfettiDate);
// };

export const Confetti = () => {
  const [isClient, setIsClient] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <ReactConfetti width={width} height={height} recycle={false} />;
};
