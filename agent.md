# Agent Guide - CodeTyping

## プロジェクト目的
- プログラマーおよび競技プログラマー向けのコード入力特化タイピング練習アプリを構築する。
- 初期リリースはバックエンドなしで完結させる。
  - 問題データ: `src/data/problems.json`
  - 保存先: `localStorage`

## 技術スタック
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- 状態管理は React Hooks を基本とし、必要時のみ Context を追加

## コア要件
- 大文字・小文字は厳密判定。
- 入力はミスしても止めない。
  - ミス文字は赤ハイライト。
  - ミス数をスコア減点に反映。
- 複数行コードの Enter 入力時、次行インデントを自動スキップする。
- リザルト画面に以下を表示する。
  - スコア（`correctChars - penalty`）
  - WPM（`(correctChars / 5) / minutes`）
  - 苦手キー Top 3
  - 完了問題数

## データ契約
- `src/data/problems.json`
  - カテゴリ: `cpp`, `python`, `rust`, `competitive_programming`
  - 難易度: `level_1`, `level_2`, `level_3`
  - 問題項目:
    - `id: string`
    - `title: string`
    - `mode: "syntax" | "algorithm"`
    - `code: string`

## アーキテクチャ
- `src/features/problems/*`
  - スキーマ検証と問題選択ロジック
- `src/features/typing/*`
  - 純関数ベースのタイピング判定エンジン
  - スコア/WPM/苦手キー集計
  - インデントスキップ補助
- `src/hooks/*`
  - セッション制御（`useTypingSession`）
  - タイマー（`useTimer`）
  - localStorage連携（`useLocalStorageState`）
- `src/components/*`
  - 表示中心のUI部品（各種セレクタ、コード表示、リザルト）

## UI方針
- 初期は VS Code Dark+ 風のエディタUI。
- 将来テーマ切替に備え、色は CSS 変数トークンで定義する。

## デフォルト定数
- 制限時間:
  - `level_1`: 60秒
  - `level_2`: 120秒
  - `level_3`: 180秒
  - 無制限モード: 上限なし
- ペナルティ: 1ミスごとに `-1`

## 実装フェーズ
1. 環境構築とUI骨組み
2. 問題データ層と選択ロジック
3. タイピング判定エンジン
4. タイマー/モード制御とインデントUX
5. リザルト指標と表示
6. localStorage永続化
7. lint/build検証と仕上げ

## MVPの完了条件
- ホーム画面でカテゴリ/出題モード/難易度/ゲームモードを選択できる。
- プレイ画面でリアルタイム判定、ミス表示、進捗、タイマーが動作する。
- Enterでインデントスキップが機能する。
- 通常モードで時間内に問題完了時、次の問題が自動出題される。
- リザルト画面でスコア/WPM/苦手キー/完了問題数を表示する。
- 設定と最新リザルトがリロード後も復元される。
