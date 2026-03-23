# Echo

Next.js web app + lightweight mock API.

## Structure

```
echo/
  frontend/      Next.js app (App Router)
    app/         Routes: /discover /echo /social /explore /profile
    components/  UI components (screens, map, social, bottom tab bar)
    lib/         Theme, mock data, map logic
    public/      Static assets (orb images)
    styles/      globals.css
    package.json
    next.config.ts
  backend/       Standalone mock API (Node, no deps)
    server.js    HTTP server on port 4000
    mock-data.js Mock data served by the API
    package.json
  package.json   Workspace root (delegates to frontend/ and backend/)
```

## Install

Run once from the repo root:

```bash
npm install
```

All packages are installed to the root `node_modules/` via npm workspaces.

## Run frontend locally

```bash
# From repo root:
npm run dev

# Or directly from frontend/:
cd frontend
npm run dev
```

Then open: http://localhost:3000

> **Mapbox token required for the map tab.**
> Copy `frontend/.env.example` to `frontend/.env` and fill in your token:
> ```
> NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
> ```
> All other tabs (Echo, Social, Explore, Profile) work without a token.

## Run backend locally

The backend is a standalone mock REST API. It is **not required** to run the frontend — the frontend uses its own inline mock data. Start it only if you want to develop against the API endpoints.

```bash
# From repo root:
npm run backend:dev

# Or directly from backend/:
cd backend
node --watch server.js
```

API available at: http://localhost:4000

Endpoints:
- `GET /api/health`
- `GET /api/cities`
- `GET /api/echoes?city=<id>`
- `GET /api/cities/<id>/echoes`
- `GET /api/echoes/popular`
- `GET /api/gallery`

## Run both together

Open two terminals:

```bash
# Terminal 1 — frontend
npm run dev

# Terminal 2 — backend
npm run backend:dev
```

## Other commands

```bash
npm run build       # Production build
npm run start       # Serve production build
npm run typecheck   # TypeScript check
```

## Local vs Vercel

You can fully test the app locally before deploying. `npm run dev` gives you a hot-reloading dev server at localhost:3000 with all tabs working. No Vercel dependency for local development.
