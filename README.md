# ALIGH'S WARE — Luxury 3D Eyewear & Clinic Platform 👓

Official web application and clinic appointment portal for **Dr. Sheeraz Ahmad (AMU-Certified Optometrist & Eye Care Specialist)**, Firozabad, Uttar Pradesh.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FInfinix-Gt20-Pro%2FAligh-s---Ware)

---

## 🌟 Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Cinematic Luxury Dark Glassmorphic Design (`#0a0a0a`)
- **3D Graphics**: Three.js + React Three Fiber + Custom GLSL Procedural Shaders
- **Animations**: Framer Motion 12 + Lucide React Icons
- **Database**: MongoDB + Mongoose (Products, Orders, Appointments)
- **Deployment**: Zero-Config Vercel Deployment

---

## 📁 Project Architecture

This repository is optimized for **Instant 1-Click Vercel Deployment** while also providing standalone separated folders:

```
Aligh-s---Ware/
├── src/                     # Core Next.js App Router (Deploys directly on Vercel)
│   ├── app/                 # Routes: /, /shop, /cart, /checkout, /appointment
│   │   └── api/             # Serverless API: /api/products, /api/orders, /api/appointments, /api/seed
│   ├── components/          # 3D Canvas, GlassCard, Navbar, Footer, DoctorSection, etc.
│   ├── context/             # Cart State & LocalStorage persistence
│   └── shaders/             # Custom GLSL Shaders
├── public/                  # Static assets & 3D GLTF/GLB models
├── package.json             # Root Next.js configuration (Auto-detected by Vercel)
├── vercel.json              # Vercel deployment presets
│
├── backend/                 # Standalone Express + TypeScript + Mongoose Server
│   ├── src/                 # Controllers, Models, Routes, db.ts, server.ts (Port 5000)
│   └── package.json
│
└── frontend/                # Standalone Frontend Export
    └── package.json
```

---

## 🚀 Deployment on Vercel (Automatic)

1. Connect your GitHub repository `Infinix-Gt20-Pro/Aligh-s---Ware` on [Vercel](https://vercel.com).
2. Leave **Root Directory** as `./` (default).
3. Vercel will automatically detect **Next.js** framework preset.
4. (Optional) Add Environment Variable:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (or leave empty for fallback).
5. Click **Deploy**! Your site is live!

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

© 2026 ALIGH'S WARE — Firozabad, Uttar Pradesh.
