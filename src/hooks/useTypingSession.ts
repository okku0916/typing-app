"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { selectProblemByCursor } from "@/features/problems/selector";
import {
  applyKeyInput,
  createInitialState,
  summarizeTyping,
  type TypingEngineState,
} from "@/features/typing/engine";
import { useTimer } from "@/hooks/useTimer";
import { STORAGE_KEYS, TIME_LIMITS } from "@/lib/constants";
import { writeStorage } from "@/lib/storage";
import type { SelectedProblem } from "@/types/problem";
import type { AppSettings } from "@/types/settings";
import type { SessionResult } from "@/types/session";

export type SessionStatus = "ready" | "running" | "finished";

interface AggregateStats {
  correctChars: number;
  mistakeCount: number;
  mistakeMap: TypingEngineState["mistakeMap"];
  completedProblems: number;
}

interface SessionState {
  status: SessionStatus;
  problem: SelectedProblem;
  engineState: TypingEngineState;
  result: SessionResult | null;
  endReason: "completed" | "time_up" | null;
  cursor: number;
  aggregate: AggregateStats;
}

export interface TypingSession {
  status: SessionStatus;
  problem: SelectedProblem;
  engineState: TypingEngineState;
  result: SessionResult | null;
  endReason: "completed" | "time_up" | null;
  elapsedSeconds: number;
  remainingSeconds: number | null;
  totalSeconds: number | null;
  completedProblems: number;
  inputKey: (key: string) => void;
  restart: () => void;
}

function emptyAggregate(): AggregateStats {
  return {
    correctChars: 0,
    mistakeCount: 0,
    mistakeMap: {},
    completedProblems: 0,
  };
}

function mergeMistakeMap(
  base: TypingEngineState["mistakeMap"],
  addition: TypingEngineState["mistakeMap"],
) {
  const merged = { ...base };

  Object.entries(addition).forEach(([key, count]) => {
    merged[key] = (merged[key] ?? 0) + count;
  });

  return merged;
}

function createStateByCursor(
  config: AppSettings,
  cursor: number,
  aggregate: AggregateStats,
  status: SessionStatus,
): SessionState {
  const problem = selectProblemByCursor({
    category: config.category,
    difficulty: config.difficulty,
    drillMode: config.drillMode,
    cursor,
  });

  return {
    status,
    problem,
    engineState: createInitialState(problem.code),
    result: null,
    endReason: null,
    cursor,
    aggregate,
  };
}

function normalizeInitialCursor(initialCursor: number) {
  if (!Number.isFinite(initialCursor)) {
    return 0;
  }

  return Math.max(0, Math.floor(initialCursor));
}

export function useTypingSession(
  config: AppSettings,
  initialCursor: number,
): TypingSession {
  const [sessionState, setSessionState] = useState<SessionState>(() =>
    createStateByCursor(config, normalizeInitialCursor(initialCursor), emptyAggregate(), "ready"),
  );

  const elapsedRef = useRef(0);
  const totalSeconds =
    config.gameMode === "timed"
      ? config.drillMode === "random_syntax"
        ? TIME_LIMITS[config.difficulty]
        : TIME_LIMITS.level_3
      : null;

  const finalizeSession = useCallback(
    (
      baseState: SessionState,
      finalEngineState: TypingEngineState,
      elapsedSeconds: number,
      problemSolved: boolean,
    ): SessionState => {
      if (baseState.status === "finished") {
        return baseState;
      }

      const nextAggregate: AggregateStats = {
        correctChars: baseState.aggregate.correctChars + finalEngineState.correctChars,
        mistakeCount: baseState.aggregate.mistakeCount + finalEngineState.mistakeCount,
        mistakeMap: mergeMistakeMap(baseState.aggregate.mistakeMap, finalEngineState.mistakeMap),
        completedProblems:
          baseState.aggregate.completedProblems + (problemSolved ? 1 : 0),
      };

      const canContinueTimed =
        config.gameMode === "timed" &&
        totalSeconds !== null &&
        problemSolved &&
        elapsedSeconds < totalSeconds;

      if (canContinueTimed) {
        return createStateByCursor(config, baseState.cursor + 1, nextAggregate, "running");
      }

      const aggregatedState: TypingEngineState = {
        ...finalEngineState,
        correctChars: nextAggregate.correctChars,
        mistakeCount: nextAggregate.mistakeCount,
        mistakeMap: nextAggregate.mistakeMap,
      };

      const stats = summarizeTyping(aggregatedState, elapsedSeconds);
      const result: SessionResult = {
        config,
        problem: baseState.problem,
        stats: {
          ...stats,
          completedProblems: nextAggregate.completedProblems,
        },
        endReason: problemSolved ? "completed" : "time_up",
        completedAt: new Date().toISOString(),
      };

      return {
        ...baseState,
        status: "finished",
        result,
        endReason: problemSolved ? "completed" : "time_up",
        aggregate: nextAggregate,
      };
    },
    [config, totalSeconds],
  );

  const { elapsedSeconds, remainingSeconds, reset } = useTimer({
    isRunning:
      sessionState.status === "running" && !sessionState.engineState.isCompleted,
    totalSeconds,
    onExpire: () => {
      setSessionState((previous) => {
        if (previous.status === "finished") {
          return previous;
        }

        const resolvedElapsed = totalSeconds ?? elapsedRef.current;
        return finalizeSession(
          previous,
          previous.engineState,
          resolvedElapsed,
          previous.engineState.isCompleted,
        );
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

  const inputKey = useCallback(
    (key: string) => {
      setSessionState((previous) => {
        if (previous.status === "finished") {
          return previous;
        }

        const normalizedKey = key === "Backspace" ? "__BACKSPACE__" : key;
        const nextEngineState = applyKeyInput(previous.engineState, normalizedKey);

        const nextStatus: SessionStatus =
          previous.status === "ready" && normalizedKey !== "__BACKSPACE__"
            ? "running"
            : previous.status;

        const nextState: SessionState = {
          ...previous,
          status: nextStatus,
          engineState: nextEngineState,
        };

        if (!nextEngineState.isCompleted) {
          return nextState;
        }

        return finalizeSession(nextState, nextEngineState, elapsedRef.current, true);
      });
    },
    [finalizeSession],
  );

  const restart = useCallback(() => {
    elapsedRef.current = 0;
    reset();
    setSessionState((previous) =>
      createStateByCursor(config, previous.cursor + 1, emptyAggregate(), "ready"),
    );
  }, [config, reset]);

  return {
    status: sessionState.status,
    problem: sessionState.problem,
    engineState: sessionState.engineState,
    result: sessionState.result,
    endReason: sessionState.endReason,
    elapsedSeconds,
    remainingSeconds,
    totalSeconds,
    completedProblems: sessionState.aggregate.completedProblems,
    inputKey,
    restart,
  };
}
