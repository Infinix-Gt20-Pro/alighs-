"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ShoppingBag, MessageCircle, Truck, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

type ProductDetails = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  frameShape: string;
  material: string;
  weight: string;
  width: string;
  features: string[];
  colors: { name: string; hex: string }[];
  image: string;
  gallery: string[];
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.slug) return;
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          if (data.colors?.length > 0) {
            setSelectedColor(data.colors[0].name);
          }
          setActiveImage(data.image);
        }
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button onClick={() => router.push("/shop")} className="text-cyan-400 hover:underline">
          Return to Shop
        </button>
      </div>
    );
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWhatsAppBuy = () => {
    const message = encodeURIComponent(`Hi, I'm interested in buying the ${product.name} frame (Color: ${selectedColor}). Is it available?`);
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  const handleAddToCart = () => {
    const selectedColorObj = product.colors?.find((c) => c.name === selectedColor) || product.colors?.[0];
    addToCart(
      {
        productId: product._id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        color: selectedColorObj?.name || selectedColor,
        colorHex: selectedColorObj?.hex || "#a1a1aa",
        weight: product.weight || "",
      },
      quantity
    );
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[150px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <button 
          onClick={() => router.push("/shop")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-sm">Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Product Images */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass-card aspect-square rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-8 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
              <img 
                src={activeImage || "/placeholder-frame.png"} 
                alt={product.name} 
                className="w-full h-auto object-contain drop-shadow-2xl z-20 hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {product.gallery && product.gallery.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {[product.image, ...product.gallery].map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-24 rounded-xl border flex-shrink-0 flex items-center justify-center bg-white/5 transition-all ${
                      activeImage === img ? "border-cyan-400 bg-white/10" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img src={img || "/placeholder-frame.png"} alt="" className="w-3/4 h-auto object-contain" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono border border-white/20 bg-white/5 text-gray-300 uppercase tracking-wider">
                {product.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono border border-white/20 bg-white/5 text-gray-300 uppercase tracking-wider">
                {product.material}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-sans text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-semibold text-white">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded border border-cyan-500/30">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              {product.description || "Premium handcrafted eyewear designed for everyday comfort and cinematic style. Firozabad's finest optics meet modern design."}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-mono text-gray-400 mb-3">SELECT COLOR: {selectedColor}</h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        selectedColor === color.name ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0a0a0a]" : "hover:scale-110"
                      }`}
                    >
                      <span className="w-8 h-8 rounded-full shadow-inner border border-white/10" style={{ backgroundColor: color.hex }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-10">
              <h3 className="text-sm font-mono text-gray-400 mb-3">QUANTITY</h3>
              <div className="flex items-center w-32 glass-pill border border-white/10 bg-white/5 rounded-full overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex-1 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >-</button>
                <span className="font-mono">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex-1 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleAddToCart}
                className="flex-1 glass-button bg-white text-black hover:bg-gray-200 py-4 px-8 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleWhatsAppBuy}
                className="flex-1 glass-button bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366]/20 py-4 px-8 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Buy on WhatsApp
              </button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-4 mb-12 py-6 border-y border-white/10">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Truck className="w-5 h-5 text-cyan-400" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>1 Year Warranty</span>
              </div>
            </div>

            {/* Features & Specs */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Premium Features</h3>
                <ul className="space-y-3">
                  {product.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-400">
                      <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {!product.features?.length && (
                    <>
                      <li className="flex items-start gap-3 text-gray-400"><CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" /><span>Anti-reflective coating</span></li>
                      <li className="flex items-start gap-3 text-gray-400"><CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" /><span>Scratch-resistant lenses</span></li>
                      <li className="flex items-start gap-3 text-gray-400"><CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" /><span>Lightweight comfort fit</span></li>
                    </>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Specifications</h3>
                <div className="glass-panel border border-white/10 bg-white/5 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      <tr className="border-b border-white/5">
                        <th className="py-3 px-4 font-mono text-gray-500 font-normal">Shape</th>
                        <td className="py-3 px-4 text-gray-300">{product.frameShape}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <th className="py-3 px-4 font-mono text-gray-500 font-normal">Material</th>
                        <td className="py-3 px-4 text-gray-300">{product.material}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <th className="py-3 px-4 font-mono text-gray-500 font-normal">Weight</th>
                        <td className="py-3 px-4 text-gray-300">{product.weight}</td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 font-mono text-gray-500 font-normal">Frame Width</th>
                        <td className="py-3 px-4 text-gray-300">{product.width}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </main>
  );
}
