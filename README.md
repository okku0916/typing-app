# CodeTyping

Programming-focused typing trainer for developers and competitive programmers.

## Stack
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Local JSON problem set + localStorage persistence

## Features (MVP)
- Categories: C++, Python, Rust, Competitive Programming
- Drill modes:
  - Random Syntax
  - Algorithm
- Game modes:
  - Timed (difficulty-based limit)
  - Unlimited
- Typing behavior:
  - Case-sensitive strict matching
  - Non-blocking mistake input with red highlights
  - Enter auto-jumps indentation for multi-line code
- Results:
  - Score (correct - penalty)
  - WPM
  - Weak keys top 3

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Commands

```bash
npm run lint
npm run build
```

## Data
- Problem data: `src/data/problems.json`
- Agent requirements and architecture guide: `agent.md`
