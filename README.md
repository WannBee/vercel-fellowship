# Manajemen Pelatihan
## Backend
cd backend && npm install && cp .env.example .env   (isi DATABASE_URL, JWT_SECRET, CLIENT_URL=http://localhost:5173)
createdb pelatihan && npm run db:init && npm run dev   -> http://localhost:4000
## Frontend (Tailwind + lucide-react, terhubung ke API)
cd frontend && npm install && cp .env.example .env && npm run dev   -> http://localhost:5173
User pertama yang register otomatis menjadi admin.
