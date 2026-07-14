# PetPal

Your pet's health, care, and life in one place.

## Stack

- Frontend: React + TypeScript + Vite + TailwindCSS
- Backend: FastAPI + PostgreSQL + SQLAlchemy + Alembic
- AI: Gemini API
- Storage: Cloudinary

## Getting Started

### Frontend

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`.

### Backend

```bash
python -m venv venv
source venv/bin/activate
pip install -r server/requirements.txt
cp .env.example .env
alembic -c server/alembic.ini upgrade head
uvicorn server.main:app --reload
```

Runs at `http://localhost:8000`. API docs at `/docs`.
