"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface TimerOptions {
  isRunning: boolean;
  totalSeconds: number | null;
  onExpire?: () => void;
}

export function useTimer(options: TimerOptions) {
  const { isRunning, totalSeconds, onExpire } = options;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((previous) => {
        const next = previous + 1;

        if (totalSeconds !== null && next >= totalSeconds) {
          window.clearInterval(intervalId);
          onExpireRef.current?.();
        }

        return next;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, totalSeconds]);

  const remainingSeconds =
    totalSeconds === null ? null : Math.max(totalSeconds - elapsedSeconds, 0);

  const reset = useCallback(() => {
    setElapsedSeconds(0);
  }, []);

  return {
    elapsedSeconds,
    remainingSeconds,
    reset,
  };
}
