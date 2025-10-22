# Trading Journal

A full-stack web application for recording trades, documenting strategies and tracking performance metrics. The project is split into an Express/MySQL backend and a React/Tailwind frontend, with Docker tooling for local or production deployments.

## Project Structure

```
trading-journal/
├── backend/                # Node.js Express API
├── frontend/               # React + Vite client
├── database/               # SQL schema, seeds and migrations
├── docs/                   # Technical documentation
├── scripts/                # Helper scripts for dev/ops tasks
├── docker-compose.yml      # Container orchestration
└── README.md               # This document
```

Refer to the [docs](./docs/README.md) directory for in-depth API, database and deployment notes.

## Getting Started

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

Create `backend/.env` (a template is included) and set database credentials plus JWT secrets. Optional: create `frontend/.env` with `VITE_API_URL=http://localhost:5000/api`.

### 3. Run the app locally

```bash
# Backend API
cd backend
npm run dev

# Frontend in a separate shell
cd ../frontend
npm run dev
```

The React app is available at `http://localhost:5173` and proxies API calls to `http://localhost:5000/api`.

### 4. Run automated tests (backend)

```bash
cd backend
npm test
```

## Docker Compose

Spin up the entire stack with one command:

```bash
docker-compose up --build
```

This starts MySQL, the Express API and the Vite preview server. Database schema and seed data are loaded automatically.

## Scripts

- `scripts/start-dev.sh` — install dependencies if needed and start frontend/backend together.
- `scripts/deploy.sh` — build artefacts and launch the Docker Compose stack.
- `scripts/backup-db.sh` — create a MySQL dump using environment variables.

## License

This project is provided as a reference implementation and does not include a specific license. Adapt it to your needs.
