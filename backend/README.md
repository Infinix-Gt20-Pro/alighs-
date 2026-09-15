# ALIGH'S WARE — Standalone Backend API

Production-ready REST API for ALIGH'S WARE luxury eyewear platform and Dr. Sheeraz Ahmad consultation booking.

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```
Runs at `http://localhost:5000`.

3. Seed initial database:
```bash
curl -X POST http://localhost:5000/api/seed
```

## 📡 Endpoints:
- `GET /api/products` (Filters: category, frameShape, sort)
- `GET /api/products/:slug` (Get single frame)
- `POST /api/orders` (Create new order)
- `POST /api/appointments` (Book doctor appointment)
- `POST /api/seed` (Seed products)
- `GET /api/health` (Health check)
