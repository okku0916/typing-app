# CodeTyping

プログラマーおよび競技プログラマー向けの、コード入力特化タイピング練習アプリです。

## 技術スタック
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- ローカルJSON問題セット + localStorage保存

## 主な機能（MVP）
- 対応カテゴリ: C++, Python, Rust
- 出題モード:
  - ランダム構文
  - アルゴリズム
- ゲームモード:
  - 通常モード（基本構文は難易度ごとの制限時間、アルゴリズムは共通制限時間）
  - 無制限モード
- タイピング挙動:
  - 大文字・小文字を厳密判定
  - ミス時も入力は止まらず、赤ハイライトで表示
  - Enterで次行インデントを自動スキップ
- リザルト:
  - スコア（正タイプ数 - ペナルティ）
  - WPM
  - 苦手キー Top 3
  - 完了問題数（通常モード）

## 起動方法

```bash
npm install
npm run dev
```

`http://localhost:3000` を開いてください。

## チェックコマンド

```bash
npm run lint
npm run build
```

## データ
- 問題データ: `src/data/problems.json`
- 各問題は `category -> random_syntax | algorithm -> problems[]` の構造
- `random_syntax` のみ各問題に `difficulty` を持たせ、選択した難易度で出題を切り替え
- `algorithm` は難易度で絞り込まず、各言語のアルゴリズム問題全体から出題
- 開発指針: `agent.md`
