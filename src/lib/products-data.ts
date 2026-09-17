export interface ProductType {
  _id: string;
  name: string;
  slug: string;
  category: "eyeglasses" | "sunglasses" | "computer-glasses";
  frameShape: "aviator" | "hexagonal" | "clubmaster" | "cat-eye" | "round" | "wayfarer" | "rectangle";
  material: "titanium" | "acetate" | "TR90" | "mixed";
  price: number;
  originalPrice: number;
  images: string[];
  colors: string[];
  features: string[];
  weight: string;
  description: string;
  bestSeller?: boolean;
  inStock?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export const DEFAULT_PRODUCTS: ProductType[] = [
  {
    _id: "prod-1",
    name: "Noir Titanium Aviator",
    slug: "noir-titanium-aviator",
    category: "eyeglasses",
    frameShape: "aviator",
    material: "titanium",
    price: 2499,
    originalPrice: 3999,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Black", "Gunmetal", "Gold"],
    features: ["Blue-Cut 420nm", "Anti-Glare Sapphire", "12g Featherweight"],
    weight: "12g",
    description: "Premium Japanese aerospace titanium aviators forged for durability and unmatched lightness. Firozabad legacy craftsmanship meets surgical precision.",
    bestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 128
  },
  {
    _id: "prod-2",
    name: "Emerald Hexa Flex",
    slug: "emerald-hexa-flex",
    category: "sunglasses",
    frameShape: "hexagonal",
    material: "TR90",
    price: 1899,
    originalPrice: 2499,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Emerald Green", "Matte Black", "Champagne"],
    features: ["UV400 Polarized", "Memory Flex Bridge", "Scratch Shield"],
    weight: "16g",
    description: "Distinctive geometric hexagonal silhouette engineered with Swiss TR90 thermal memory polymer. Bold modern aesthetics for effortless daily luxury.",
    bestSeller: true,
    inStock: true,
    rating: 4.8,
    reviewsCount: 94
  },
  {
    _id: "prod-3",
    name: "Onyx Clubmaster Classic",
    slug: "onyx-clubmaster-classic",
    category: "eyeglasses",
    frameShape: "clubmaster",
    material: "mixed",
    price: 1999,
    originalPrice: 2999,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Tortoise", "Black/Gold", "Silver Mist"],
    features: ["Blue-Cut 420nm", "Diamond Cut Rivets", "Custom Nose Bridge"],
    weight: "22g",
    description: "Vintage-inspired browline clubmaster blending rich hand-buffed acetate with surgical stainless steel accents.",
    bestSeller: false,
    inStock: true,
    rating: 4.7,
    reviewsCount: 65
  },
  {
    _id: "prod-4",
    name: "Crimson Cat-Eye Glam",
    slug: "crimson-cat-eye-glam",
    category: "computer-glasses",
    frameShape: "cat-eye",
    material: "acetate",
    price: 2299,
    originalPrice: 3499,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Crimson Red", "Rose Gold", "Midnight Gloss"],
    features: ["Blue-Cut 420nm", "Anti-Reflective Coating", "Hypoallergenic"],
    weight: "24g",
    description: "Elevate your work look with striking Italian acetate cat-eye curves. Filters 98% of high-energy visible screen radiation.",
    bestSeller: true,
    inStock: true,
    rating: 5.0,
    reviewsCount: 142
  },
  {
    _id: "prod-5",
    name: "Cobalt Round Minimalist",
    slug: "cobalt-round-minimalist",
    category: "eyeglasses",
    frameShape: "round",
    material: "titanium",
    price: 3499,
    originalPrice: 4999,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Cobalt Blue", "Silver Chrome", "Rose Gold"],
    features: ["Anti-Glare Sapphire", "Super Hydrophobic", "Barely-There Fit"],
    weight: "10g",
    description: "Ultra-thin architectural round frame with laser-welded joints. Pure minimalist intellectual sophistication.",
    bestSeller: false,
    inStock: true,
    rating: 4.9,
    reviewsCount: 88
  },
  {
    _id: "prod-6",
    name: "Wayfarer Edge",
    slug: "wayfarer-edge",
    category: "sunglasses",
    frameShape: "wayfarer",
    material: "acetate",
    price: 1599,
    originalPrice: 2199,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Matte Black", "Crystal Clear", "Amber Tortoise"],
    features: ["UV400 Protection", "German 5-Barrel Hinges", "HD Polarized"],
    weight: "28g",
    description: "The timeless wayfarer contour sculpted with sharper beveled edges and thick hand-polished Italian acetate.",
    bestSeller: false,
    inStock: true,
    rating: 4.6,
    reviewsCount: 51
  },
  {
    _id: "prod-7",
    name: "Graphite Rectangle Pro",
    slug: "graphite-rectangle-pro",
    category: "eyeglasses",
    frameShape: "rectangle",
    material: "mixed",
    price: 1299,
    originalPrice: 1999,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Graphite", "Navy", "Brushed Gold"],
    features: ["Anti-Glare", "Blue-Cut 420nm", "Silicone Air Cushions"],
    weight: "20g",
    description: "Clean rectangular lines designed for executive presence and 14-hour workday ergonomic comfort.",
    bestSeller: true,
    inStock: true,
    rating: 4.8,
    reviewsCount: 110
  },
  {
    _id: "prod-8",
    name: "Amber Round Vintage",
    slug: "amber-round-vintage",
    category: "sunglasses",
    frameShape: "round",
    material: "acetate",
    price: 2899,
    originalPrice: 4299,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Amber Tortoise", "Champagne Gold"],
    features: ["UV400 Protection", "Gradient Warm Tint", "Gold Core Wire"],
    weight: "26g",
    description: "Chunky 70s-inspired round acetate sunglasses with visible engraved wire core temples.",
    bestSeller: false,
    inStock: true,
    rating: 4.7,
    reviewsCount: 43
  },
  {
    _id: "prod-9",
    name: "Titan Aviator Pro",
    slug: "titan-aviator-pro",
    category: "computer-glasses",
    frameShape: "aviator",
    material: "titanium",
    price: 4599,
    originalPrice: 5999,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Gold", "Silver", "Gunmetal"],
    features: ["Blue-Cut 420nm", "Anti-Glare Sapphire", "Super Hydrophobic"],
    weight: "14g",
    description: "The apex of optical engineering. Dual-bridge aviator silhouette sculpted from pure titanium for pilot-grade vision.",
    bestSeller: false,
    inStock: true,
    rating: 4.9,
    reviewsCount: 76
  },
  {
    _id: "prod-10",
    name: "Aura Hexa Clear",
    slug: "aura-hexa-clear",
    category: "eyeglasses",
    frameShape: "hexagonal",
    material: "TR90",
    price: 1799,
    originalPrice: 2599,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Clear Ice", "Peach Amber"],
    features: ["Blue-Cut 420nm", "Ultra-Flexible", "15g Ultralight"],
    weight: "15g",
    description: "Translucent crystalline geometric frame that captures ambient light while remaining subtle and featherlight.",
    bestSeller: false,
    inStock: true,
    rating: 4.8,
    reviewsCount: 62
  },
  {
    _id: "prod-11",
    name: "Midnight Cat-Eye Luxe",
    slug: "midnight-cat-eye-luxe",
    category: "sunglasses",
    frameShape: "cat-eye",
    material: "acetate",
    price: 3299,
    originalPrice: 4899,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Deep Onyx", "Burgundy"],
    features: ["UV400 High Contrast", "Micro-Beveled Rims", "Luxury Case"],
    weight: "27g",
    description: "Dramatic haute-couture cat-eye with beveled facets and deep obsidian gradient polarized lenses.",
    bestSeller: true,
    inStock: true,
    rating: 5.0,
    reviewsCount: 189
  },
  {
    _id: "prod-12",
    name: "Zephyr Clubmaster Ultra",
    slug: "zephyr-clubmaster-ultra",
    category: "computer-glasses",
    frameShape: "clubmaster",
    material: "titanium",
    price: 3899,
    originalPrice: 5299,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Matte Black", "Silver Frost"],
    features: ["Blue-Cut 420nm", "Zero-Pressure Temples", "Anti-Fatigue Lens"],
    weight: "13g",
    description: "Next-generation featherweight clubmaster crafted with flexible titanium brow elements for zero cranial pressure.",
    bestSeller: false,
    inStock: true,
    rating: 4.9,
    reviewsCount: 97
  }
];

export function getFallbackProducts(filters?: { category?: string; frameShape?: string; sort?: string }) {
  let list = [...DEFAULT_PRODUCTS];
  if (filters?.category && filters.category !== "All") {
    const cat = filters.category.toLowerCase().replace(/\s+/g, "-");
    list = list.filter((p) => p.category.toLowerCase().replace(/\s+/g, "-") === cat);
  }
  if (filters?.frameShape) {
    list = list.filter((p) => p.frameShape.toLowerCase() === filters.frameShape?.toLowerCase());
  }
  if (filters?.sort === "price-asc" || filters?.sort === "price_asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (filters?.sort === "price-desc" || filters?.sort === "price_desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (filters?.sort === "popular") {
    list.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
  }
  return list;
}

export function getFallbackProductBySlug(slug: string) {
  return DEFAULT_PRODUCTS.find((p) => p.slug === slug) || DEFAULT_PRODUCTS[0];
}
