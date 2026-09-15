# ALIGH'S WARE — Luxury Eyewear E-Commerce & Clinic Platform

A modern luxury 3D eyewear e-commerce platform and doctor appointment booking system for **Dr. Sheeraz Ahmad (AMU-Certified Optometrist)**, based in Firozabad, Uttar Pradesh.

---

## 📁 Repository Structure

`
Aligh-s---Ware/
├── frontend/                # Next.js 16 + React 19 + Tailwind v4 + Three.js 3D Showcase
│   ├── src/app/             # App Router pages (Home, Shop, Cart, Checkout, Appointment)
│   ├── src/components/      # Interactive 3D Canvas, Navbar, Doctor Section, etc.
│   ├── src/context/         # Cart State Management
│   ├── src/shaders/         # GLSL Shaders for 3D Eyewear materials
│   └── package.json
│
└── backend/                 # Standalone Express + TypeScript + Mongoose API Server
    ├── src/controllers/     # Products, Orders, Appointments controllers
    ├── src/models/          # MongoDB Mongoose schemas
    ├── src/routes/          # REST API endpoints
    ├── src/db.ts            # MongoDB connection
    ├── src/server.ts        # Express entry point (Port 5000)
    └── package.json
`

---

## 🚀 Quick Start Guide

### 1. Frontend Setup (Next.js)
`ash
cd frontend
npm install
npm run dev
`
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend Setup (Express + MongoDB)
`ash
cd backend
npm install
npm run dev
`
Backend runs on [http://localhost:5000](http://localhost:5000).

---

## 🌟 Key Features
- **Cinematic 3D Eyewear Viewer**: Interactive Three.js canvas with custom procedural GLSL shaders.
- **Complete E-Commerce Flow**: Product browsing, dynamic filtering, interactive shopping cart, multi-step checkout.
- **Dr. Sheeraz Ahmad Appointment System**: Seamless consultation booking with direct WhatsApp integration.
- **Robust REST API**: Full MongoDB integration with seed data, order processing, and appointment management.

---

© 2026 ALIGH'S WARE — Firozabad, Uttar Pradesh.
