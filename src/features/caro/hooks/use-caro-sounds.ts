"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCaroAudio } from "../lib/caro-audio";
import type { GameState } from "../types";

export function useCaroSounds(state: GameState) {
  const audio = getCaroAudio();
  const [muted, setMuted] = useState(false);
  const prevMoveLen = useRef(0);
  const prevDrawId = useRef<string | null>(null);
  const prevAiSkillId = useRef<string | null>(null);

  const unlock = useCallback(() => {
    audio.unlock();
  }, [audio]);

  const toggleMute = useCallback(() => {
    const next = audio.toggleMute();
    setMuted(next);
  }, [audio]);

  const onUiClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-caro-cell], [data-caro-skill]")) return;
      if (target.closest("button, a, [role='button']")) {
        unlock();
        if (!audio.isMuted) audio.playClick();
      }
    },
    [audio, unlock]
  );

  useEffect(() => {
    const drawId = state.drawAnimation?.card.id ?? null;
    if (drawId && drawId !== prevDrawId.current && state.drawAnimation?.for === "human") {
      unlock();
      if (!audio.isMuted) audio.playDraw();
    }
    prevDrawId.current = drawId;
  }, [state.drawAnimation, audio, unlock]);

  useEffect(() => {
    const len = state.moveHistory.length;
    if (len > prevMoveLen.current && len > 0) {
      const last = state.moveHistory[len - 1];
      unlock();
      if (!audio.isMuted) audio.playPlace(last.player);
    }
    prevMoveLen.current = len;
  }, [state.moveHistory, audio, unlock]);

  useEffect(() => {
    const id = state.aiSkillFlash?.id ?? null;
    if (id && id !== prevAiSkillId.current) {
      unlock();
      if (!audio.isMuted) audio.playSkill();
    }
    prevAiSkillId.current = id;
  }, [state.aiSkillFlash, audio, unlock]);

  useEffect(() => {
    return () => audio.stopBgm();
  }, [audio]);

  return { muted, toggleMute, onUiClick, unlock };
}
