"use client";
import React, { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import ReactConfetti from "react-confetti";
import dayjs from "dayjs";

const saveDate = (today: dayjs.Dayjs) => {
  const nextConfettiDate = today.add(1, "day").toISOString();
  localStorage.setItem("confettiDate", nextConfettiDate);
};

export const Confetti = () => {
  const [isClient, setIsClient] = useState(false);
  const { width, height } = useWindowSize();

  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const today = dayjs().startOf("date");
    const confettiDate = localStorage.getItem("confettiDate"); // ISOString | null

    if (!confettiDate) {
      saveDate(today);
      setShouldShow(true);
      return;
    }

    if (dayjs(confettiDate).isBefore(today)) {
      saveDate(today);
      setShouldShow(true);
    }
  }, []);

  if (!isClient || !shouldShow) return null;

  return <ReactConfetti width={width} height={height} recycle={false} />;
};
