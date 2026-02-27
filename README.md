# Rent-A-Room — Backend API

Express + PostgreSQL + Prisma backend for the Rent-A-Room room-rental platform.

## Features
- **REST API** — GET / POST / PUT / DELETE `/listings`
- **Multilingual data** — `name`, `location`, `type` returned as `{ en, ru, tj }` objects
- **Swagger UI** — interactive docs at `http://localhost:3000/api-docs`
- **PostgreSQL** — via Prisma ORM (Railway-ready)
- **Docker** — optional containerised deployment

---

## Quick Start (Local)

### 1. Prerequisites
- [Node.js 20+](https://nodejs.org)
- [PostgreSQL](https://www.postgresql.org/) running locally (or use [Railway](https://railway.app) / [Supabase](https://supabase.com) free tier)

### 2. Clone & install

```bash
cd backend
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/rentaroom"
PORT=3000
```

### 4. Set up database

```bash
# Create DB schema
npm run db:migrate

# Seed with 10 initial listings
npm run db:seed
```

### 5. Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server: `http://localhost:3000`  
Swagger: `http://localhost:3000/api-docs`

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/listings` | Get all listings |
| `POST` | `/listings` | Create listing |
| `PUT` | `/listings/:id` | Update listing |
| `DELETE` | `/listings/:id` | Delete listing |

**Full docs with request/response examples → [Swagger UI](http://localhost:3000/api-docs)**

### Example listing shape (response)

```json
{
  "id": 1,
  "name":     { "en": "Modern Apartment", "ru": "Современная квартира", "tj": "Хонаи муосир" },
  "location": { "en": "Dushanbe",         "ru": "Душанбе",              "tj": "Душанбе" },
  "type":     { "en": "apartment",         "ru": "квартира",             "tj": "хона" },
  "rooms": 2,
  "price": 35,
  "about": "Clean modern apartment in the city center.",
  "image": "https://images.unsplash.com/...",
  "createdAt": "2026-02-24T18:00:00.000Z"
}
```

---

## Deployment (Railway)

1. Push `backend/` to a GitHub repo
2. Create a new [Railway](https://railway.app) project
3. Add a **PostgreSQL** plugin — Railway will set `DATABASE_URL` automatically
4. Deploy the repo — Railway reads `railway.json` and uses the `Dockerfile`
5. Set `PORT=3000` in Railway environment variables

Migrations run automatically on every deploy via:
```
npx prisma migrate deploy && node src/server.js
```

---

## Docker (Optional)

```bash
# Build
docker build -t rent-a-room-api .

# Run (set your DATABASE_URL)
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  rent-a-room-api
```

---

## Prisma Commands

```bash
npm run db:migrate        # Create / run new migration (dev)
npm run db:migrate:deploy # Apply migrations (production)
npm run db:seed           # Seed initial 10 listings
npm run db:generate       # Re-generate Prisma client after schema changes
npm run db:studio         # Open Prisma Studio (visual DB browser)
```

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.js           # Seed script (10 initial listings)
├── src/
│   ├── server.js         # Express entry point + Swagger setup
│   ├── routes/
│   │   └── listings.js   # Route definitions + @openapi JSDoc
│   ├── controllers/
│   │   └── listings.js   # Business logic + DB queries
│   └── middleware/
│       └── errorHandler.js
├── Dockerfile
├── railway.json
├── .env.example
└── package.json
```
# Rent-A-Room-backend
