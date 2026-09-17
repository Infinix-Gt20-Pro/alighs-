// src/lib/products-data.ts

export interface ProductType {
  _id: string;
  name: string;
  slug: string;
  category: "eyeglasses" | "sunglasses" | "computer-glasses" | "reading-glasses" | "clip-on";
  frameType: "full-rim" | "half-rim" | "rimless";
  frameShape: "rectangle" | "round" | "aviator" | "wayfarer" | "cat-eye" | "clubmaster" | "hexagonal" | "oval";
  brandCollection: string;
  gender: "unisex" | "men" | "women" | "kids";
  material: "titanium" | "acetate" | "TR90" | "mixed" | "stainless-steel";
  price: number;
  originalPrice: number;
  images: string[];
  colors: string[];
  features: string[];
  weight: string;
  caliber?: string;
  description: string;
  bestSeller?: boolean;
  inStock?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export const DEFAULT_PRODUCTS: ProductType[] = [
  // ==================== 1. EYEGLASSES (LENSKART BESTSELLERS) ====================
  {
    _id: "lk-1",
    name: "Vincent Chase Sleek Steel Rectangle",
    slug: "vincent-chase-sleek-steel-rectangle",
    category: "eyeglasses",
    frameType: "half-rim",
    frameShape: "rectangle",
    brandCollection: "Vincent Chase",
    gender: "men",
    material: "stainless-steel",
    price: 1299,
    originalPrice: 2499,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Gunmetal", "Matte Black", "Silver"],
    features: ["Blue-Cut 420nm Ready", "German Spring Hinges", "Adjustable Silicone Pads"],
    weight: "14g",
    caliber: "53-18-142",
    description: "Lenskart classic executive half-rim rectangle spectacles engineered with corrosion-free stainless steel and German flex hinges for 12+ hours of everyday office comfort.",
    bestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 342
  },
  {
    _id: "lk-2",
    name: "John Jacobs Rich Italian Acetate Wayfarer",
    slug: "john-jacobs-rich-italian-acetate-wayfarer",
    category: "eyeglasses",
    frameType: "full-rim",
    frameShape: "wayfarer",
    brandCollection: "John Jacobs",
    gender: "unisex",
    material: "acetate",
    price: 2499,
    originalPrice: 4999,
    images: ["/images/model-dark.jpg"],
    colors: ["Amber Tortoise", "Midnight Black", "Crystal Clear"],
    features: ["Hand-Buffed Cellulose Acetate", "5-Barrel Steel Hinges", "Anti-Glare Sapphire"],
    weight: "20g",
    caliber: "51-19-145",
    description: "Handcrafted Italian Mazzucchelli acetate with deep amber tortoise mottling and embedded core wire. Timeless retro luxury for sophisticated everyday wear.",
    bestSeller: true,
    inStock: true,
    rating: 5.0,
    reviewsCount: 512
  },
  {
    _id: "lk-3",
    name: "Lenskart Air Featherweight Titanium Round",
    slug: "lenskart-air-featherweight-titanium-round",
    category: "eyeglasses",
    frameType: "full-rim",
    frameShape: "round",
    brandCollection: "Lenskart Air",
    gender: "unisex",
    material: "titanium",
    price: 1999,
    originalPrice: 3499,
    images: ["/images/model-gold.jpg"],
    colors: ["24K Champagne Gold", "Rose Gold", "Gunmetal"],
    features: ["100% Japanese Beta-Titanium", "10g Ultralight", "Pressure-Free Temples"],
    weight: "10g",
    caliber: "49-20-140",
    description: "Super-minimalist vintage circular wireframe inspired by timeless academic fashion. Forged from Japanese Beta-Titanium for zero weight feeling on nose and ears.",
    bestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 420
  },
  {
    _id: "lk-4",
    name: "Alig's AMU Clinic Rimless Executive Titanium",
    slug: "aligs-amu-clinic-rimless-executive-titanium",
    category: "eyeglasses",
    frameType: "rimless",
    frameShape: "rectangle",
    brandCollection: "Alig's Clinic Grade",
    gender: "men",
    material: "titanium",
    price: 2999,
    originalPrice: 5499,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Silver Frost", "Gold", "Obsidian Black"],
    features: ["Frameless Clean Horizon", "Drill-Mounted Sapphire", "8g Barely-There"],
    weight: "8g",
    caliber: "52-18-140",
    description: "Medical-grade precision rimless spectacles calibrated under the personal oversight of Dr. Sheeraz Ahmad (AMU). Unobstructed panoramic field of view.",
    bestSeller: false,
    inStock: true,
    rating: 4.8,
    reviewsCount: 180
  },
  {
    _id: "lk-5",
    name: "Vincent Chase Vintage Browline Clubmaster",
    slug: "vincent-chase-vintage-browline-clubmaster",
    category: "eyeglasses",
    frameType: "half-rim",
    frameShape: "clubmaster",
    brandCollection: "Vincent Chase",
    gender: "unisex",
    material: "mixed",
    price: 1599,
    originalPrice: 2999,
    images: ["/images/luxury-craft.jpg"],
    colors: ["Black/Gold", "Tortoise/Bronze", "Silver Mist"],
    features: ["Accentuate Brow Silhouette", "Double Rivet Pins", "High Index Compatible"],
    weight: "18g",
    caliber: "51-20-145",
    description: "Iconic 1950s browline revival combining deep black hand-polished acetate upper brow with precision gold-toned wire rim lower eyewires.",
    bestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 298
  },
  {
    _id: "lk-6",
    name: "John Jacobs Haute Cat-Eye Luxe",
    slug: "john-jacobs-haute-cat-eye-luxe",
    category: "eyeglasses",
    frameType: "full-rim",
    frameShape: "cat-eye",
    brandCollection: "John Jacobs",
    gender: "women",
    material: "acetate",
    price: 2299,
    originalPrice: 4299,
    images: ["/images/model-gold.jpg"],
    colors: ["Crimson Wine", "Black Diamond", "Rose Crystal"],
    features: ["Sculpted Wingtips", "Blue-Cut 420nm", "Hypoallergenic Italian Acetate"],
    weight: "17g",
    caliber: "52-17-142",
    description: "Sculptural upswept cat-eye contour designed to naturally lift cheekbones and facial contours. Fitted with anti-reflective high definition clear optics.",
    bestSeller: false,
    inStock: true,
    rating: 5.0,
    reviewsCount: 175
  },
  {
    _id: "lk-7",
    name: "Lenskart Studio Octagon Geometric Wire",
    slug: "lenskart-studio-octagon-geometric-wire",
    category: "eyeglasses",
    frameType: "full-rim",
    frameShape: "hexagonal",
    brandCollection: "Lenskart Studio",
    gender: "unisex",
    material: "titanium",
    price: 1899,
    originalPrice: 3299,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Matte Gold", "Brushed Silver", "Rose Bronze"],
    features: ["Polygonal Architecture", "Micro-Ribbed Temples", "Featherweight 12g"],
    weight: "12g",
    caliber: "50-19-142",
    description: "Avant-garde geometric hexagonal eyewear with multi-angle beveling that catches light dynamically while staying discreet and sophisticated.",
    bestSeller: false,
    inStock: true,
    rating: 4.7,
    reviewsCount: 114
  },
  {
    _id: "lk-8",
    name: "Vincent Chase Classic Square TR90 Flex",
    slug: "vincent-chase-classic-square-tr90-flex",
    category: "eyeglasses",
    frameType: "full-rim",
    frameShape: "rectangle",
    brandCollection: "Vincent Chase",
    gender: "unisex",
    material: "TR90",
    price: 999,
    originalPrice: 1999,
    images: ["/images/model-dark.jpg"],
    colors: ["Matte Navy", "Solid Black", "Frosted Grey"],
    features: ["Swiss Memory Polymer", "Unbreakable Bendability", "Sweat Resistant"],
    weight: "13g",
    caliber: "54-17-145",
    description: "Everyday rugged workhorse eyewear crafted from Swiss TR90 thermoplastic polymer. Flexes effortlessly without cracking or losing its optical alignment.",
    bestSeller: true,
    inStock: true,
    rating: 4.8,
    reviewsCount: 680
  },

  // ==================== 2. COMPUTER GLASSES (LENSKART BLU / ZERO POWER) ====================
  {
    _id: "lk-9",
    name: "Lenskart BLU Screen Shield Rectangle",
    slug: "lenskart-blu-screen-shield-rectangle",
    category: "computer-glasses",
    frameType: "full-rim",
    frameShape: "rectangle",
    brandCollection: "Lenskart BLU",
    gender: "unisex",
    material: "TR90",
    price: 1199,
    originalPrice: 1999,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Midnight Black", "Clear Ice", "Deep Blue"],
    features: ["Zero Power 420nm BLU", "Anti-Reflective Hydrophobic", "Blocks 98% Screen Glare"],
    weight: "12g",
    caliber: "52-17-142",
    description: "Designed specifically for coding, gaming, and remote work. Zero-power lenses with advanced 420nm blue-light filtration to eliminate eye strain and insomnia.",
    bestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 890
  },
  {
    _id: "lk-10",
    name: "Vincent Chase BLU Minimalist Round",
    slug: "vincent-chase-blu-minimalist-round",
    category: "computer-glasses",
    frameType: "full-rim",
    frameShape: "round",
    brandCollection: "Lenskart BLU",
    gender: "unisex",
    material: "mixed",
    price: 1499,
    originalPrice: 2499,
    images: ["/images/model-gold.jpg"],
    colors: ["Rose Gold/Pink", "Black/Gold", "Silver Mist"],
    features: ["Zero Power Blue-Cut", "Sapphire Anti-Glare", "Soft Silicone Nose Pads"],
    weight: "14g",
    caliber: "49-20-142",
    description: "Trendy circular wireframe computer glasses with blue-cut coating that blocks high-energy visible rays from MacBooks, monitors, and smartphone screens.",
    bestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 310
  },
  {
    _id: "lk-11",
    name: "John Jacobs BLU Bold Acetate Wayfarer",
    slug: "john-jacobs-blu-bold-acetate-wayfarer",
    category: "computer-glasses",
    frameType: "full-rim",
    frameShape: "wayfarer",
    brandCollection: "John Jacobs",
    gender: "unisex",
    material: "acetate",
    price: 2199,
    originalPrice: 3999,
    images: ["/images/model-dark.jpg"],
    colors: ["Havana Tortoise", "Piano Black", "Smoky Olive"],
    features: ["Premium Italian Acetate", "Medical Grade Blue-Cut", "Scratch Defense 9H"],
    weight: "19g",
    caliber: "52-18-145",
    description: "Executive-grade Italian acetate computer spectacles. Gives you sharp corporate style on Zoom calls while actively protecting against digital eye fatigue.",
    bestSeller: false,
    inStock: true,
    rating: 4.8,
    reviewsCount: 165
  },
  {
    _id: "lk-12",
    name: "Lenskart Air BLU Hexagonal Titanium",
    slug: "lenskart-air-blu-hexagonal-titanium",
    category: "computer-glasses",
    frameType: "full-rim",
    frameShape: "hexagonal",
    brandCollection: "Lenskart Air",
    gender: "unisex",
    material: "titanium",
    price: 1799,
    originalPrice: 2999,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Champagne Gold", "Graphite", "Silver"],
    features: ["Geometric Polygon Wire", "11g Ultralight", "Anti-Fatigue Optical Curve"],
    weight: "11g",
    caliber: "51-19-142",
    description: "Modern architectural polygon computer glasses made from aerospace titanium. Weightless comfort with medical-grade 420nm blue shield.",
    bestSeller: false,
    inStock: true,
    rating: 4.9,
    reviewsCount: 142
  },

  // ==================== 3. SUNGLASSES (POLARIZED & UV400) ====================
  {
    _id: "lk-13",
    name: "Vincent Chase Polarized Aviator Classic",
    slug: "vincent-chase-polarized-aviator-classic",
    category: "sunglasses",
    frameType: "full-rim",
    frameShape: "aviator",
    brandCollection: "Vincent Chase",
    gender: "men",
    material: "stainless-steel",
    price: 1699,
    originalPrice: 3299,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Gunmetal/Green", "Gold/G-15", "Black/Grey Polarized"],
    features: ["100% UV400 Polarized", "Military Teardrop Spec", "Anti-Reflective Back-Coating"],
    weight: "18g",
    caliber: "58-14-140",
    description: "The ultimate pilot sunglasses with TAC polarized lenses that eliminate road and water glare with rich optical clarity. Full UV400 solar protection.",
    bestSeller: true,
    inStock: true,
    rating: 5.0,
    reviewsCount: 920
  },
  {
    _id: "lk-14",
    name: "John Jacobs Retro Wayfarer Sun Gradient",
    slug: "john-jacobs-retro-wayfarer-sun-gradient",
    category: "sunglasses",
    frameType: "full-rim",
    frameShape: "wayfarer",
    brandCollection: "John Jacobs",
    gender: "unisex",
    material: "acetate",
    price: 2799,
    originalPrice: 4999,
    images: ["/images/model-dark.jpg"],
    colors: ["Glossy Black", "Tokyo Tortoise", "Amber Gradient"],
    features: ["Handcrafted Heavy Acetate", "Gradient Polarized Lenses", "7-Barrel Steel Hinges"],
    weight: "24g",
    caliber: "54-18-145",
    description: "Bold Hollywood-grade thick acetate wayfarer sunglasses with soothing amber-to-grey gradient polarized tint. Uncompromising luxury aesthetics.",
    bestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 410
  },
  {
    _id: "lk-15",
    name: "Vincent Chase Dramatic Cat-Eye Sun (Women)",
    slug: "vincent-chase-dramatic-cat-eye-sun",
    category: "sunglasses",
    frameType: "full-rim",
    frameShape: "cat-eye",
    brandCollection: "Vincent Chase",
    gender: "women",
    material: "acetate",
    price: 1899,
    originalPrice: 3199,
    images: ["/images/model-gold.jpg"],
    colors: ["Onyx Black", "Burgundy Gradient", "Tortoise Sun"],
    features: ["Wingtip Drama", "Polarized UV Protection", "Gold Star Rivet Pins"],
    weight: "19g",
    caliber: "53-17-142",
    description: "Runway-ready polarized cat-eye shades for women. Blocks 100% of UVA/UVB rays with high-contrast polarized clarity for driving and travel.",
    bestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 260
  },
  {
    _id: "lk-16",
    name: "Lenskart Studio Steampunk Round Mirrored",
    slug: "lenskart-studio-steampunk-round-mirrored",
    category: "sunglasses",
    frameType: "full-rim",
    frameShape: "round",
    brandCollection: "Lenskart Studio",
    gender: "unisex",
    material: "mixed",
    price: 1999,
    originalPrice: 3499,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Silver Mirror", "Gold Flash", "Deep Blue Mirror"],
    features: ["Mesh Side Shields", "Flash Mirror Coating", "Impact-Resistant TAC"],
    weight: "21g",
    caliber: "48-22-140",
    description: "Vintage steampunk circular sunglasses featuring perforated metal side shields and vibrant reflective flash mirror polarized lenses.",
    bestSeller: false,
    inStock: true,
    rating: 4.8,
    reviewsCount: 145
  },

  // ==================== 4. READING GLASSES (PREBYOPIA / READY READERS) ====================
  {
    _id: "lk-17",
    name: "Alig's EasyReader Titanium Foldable (+1.50 to +2.50)",
    slug: "aligs-easyreader-titanium-foldable",
    category: "reading-glasses",
    frameType: "rimless",
    frameShape: "rectangle",
    brandCollection: "Alig's Clinic Grade",
    gender: "unisex",
    material: "titanium",
    price: 899,
    originalPrice: 1599,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Gunmetal Silver", "Gold", "Black"],
    features: ["Foldable Telescopic Arms", "Pocket Hard Case Included", "Precision Aspheric Lenses"],
    weight: "8g",
    caliber: "48-18-135",
    description: "Pocket-sized foldable reading glasses with telescopic titanium temples. Fits inside an ultra-slim aluminum capsule case for reading books, menus, and phone texts.",
    bestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 380
  },
  {
    _id: "lk-18",
    name: "Vincent Chase Classic Round Readers (+1.00 to +3.00)",
    slug: "vincent-chase-classic-round-readers",
    category: "reading-glasses",
    frameType: "full-rim",
    frameShape: "round",
    brandCollection: "Vincent Chase",
    gender: "unisex",
    material: "TR90",
    price: 999,
    originalPrice: 1799,
    images: ["/images/model-dark.jpg"],
    colors: ["Matte Tortoise", "Clear Crystal", "Deep Black"],
    features: ["Blue-Cut + Reading Power", "Scratch Shield", "Hypoallergenic Comfort"],
    weight: "11g",
    caliber: "47-19-140",
    description: "Sophisticated circular reading glasses with built-in 420nm blue-blocker. Perfect for reading Kindle, tablets, and fine print comfortably.",
    bestSeller: false,
    inStock: true,
    rating: 4.8,
    reviewsCount: 210
  },

  // ==================== 5. MAGNETIC CLIP-ON GLASSES (2-IN-1) ====================
  {
    _id: "lk-19",
    name: "Lenskart Switch Magnetic Polarized Clip-On 2-in-1",
    slug: "lenskart-switch-magnetic-polarized-clip-on",
    category: "clip-on",
    frameType: "full-rim",
    frameShape: "rectangle",
    brandCollection: "Lenskart Studio",
    gender: "unisex",
    material: "TR90",
    price: 2199,
    originalPrice: 3999,
    images: ["/images/clarity-showcase.jpg"],
    colors: ["Matte Black (Grey Clip)", "Tortoise (Brown Clip)"],
    features: ["Dual Neodymium Magnets", "Instant Sun Protection", "Prescription Eyeglass Base"],
    weight: "16g",
    caliber: "53-17-142",
    description: "The smartest 2-in-1 eyewear. Prescription clear eyeglasses by day, magnetic snap-on polarized sunglasses when you step out in the sun.",
    bestSeller: true,
    inStock: true,
    rating: 5.0,
    reviewsCount: 540
  },
  {
    _id: "lk-20",
    name: "Vincent Chase Switch Round Clip-On Shades",
    slug: "vincent-chase-switch-round-clip-on",
    category: "clip-on",
    frameType: "full-rim",
    frameShape: "round",
    brandCollection: "Vincent Chase",
    gender: "unisex",
    material: "mixed",
    price: 2299,
    originalPrice: 4199,
    images: ["/images/model-gold.jpg"],
    colors: ["Gold/Black Clip", "Silver/Blue Mirror Clip"],
    features: ["Seamless Invisible Clip", "Polarized TAC", "Featherweight 17g"],
    weight: "17g",
    caliber: "49-20-142",
    description: "Vintage round optical frames with an ultra-thin magnetic polarized sun clip that seamlessly bonds to the bridge without rattling.",
    bestSeller: false,
    inStock: true,
    rating: 4.8,
    reviewsCount: 190
  }
];

export function getFallbackProducts(filters?: {
  category?: string;
  frameShape?: string;
  frameType?: string;
  brandCollection?: string;
  sort?: string;
}) {
  let list = [...DEFAULT_PRODUCTS];

  if (filters?.category && filters.category !== "All") {
    const cat = filters.category.toLowerCase().replace(/\s+/g, "-");
    list = list.filter((p) => p.category.toLowerCase().replace(/\s+/g, "-") === cat);
  }

  if (filters?.frameShape && filters.frameShape !== "All Shapes") {
    list = list.filter((p) => p.frameShape.toLowerCase() === filters.frameShape?.toLowerCase());
  }

  if (filters?.frameType && filters.frameType !== "All Types") {
    const ftKey = filters.frameType.toLowerCase().replace(/\s+/g, "-");
    list = list.filter((p) => p.frameType.toLowerCase() === ftKey);
  }

  if (filters?.brandCollection && filters.brandCollection !== "All Brands") {
    list = list.filter((p) => p.brandCollection.toLowerCase().includes(filters.brandCollection?.toLowerCase() || ""));
  }

  if (filters?.sort === "price-asc" || filters?.sort === "price_asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (filters?.sort === "price-desc" || filters?.sort === "price_desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (filters?.sort === "popular") {
    list.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
  } else if (filters?.sort === "newest") {
    list.reverse();
  }

  return list;
}

export function getFallbackProductBySlug(slug: string) {
  return DEFAULT_PRODUCTS.find((p) => p.slug === slug) || DEFAULT_PRODUCTS[0];
}
