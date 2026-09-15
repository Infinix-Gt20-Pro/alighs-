import { Request, Response } from 'express';
import Product from '../models/Product';

export async function getProducts(req: Request, res: Response) {
  try {
    const { category, frameShape, sort } = req.query;
    const query: Record<string, string> = {};
    if (category && category !== 'All') query.category = String(category).toLowerCase();
    if (frameShape) query.frameShape = String(frameShape);

    const sortOption: Record<string, 1 | -1> = {};
    if (sort === 'price-asc') sortOption.price = 1;
    else if (sort === 'price-desc') sortOption.price = -1;
    else if (sort === 'popular') sortOption.bestSeller = -1;
    else sortOption.createdAt = -1;

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}

export async function getProductBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}
