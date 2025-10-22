# Deployment Guide

This guide outlines how to run the Trading Journal in local development and how to prepare it for production using Docker.

## Prerequisites

- Node.js 18+
- npm 9+
- Docker & Docker Compose (for containerised deployments)
- MySQL 8 (managed service or self-hosted)

## Environment Variables

Copy `backend/.env` and adjust it to point to your database and JWT secrets. For production deployments, set the following environment variables securely (e.g. via your cloud provider or orchestration platform):

- `PORT` — HTTP port for the backend service.
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`

Frontend configuration reads `VITE_API_URL` to determine the backend base URL.

## Local Development

1. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. Start the development servers in split terminals:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd ../frontend
   npm run dev
   ```
3. Visit `http://localhost:5173` (default Vite port) and ensure `VITE_API_URL` in `frontend/.env` points to `http://localhost:5000/api`.

## Docker Compose

The repository ships with a `docker-compose.yml` file that orchestrates three services:

- `api` — Node.js backend
- `client` — React frontend served via Vite preview
- `db` — MySQL database with initial seed data

Launch the stack:
```bash
docker-compose up --build
```

The backend listens on `http://localhost:5000`, frontend on `http://localhost:5173`, and MySQL on port `3306`.

## Production Considerations

- Use a managed MySQL instance with automated backups.
- Configure HTTPS termination (e.g. via nginx, AWS ALB, or a CDN).
- Run the backend with a process manager such as PM2 and enable health checks on `/api/health`.
- Set up CI/CD to run `npm test` in the backend and `npm run build` in the frontend before deployments.
- Rotate JWT secrets periodically and store them in a secure vault.

## Database Migrations

Use your preferred migration tool (Knex, Prisma, Flyway) to manage schema changes. Store migration files in `database/migrations/` and run them during deployment before starting the backend service. Seed data is optional and primarily intended for staging/demo environments.
