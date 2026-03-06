import { getIndentJump } from "@/features/typing/indent";
import { calculatePenalty, calculateScore } from "@/features/typing/score";
import { calculateWpm } from "@/features/typing/wpm";
import { incrementMistake, toWeakKeysTop3, type MistakeMap } from "@/features/typing/weakKeys";

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
  isCompleted: boolean;
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

  return {
    ...state,
    cursorIndex: nextCursor,
    correctChars: state.correctChars + (isMistake ? 0 : 1),
    mistakeCount: state.mistakeCount + (isMistake ? 1 : 0),
    visual: updatedVisual,
    isCompleted: nextCursor >= state.reference.length,
  };
}

export function applyKeyInput(state: TypingEngineState, key: string): TypingEngineState {
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
    return {
      ...enteredState,
      isCompleted: enteredState.cursorIndex >= state.reference.length,
    };
  }

  const nextState = applyCharacter(state, key, 1, isMistake);

  if (!isMistake) {
    return nextState;
  }

  return {
    ...nextState,
    mistakeMap: incrementMistake(nextState.mistakeMap, key),
  };
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
