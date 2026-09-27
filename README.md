# Velox Search Frontend

Velox Search is a web interface for creating and searching document datasets. This repository contains the Next.js frontend: users can authenticate, create a project, upload a dataset, configure searchable and semantic fields, monitor indexing, manage API keys, and try search requests from an in-browser playground.

## Why Velox Search

- **Dataset workflow:** Create a project and upload a document dataset from the dashboard.
- **Configurable indexing:** Select an ID field, searchable fields, and semantic-search fields before indexing.
- **Live indexing feedback:** Follow indexing progress and service messages through the dashboard.
- **API key management:** Generate and view keys for a dataset.
- **Search playground:** Run a query with an API key and limit, inspect the response, and generate example requests for JavaScript, TypeScript, Python, cURL, Go, or Ruby.
- **Supabase authentication:** Sign up, sign in with email and password, and use the configured OAuth provider.

## Architecture

The frontend is a Next.js App Router application. Supabase manages browser and server-side authentication sessions. Dataset management and search operations are handled by a separate Velox Search backend, configured through `NEXT_PUBLIC_BACKEND_URL`.

The main application flow is:

1. Register or sign in at `/auth/register` or `/auth/login`.
2. Create a project from `/dashboard/projects`.
3. Upload a dataset and configure its fields.
4. Start indexing and wait for the live progress stream to finish.
5. Open the project to create API keys or use the playground.

## Getting Started

### Prerequisites

- Node.js with npm
- Access to a Supabase project
- A running Velox Search backend, including its HTTP API and indexing WebSocket endpoint

### Install

Clone the repository, enter the frontend directory, and install dependencies:

```bash
git clone <repository-url>
cd frontend
npm install
```

Create `.env.local` in the project root. The file is ignored by Git and must contain the public Supabase settings and backend URL used by the application:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

`NEXT_PUBLIC_BACKEND_URL` defaults to `http://localhost:8000` when it is omitted. Use an `https://` backend in deployed environments; the frontend derives the indexing WebSocket URL from this value.

Configure the authentication providers and redirect URLs in Supabase for the origin where the frontend runs. Email/password authentication is supported, and the login and registration pages also expose the configured OAuth provider.

### Run locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), register an account, and follow the project workflow described above.

### Production build

Validate and run a production build with:

```bash
npm run lint
npm run build
npm start
```

The available npm scripts are defined in [package.json](package.json). The frontend uses Next.js, React, TypeScript, Sass, Supabase SSR helpers, `lucide-react`, `react-toastify`, and `highlight.js`.

## Using the Search API

The playground generates request examples using the selected API key, query, and result limit. A request to the backend search endpoint has this shape:

```bash
curl "http://localhost:8000/search/query?query=distributed%20systems&limit=10" \
	-H "Authorization: Bearer <dataset-api-key>"
```

Keep API keys private. Replace the backend URL and query with values for your deployment and dataset. The backend remains the source of truth for the search response format and API behavior.

## Project Structure

```text
src/app/auth/                 Authentication pages and OAuth callback
src/app/dashboard/projects/   Dataset dashboard
src/app/projects/             Project creation and setup flow
src/app/projects/[projectId]/ Project dashboard, settings, keys, and playground
src/components/               Reusable UI components
src/lib/supabase/              Browser, server, and middleware Supabase clients
src/types/                    Shared TypeScript types
public/                       Static assets
```

## Help and Documentation

Start with the source code and route structure in this repository. In particular:

- [package.json](package.json) lists scripts and dependencies.
- [src/app](src/app) contains the user-facing routes and project workflow.
- [src/components/CodeBlock/snippets.ts](src/components/CodeBlock/snippets.ts) shows the supported generated client examples.
- [src/lib/supabase](src/lib/supabase) contains the authentication session integration.

For backend endpoint behavior, indexing requirements, dataset formats, and response schemas, consult the Velox Search backend documentation or the backend maintainers. When reporting a problem, include the route, command, browser/server logs, and whether it occurs with the frontend alone or only when communicating with the backend.

## Contributing

Contributions are welcome. Before opening a change:

1. Create a focused branch from the current default branch.
2. Make the smallest change that addresses the issue or feature.
3. Run `npm run lint` and `npm run build` locally.
4. Update this README or relevant source documentation when setup or behavior changes.
5. Open a pull request describing the user-visible change, validation performed, and any backend or Supabase configuration required.

There is not currently a separate `CONTRIBUTING.md` or published maintainer directory in this frontend repository. Use the repository issue tracker and pull requests for support, review, and maintainer contact.

## License

No `LICENSE` file is currently included in this repository. Add or reference the project license before distributing the frontend as an open-source package.