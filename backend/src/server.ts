import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import seedRoutes from './routes/seedRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Database connection
connectDB();

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/seed', seedRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: "ALIGH'S WARE Backend API", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 ALIGH'S WARE Backend running at http://localhost:${PORT}`);
});
