"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { Filter, ChevronDown } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  frameShape: string;
  colors: string[];
  image: string;
  isNew?: boolean;
};

const CATEGORIES = ["All", "Eyeglasses", "Sunglasses", "Computer Glasses"];
const SORT_OPTIONS = [
  { label: "Popular", value: "popular" },
  { label: "Price Low→High", value: "price_asc" },
  { label: "Price High→Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("popular");
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Construct query params based on filters
        const url = new URL("/api/products", window.location.origin);
        if (activeCategory !== "All") {
          url.searchParams.append("category", activeCategory);
        }
        url.searchParams.append("sort", sortOption);
        
        const res = await fetch(url.toString());
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || data);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, sortOption]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[150px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="glass-pill px-4 py-1.5 mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono tracking-wider text-cyan-200">CURATED FRAMES</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 font-sans">
            Premium Eyewear Collection
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Discover our hand-picked selection of premium frames. Crafted for comfort, designed for style. Firozabad&apos;s finest optical quality.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm transition-all duration-300 font-medium ${
                  activeCategory === cat
                    ? "bg-white text-black"
                    : "glass-pill border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="glass-pill flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 hover:bg-white/10 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Sort: {SORT_OPTIONS.find(o => o.value === sortOption)?.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#111]/90 backdrop-blur-xl z-50 overflow-hidden shadow-2xl"
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortOption(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/10 ${
                        sortOption === option.value ? "text-cyan-400 bg-white/5" : "text-gray-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card rounded-2xl h-[400px] border border-white/5 bg-white/[0.02] animate-pulse">
                <div className="h-2/3 bg-white/5 rounded-t-2xl" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                  <div className="h-8 bg-white/10 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Filter className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No frames found</h3>
            <p className="text-gray-400 max-w-md">
              We couldn&apos;t find any eyewear matching your current filters. Try selecting a different category or clearing your filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSortOption("popular");
              }}
              className="mt-8 px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
