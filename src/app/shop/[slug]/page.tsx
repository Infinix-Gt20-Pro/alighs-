import { PRODUCTS } from "@/lib/products-data";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
