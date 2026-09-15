import { Request, Response } from 'express';
import Order from '../models/Order';

function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `AW-${date}-${randomSuffix}`;
}

export async function createOrder(req: Request, res: Response) {
  try {
    const { customer, items, paymentMethod } = req.body;
    if (!customer || !customer.name || !customer.phone || !customer.city || !customer.address || !customer.pincode || !items || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required customer or items fields' });
    }

    const orderId = generateOrderId();
    const totalAmount = items.reduce((sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity, 0);

    const order = new Order({
      orderId,
      customer,
      items,
      totalAmount,
      paymentMethod,
      status: 'Pending'
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}
