# GDPS Core

This repository contains a minimal TypeScript backend (Express + Prisma) and a TypeScript React frontend (Vite), plus Docker and Compose configurations to run them together locally.

Quick start
1. Install Docker Desktop and ensure it's running.
2. From the repository root run:

```powershell
docker compose up --build
```

Services:
- Backend: http://localhost:3000 (API under /api)
- Frontend: http://localhost (served via nginx proxy)
- Postgres: localhost:5432
- Adminer: http://localhost:3002
- Prisma Studio (if enabled): http://localhost:5555

Development notes
- Backend code: `backend/src`
- Frontend code: `frontend/src`
- Shared runtime config: `frontend/public/config.json` and `backend/config/config.json`

CI
GitHub Actions workflow is defined in `.github/workflows/ci.yml` and runs build & tests for both services.

Contributing
See `CONTRIBUTING.md` for the contribution process and guidelines.
