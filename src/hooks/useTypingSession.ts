"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { selectRandomProblem } from "@/features/problems/selector";
import {
  applyKeyInput,
  createInitialState,
  summarizeTyping,
  type TypingEngineState,
} from "@/features/typing/engine";
import { useTimer } from "@/hooks/useTimer";
import { STORAGE_KEYS, TIME_LIMITS } from "@/lib/constants";
import { writeStorage } from "@/lib/storage";
import type { AppSettings } from "@/types/settings";
import type { SessionResult } from "@/types/session";

export type SessionStatus = "ready" | "running" | "finished";

export interface TypingSession {
  status: SessionStatus;
  problem: ReturnType<typeof selectRandomProblem>;
  engineState: TypingEngineState;
  result: SessionResult | null;
  elapsedSeconds: number;
  remainingSeconds: number | null;
  totalSeconds: number | null;
  inputKey: (key: string) => void;
  restart: () => void;
}

interface SessionState {
  status: SessionStatus;
  problem: ReturnType<typeof selectRandomProblem>;
  engineState: TypingEngineState;
  result: SessionResult | null;
}

function createFreshSession(config: AppSettings): SessionState {
  const problem = selectRandomProblem(config);
  const engineState = createInitialState(problem.code);

  return {
    status: "ready",
    problem,
    engineState,
    result: null,
  };
}

export function useTypingSession(config: AppSettings): TypingSession {
  const [sessionState, setSessionState] = useState<SessionState>(() =>
    createFreshSession(config),
  );

  const elapsedRef = useRef(0);

  const totalSeconds =
    config.gameMode === "timed" ? TIME_LIMITS[config.difficulty] : null;

  const finalizeSession = useCallback(
    (
      baseState: SessionState,
      finalEngineState: TypingEngineState,
      elapsedSeconds: number,
    ): SessionState => {
      if (baseState.status === "finished") {
        return baseState;
      }

      const stats = summarizeTyping(finalEngineState, elapsedSeconds);
      const result: SessionResult = {
        config,
        problem: baseState.problem,
        stats,
        completedAt: new Date().toISOString(),
      };

      return {
        ...baseState,
        status: "finished",
        engineState: finalEngineState,
        result,
      };
    },
    [config],
  );

  const { elapsedSeconds, remainingSeconds, reset } = useTimer({
    isRunning:
      sessionState.status === "running" && !sessionState.engineState.isCompleted,
    totalSeconds,
    onExpire: () => {
      setSessionState((previous) => {
        const resolvedElapsed = totalSeconds ?? elapsedRef.current;

        return finalizeSession(previous, previous.engineState, resolvedElapsed);
      });
    },
  });

  useEffect(() => {
    elapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  useEffect(() => {
    if (sessionState.result) {
      writeStorage(STORAGE_KEYS.latestResult, sessionState.result);
    }
  }, [sessionState.result]);

  const inputKey = useCallback((key: string) => {
    setSessionState((previous) => {
      if (previous.status === "finished") {
        return previous;
      }

      const nextEngineState = applyKeyInput(previous.engineState, key);
      const nextStatus: SessionStatus =
        previous.status === "ready" ? "running" : previous.status;

      const nextState: SessionState = {
        ...previous,
        status: nextStatus,
        engineState: nextEngineState,
      };

      if (!nextEngineState.isCompleted) {
        return nextState;
      }

      return finalizeSession(nextState, nextEngineState, elapsedRef.current);
    });
  }, [finalizeSession]);

  const restart = useCallback(() => {
    elapsedRef.current = 0;
    reset();
    setSessionState(createFreshSession(config));
  }, [config, reset]);

  return {
    status: sessionState.status,
    problem: sessionState.problem,
    engineState: sessionState.engineState,
    result: sessionState.result,
    elapsedSeconds,
    remainingSeconds,
    totalSeconds,
    inputKey,
    restart,
  };
}
