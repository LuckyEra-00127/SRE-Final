# Habit Tracker Frontend

Production-ready React frontend for the Habit Tracker FastAPI backend.

## Tech Stack

- React 18 with TypeScript
- Vite
- React Router DOM
- Axios
- Zustand
- React Hook Form and Zod
- Tailwind CSS
- Recharts
- Lucide React
- Docker and nginx

## Backend Connection

The app expects the Habit Tracker API to be available at:

```text
http://localhost:8000
```

Configure the API URL with:

```text
VITE_API_URL=http://localhost:8000
```

## Run Locally

```bash
npm install
npm run dev
```

The local Vite dev server runs at:

```text
http://localhost:5173
```

## Run With Docker

```bash
docker compose up -d --build
```

The Dockerized frontend runs at:

```text
http://localhost:3000
```

## Main Pages

- `/login` for existing users
- `/register` for new users
- `/` for the habit dashboard
- `/habits/new` to create a habit
- `/habits/:id` for details, stats, chart, and calendar
- `/habits/:id/edit` to edit a habit
- `/weekly-summary` for current week progress

## Features

- JWT authentication with localStorage persistence
- Automatic Bearer token injection through Axios interceptors
- Automatic logout and redirect on API `401`
- Responsive dashboard cards
- Create, edit, delete, and check in habits
- Idempotent check-in UI with disabled loading state
- Habit stats, monthly calendar, and Recharts visualization
- Weekly summary with progress bars
- Friendly loading, empty, success, and error states

## Environment

Copy `.env.example` to `.env` for local development if you need to override the default API URL.
