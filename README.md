# Smart To-Do App(English Version)

AI-powered productivity and task management web application for university students.
This system helps students organize tasks, manage schedules, and receive AI-generated productivity advice based on their daily workload.

Live Demo:  
https://heroic-yeot-bcf2c4.netlify.app/

---

## Features

- Add, update, and delete tasks
- Task priority management(High / Medium / Low)
- Task filtering system
- Time blocking with start and end times
- Today's schedule dashboard
- AI productivity coach using Gemini API
- Responsive UI design

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- Flask
- Flask-CORS

### Database
- Firebase Firestore

### AI Integration
- Gemini API

### Deployment
- Netlify
- Render

---

## System Architecture

```text
Frontend (HTML/CSS/JavaScript)
        ↓
Flask Backend REST API
        ↓
Firebase Firestore
        ↓
Gemini AI API
```

---

## Project Structure

```text
frontend/
│
├── index.html
├── style.css
├── app.js

backend/
│
├── app.py
├── requirements.txt
```

---

## Main Features

### Task Management
Users can:
- Add tasks
- Set task priority
- Assign date and time
- Mark tasks as complete/incomplete
- Delete tasks

The frontend communicates with the Flask backend using REST APIs.

### Smart Filtering
Users can filter tasks by:
- Completed
- Incomplete
- High Priority
- Medium Priority
- Low Priority

The filtering logic is implemented dynamically using JavaScript

### Today’s Schedule Dashboard
The app :
- Detects today's tasks
- Sorts tasks by date and time
- Displays the current daily schedule

This improves time management and task visibility for students.

### AI Productivity Coach
The app uses Gemini AI to:
- Analyzes today’s and future tasks
- Identifies high-priority work
- Suggests scheduling strategies
- Recommend study planning
- Detect heavy workload
- Help avoid burnout


The backend sends task data to Gemini API using Flask

---

## REST API

| Method | Endpoint | Description |
|---|---|---|
| GET | /tasks | Get all tasks |
| POST | /tasks | Create new task |
| PUT | /tasks/<id> | Update task |
| DELETE | /tasks/<id> | Delete task |
| POST | /ai-suggestions | Generate AI advice |

Backend implementation is written using Flask REST API architecture.

---
## Security
Sensitive information is protected using environment variables:
-Gemini API Key
-Firebase Service Account Credentials

## Installation

### Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY
```

### Install Backend Packages

```bash
pip install -r requirements.txt
```

### Run Flask Backend

```bash
python app.py
```

### Start Frontend

Open index.html using Live Server.

---

## Environment Variables

Create a `.env` file or set environment variables:

```env
GEMINI_API_KEY=your_api_key
FIREBASE_SERVICE_ACCOUNT_JSON=your_firebase_json
```

---

## Screenshots
### Add task form
![Add task form](screenshots/Addtaskform.png)

### Task Lists
![task List](screenshots/Tasklist.png)

### Today's Schedule
![Today's Schedule](screenshots/Todayschedule.png)

### AI Productivity Coach
![AI Advice](screenshots/AIadvicesection.png)

---

## What I Learned

Through this project, I learned:
- Full-stack web development
- REST API development
- Firebase Firestore integration
- AI API integration
- Frontend/backend communication
- Responsive UI design
- Production debugging

---


## Author

Hein Zayar Oo  
日本工学院八王子専門学校（ITカレッジ 情報処理科）  
東京工科大学（コンピューターサイエンス学部 コンピューターサイエンス学科）

# Smart To-Do App（日本語版）

大学生向けのAI搭載タスク管理Webアプリケーションです。  
このシステムは、学生がタスク管理・スケジュール管理を効率的に行い、日々の作業量に応じたAIによる生産性向上アドバイスを受けられるように設計されています。

Live Demo:  
https://heroic-yeot-bcf2c4.netlify.app/

---

## 主な機能

- タスクの追加・更新・削除
- タスク優先度管理（High / Medium / Low）
- タスクフィルタリング機能
- 開始時間・終了時間によるタイムブロッキング
- 今日のスケジュール表示
- Gemini APIを利用したAI Productivity Coach
- レスポンシブUIデザイン

---

## 使用技術

### フロントエンド
- HTML
- CSS
- JavaScript

### バックエンド
- Python
- Flask
- Flask-CORS

### データベース
- Firebase Firestore

### AI連携
- Gemini API

### デプロイ
- Netlify
- Render

---

## システム構成

```text
Frontend (HTML/CSS/JavaScript)
        ↓
Flask Backend REST API
        ↓
Firebase Firestore
        ↓
Gemini AI API
```

---

## プロジェクト構成

```text
frontend/
│
├── index.html
├── style.css
├── app.js

backend/
│
├── app.py
├── requirements.txt
```

---

## 主な機能詳細

### タスク管理機能
ユーザーは以下の操作を行うことができます。

- タスク追加
- 優先度設定
- 日付・時間設定
- タスク完了／未完了管理
- タスク削除

フロントエンドとバックエンドはREST APIを利用して通信しています。

---

### タスクフィルタリング機能
以下の条件でタスクを絞り込むことができます。

- Completed
- Incomplete
- High Priority
- Medium Priority
- Low Priority

フィルタリング処理はJavaScriptによって動的に実装しています。

---

### 今日のスケジュール表示
アプリは以下を自動的に行います。

- 今日のタスク検出
- 日付・時間順にタスクを並び替え
- 当日のスケジュール表示

これにより、学生の時間管理とタスク把握を支援します。

---

### AIプロダクティビティコーチ
Gemini AIを利用して以下を実現しています。

- 今日および今後のタスク分析
- 高優先度タスクの判定
- スケジュール戦略の提案
- 学習計画の提案
- 作業量過多の検出
- バーンアウト防止サポート

バックエンドではFlaskを利用してGemini APIへタスクデータを送信しています。

---

## REST API

| Method | Endpoint | Description |
|---|---|---|
| GET | /tasks | タスク一覧取得 |
| POST | /tasks | 新規タスク作成 |
| PUT | /tasks/<id> | タスク更新 |
| DELETE | /tasks/<id> | タスク削除 |
| POST | /ai-suggestions | AIアドバイス生成 |

バックエンドはFlask REST APIアーキテクチャを用いて実装しています。

---

## セキュリティ

機密情報は環境変数によって保護しています。

- Gemini API Key
- Firebase Service Account Credentials

---

## インストール方法

### リポジトリをクローン

```bash
git clone YOUR_GITHUB_REPOSITORY
```

### バックエンドパッケージをインストール

```bash
pip install -r requirements.txt
```

### Flaskバックエンド起動

```bash
python app.py
```

### フロントエンド起動

Live Serverを使用して `index.html` を起動してください。

---

## 環境変数

`.env` ファイルを作成、または環境変数を設定してください。

```env
GEMINI_API_KEY=your_api_key
FIREBASE_SERVICE_ACCOUNT_JSON=your_firebase_json
```

---

## スクリーンショット

### タスク追加フォーム
![Add task form](screenshots/Addtaskform(jpn).png)

### タスクリスト
![Task List](screenshots/Tasklist(jpn).png)

### 今日のスケジュール
![Today's Schedule](screenshots/Todayschedule(jpn).png)

### AIプロダクティビティコーチ
![AI Advice](screenshots/Aiadvice(jpn).png)

---

## このプロジェクトを通して学んだこと

- フルスタックWeb開発
- REST API開発
- Firebase Firestore連携
- AI API連携
- フロントエンド／バックエンド通信
- レスポンシブUI設計
- 本番環境デバッグ

---

## Author

Hein Zayar Oo  
日本工学院八王子専門学校（ITカレッジ 情報処理科）  
東京工科大学（コンピューターサイエンス学部 コンピューターサイエンス学科）
