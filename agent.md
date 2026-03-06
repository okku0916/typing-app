# Agent Guide - CodeTyping

## Project Goal
- Build a programming-focused typing trainer for developers and competitive programmers.
- Keep the initial release backend-free:
  - Problem source: `src/data/problems.json`
  - Persistence: `localStorage`

## Tech Stack
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- State management with React Hooks (Context only if shared state expands)

## Core Product Rules
- Case-sensitive matching (strict on upper/lower case).
- Non-blocking typing flow:
  - Input is never blocked on mistakes.
  - Mistyped characters are highlighted in red.
  - Mistakes reduce final score.
- Multi-line editor-like behavior:
  - When expected char is newline and user presses Enter, auto-skip indentation on next line.
- Results must show:
  - Score (`correctChars - penalty`)
  - WPM (`(correctChars / 5) / minutes`)
  - Weak keys top 3

## Data Contract
- `src/data/problems.json`
  - Categories: `cpp`, `python`, `rust`, `competitive_programming`
  - Difficulties: `level_1`, `level_2`, `level_3`
  - Problem item:
    - `id: string`
    - `title: string`
    - `mode: "syntax" | "algorithm"`
    - `code: string`

## Architecture
- `src/features/problems/*`
  - Schema parsing/validation and random selection
- `src/features/typing/*`
  - Pure typing engine logic
  - Scoring/WPM/weak-key calculation
  - Indentation jump helper
- `src/hooks/*`
  - Session orchestration (`useTypingSession`)
  - Timer (`useTimer`)
  - localStorage state helper (`useLocalStorageState`)
- `src/components/*`
  - UI-only components (selectors, code view, result panel)

## UI Direction
- Initial UI: VS Code Dark+ inspired editor style.
- Keep theme tokens in CSS variables so future themes can be added without rewriting components.

## Default Gameplay Constants
- Time limits:
  - `level_1`: 60s
  - `level_2`: 120s
  - `level_3`: 180s
  - unlimited mode: no limit
- Penalty: `-1` per mistake

## Build Phases
1. Setup and base UI shell
2. Problem data and selector layer
3. Typing engine and input judgment
4. Timer/game-mode integration and indent-jump UX
5. Result metrics and rendering
6. localStorage persistence for settings/result
7. Validation, lint/build checks, and polish

## Definition of Done (MVP)
- Home screen supports selecting category, drill mode, difficulty, and game mode.
- Play screen supports real-time typing, mistake highlighting, progress, and timer.
- Enter triggers auto-indent jump for multi-line code.
- Result screen shows score, WPM, and weak keys top 3.
- Latest result and settings persist across reloads.
