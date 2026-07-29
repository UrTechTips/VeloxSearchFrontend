# Velox Search

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react&logoColor=000)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Session%20Token-ffca28?logo=firebase&logoColor=000)](https://firebase.google.com/)

Velox Search is the Next.js frontend for a document search platform. It gives users a web UI to register or log in with Google, create search projects, upload datasets, configure searchable fields, start indexing, manage API keys, and test queries in a playground.

- Backend repository: https://github.com/UrTechTips/VeloxSearch

## What the project does

Velox Search helps teams move from raw documents to a searchable project in a few steps:

- Authenticate with Google using Firebase.
- Create and manage datasets from the dashboard.
- Upload a dataset, inspect its schema, and choose searchable, semantic, and ID fields.
- Trigger indexing and watch progress over a live WebSocket stream.
- View project stats, API keys, and project settings.
- Test search requests in the playground and copy example code snippets.

The main app flow lives in [src/app/page.tsx](src/app/page.tsx), [src/app/auth/login/page.tsx](src/app/auth/login/page.tsx), [src/app/dashboard/projects/page.tsx](src/app/dashboard/projects/page.tsx), and [src/app/projects](src/app/projects).

## Why the project is useful

This frontend keeps the workflow focused and low-friction for developers and operators:

- One Google sign-in flow for both registration and login.
- Clear project lifecycle screens from dataset creation through indexing.
- A dashboard that surfaces dataset status, length, and activity metrics.
- API key management and a playground for validating search queries before integrating.
- Server-backed sessions so authenticated users can move between routes without reauthenticating on every page.

## Getting started

### Prerequisites

- Node.js 20 or newer.
- npm, yarn, or pnpm.
- The Velox Search backend running locally or at a reachable URL.

### Install

```bash
npm install
```

### Configure the backend URL

The frontend reads the backend base URL from `NEXT_PUBLIC_BACKEND_URL` and falls back to `http://localhost:8000` when it is not set.

Create a `.env.local` file if you want to point the UI at a different backend:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Common user flow

1. Open the homepage and choose Get Started.
2. Register or log in with Google.
3. Create a project from the dashboard.
4. Upload a dataset and review its schema.
5. Select the fields that should be searchable or used for semantic search.
6. Start indexing and wait for the progress stream to finish.
7. Use the API keys and playground screens to test search requests.

### Helpful source files

- Authentication and session handling: [src/app/actions/auth.ts](src/app/actions/auth.ts), [src/lib/auth-utils.ts](src/lib/auth-utils.ts)
- Firebase client setup: [src/config/firebaseConfig.js](src/config/firebaseConfig.js)
- Dataset and project flows: [src/app/projects](src/app/projects)
- Dashboard and list views: [src/components/Dashboard/Dashboard.component.tsx](src/components/Dashboard/Dashboard.component.tsx), [src/components/DatasetList/DatasetList.component.tsx](src/components/DatasetList/DatasetList.component.tsx)
- API keys and playground: [src/app/projects/[projectId]/api-keys/page.tsx](src/app/projects/[projectId]/api-keys/page.tsx), [src/app/projects/[projectId]/playground/page.tsx](src/app/projects/[projectId]/playground/page.tsx)

## Where to get help

If you need the backend API or want to understand the server contract, start with the backend repository:

- Backend repository: https://github.com/UrTechTips/VeloxSearch

For frontend behavior, the best references are the route files and shared components in this repository, especially the pages under [src/app](src/app) and the UI components under [src/components](src/components).

## Who maintains and contributes

Velox Search is maintained by the Sai Sreenadh Chilukuri.

Contributions should follow the existing Next.js, TypeScript, and Sass patterns used in this codebase. There is no separate CONTRIBUTING.md in this checkout yet, so the fastest way to contribute is to open an issue or pull request and mirror the existing component and route structure.

## Project structure

```text
src/app           Next.js routes, layouts, and server actions
src/components    Shared UI components for dashboards, forms, and widgets
src/config        Firebase client configuration
src/lib           Auth helpers and token utilities
src/types         Shared TypeScript types
```
