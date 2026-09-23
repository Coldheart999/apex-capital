# Apex Capital - Investment Platform
# A full-stack investment platform with deposits, packages, referrals, and withdrawals

## Project Structure

```
apex-capital/
├── frontend/          # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── pages/     # All page components
│   │   ├── layouts/   # Dashboard layout
│   │   ├── contexts/  # Auth & App contexts
│   │   ├── lib/       # API client & types
│   │   └── components/  # Shared components
│   └── package.json
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── models/    # SQLAlchemy models
│   │   ├── schemas/   # Pydantic schemas
│   │   ├── api/       # API routes
│   │   ├── core/      # Security, config, deps
│   │   └── middleware/ # Database
│   └── seed.py        # Seed data
└── vercel.json       # Vercel deployment config
```

## Default Credentials
- Admin: admin@apexcapital.com / Admin123!

## Development
- Frontend: `cd frontend && npm run dev` (port 3000)
- Backend: `cd backend && uvicorn main:app --reload` (port 8000)

## Deployment
- Deploy to Vercel: `vercel --prod`