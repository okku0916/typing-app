import { getIndentJump } from "@/features/typing/indent";
import { calculatePenalty, calculateScore } from "@/features/typing/score";
import { calculateWpm } from "@/features/typing/wpm";
import {
  incrementMistake,
  subtractMistakeMaps,
  toWeakKeysTop3,
  type MistakeMap,
} from "@/features/typing/weakKeys";

export interface CharacterState {
  expected: string;
  entered: string | null;
  isCorrect: boolean;
  isMistake: boolean;
}

export interface TypingEngineState {
  reference: string;
  cursorIndex: number;
  correctChars: number;
  mistakeCount: number;
  mistakeMap: MistakeMap;
  visual: CharacterState[];
  history: StepHistory[];
  isCompleted: boolean;
}

interface StepHistory {
  consumed: number;
  correctDelta: number;
  mistakeDelta: number;
  mistakeMapDelta: MistakeMap;
}

export interface TypingSummary {
  correctChars: number;
  mistakeCount: number;
  penalty: number;
  score: number;
  elapsedSeconds: number;
  wpm: number;
  weakKeys: Array<{ key: string; count: number }>;
}

export function createInitialState(reference: string): TypingEngineState {
  return {
    reference,
    cursorIndex: 0,
    correctChars: 0,
    mistakeCount: 0,
    mistakeMap: {},
    visual: reference.split("").map((expected) => ({
      expected,
      entered: null,
      isCorrect: false,
      isMistake: false,
    })),
    history: [],
    isCompleted: reference.length === 0,
  };
}

function applyCharacter(
  state: TypingEngineState,
  char: string,
  step: number,
  isMistake: boolean,
): TypingEngineState {
  const currentVisual = state.visual[state.cursorIndex];
  const updatedVisual = [...state.visual];

  updatedVisual[state.cursorIndex] = {
    ...currentVisual,
    entered: char,
    isCorrect: !isMistake,
    isMistake,
  };

  const nextCursor = state.cursorIndex + step;

  const stepHistory: StepHistory = {
    consumed: step,
    correctDelta: isMistake ? 0 : 1,
    mistakeDelta: isMistake ? 1 : 0,
    mistakeMapDelta: isMistake ? incrementMistake({}, char) : {},
  };

  const nextHistory = [...state.history, stepHistory];
  const nextMistakeMap = isMistake
    ? incrementMistake(state.mistakeMap, char)
    : state.mistakeMap;

  return {
    ...state,
    cursorIndex: nextCursor,
    correctChars: state.correctChars + stepHistory.correctDelta,
    mistakeCount: state.mistakeCount + stepHistory.mistakeDelta,
    mistakeMap: nextMistakeMap,
    visual: updatedVisual,
    history: nextHistory,
    isCompleted: nextCursor >= state.reference.length,
  };
}

export function applyBackspace(state: TypingEngineState): TypingEngineState {
  if (state.history.length === 0 || state.cursorIndex === 0) {
    return state;
  }

  const history = [...state.history];
  const lastStep = history.pop();

  if (!lastStep) {
    return state;
  }

  const nextCursor = Math.max(state.cursorIndex - lastStep.consumed, 0);
  const updatedVisual = [...state.visual];

  for (let i = nextCursor; i < state.cursorIndex; i += 1) {
    updatedVisual[i] = {
      ...updatedVisual[i],
      entered: null,
      isCorrect: false,
      isMistake: false,
    };
  }

  return {
    ...state,
    cursorIndex: nextCursor,
    correctChars: Math.max(state.correctChars - lastStep.correctDelta, 0),
    mistakeCount: Math.max(state.mistakeCount - lastStep.mistakeDelta, 0),
    mistakeMap: subtractMistakeMaps(state.mistakeMap, lastStep.mistakeMapDelta),
    visual: updatedVisual,
    history,
    isCompleted: false,
  };
}

export function applyKeyInput(state: TypingEngineState, key: string): TypingEngineState {
  if (key === "__BACKSPACE__") {
    return applyBackspace({
      ...state,
      isCompleted: false,
    });
  }

  if (state.isCompleted || key.length === 0) {
    return state;
  }

  const expected = state.reference[state.cursorIndex];
  const isMistake = key !== expected;

  if (key === "\n" && expected === "\n") {
    const jump = getIndentJump(state.reference, state.cursorIndex + 1);
    const enteredState = applyCharacter(state, key, 1 + jump, false);

    for (let i = state.cursorIndex + 1; i < state.cursorIndex + 1 + jump; i += 1) {
      enteredState.visual[i] = {
        ...enteredState.visual[i],
        entered: enteredState.visual[i].expected,
        isCorrect: true,
        isMistake: false,
      };
    }

    enteredState.correctChars += jump;
    enteredState.history[enteredState.history.length - 1].correctDelta += jump;

    return {
      ...enteredState,
      isCompleted: enteredState.cursorIndex >= state.reference.length,
    };
  }

  return applyCharacter(state, key, 1, isMistake);
}

export function summarizeTyping(state: TypingEngineState, elapsedSeconds: number): TypingSummary {
  const penalty = calculatePenalty(state.mistakeCount);

  return {
    correctChars: state.correctChars,
    mistakeCount: state.mistakeCount,
    penalty,
    score: calculateScore(state.correctChars, state.mistakeCount),
    elapsedSeconds,
    wpm: calculateWpm(state.correctChars, elapsedSeconds),
    weakKeys: toWeakKeysTop3(state.mistakeMap),
  };
}
