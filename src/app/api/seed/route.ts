import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';

export async function POST() {
  try {
    await connectDB();
    
    await Product.deleteMany({});
    
    const products = [
      {
        name: "Noir Titanium Aviator",
        slug: "noir-titanium-aviator",
        category: "eyeglasses",
        frameShape: "aviator",
        material: "titanium",
        price: 2499,
        originalPrice: 3999,
        images: ["/images/products/aviator-1.jpg"],
        colors: ["Black", "Gunmetal"],
        features: ["Blue-Cut 420nm", "Anti-Glare Sapphire", "Lightweight"],
        weight: "12g",
        description: "Premium Japanese titanium aviators forged for durability and unmatched lightness. Firozabad craft meets modern precision.",
        bestSeller: true,
        inStock: true
      },
      {
        name: "Emerald Hexa Flex",
        slug: "emerald-hexa-flex",
        category: "sunglasses",
        frameShape: "hexagonal",
        material: "TR90",
        price: 1899,
        originalPrice: 2499,
        images: ["/images/products/hexa-1.jpg"],
        colors: ["Emerald Green", "Matte Black"],
        features: ["UV400 Protection", "Polarized", "Flexible"],
        weight: "16g",
        description: "Distinctive hexagonal frames made from ultra-flexible TR90. A bold statement for everyday wear.",
        bestSeller: true,
        inStock: true
      },
      {
        name: "Onyx Clubmaster Classic",
        slug: "onyx-clubmaster-classic",
        category: "eyeglasses",
        frameShape: "clubmaster",
        material: "mixed",
        price: 1999,
        originalPrice: 2999,
        images: ["/images/products/clubmaster-1.jpg"],
        colors: ["Tortoise", "Black/Gold"],
        features: ["Blue-Cut 420nm", "Scratch Resistant", "Adjustable Nose Pads"],
        weight: "22g",
        description: "Vintage-inspired half-rim clubmasters blending rich acetate with stainless steel accents.",
        bestSeller: false,
        inStock: true
      },
      {
        name: "Crimson Cat-Eye Glam",
        slug: "crimson-cat-eye-glam",
        category: "computer-glasses",
        frameShape: "cat-eye",
        material: "acetate",
        price: 2299,
        originalPrice: 3499,
        images: ["/images/products/cateye-1.jpg"],
        colors: ["Crimson Red", "Rose Gold"],
        features: ["Blue-Cut 420nm", "Anti-Reflective", "UV Protection"],
        weight: "24g",
        description: "Elevate your desk look with these striking acetate cat-eye frames. Blocks harmful blue light in style.",
        bestSeller: true,
        inStock: true
      },
      {
        name: "Cobalt Round Minimalist",
        slug: "cobalt-round-minimalist",
        category: "eyeglasses",
        frameShape: "round",
        material: "titanium",
        price: 3499,
        originalPrice: 4999,
        images: ["/images/products/round-1.jpg"],
        colors: ["Cobalt Blue", "Silver"],
        features: ["Anti-Glare Sapphire", "Scratch Resistant", "Hypoallergenic"],
        weight: "10g",
        description: "Ultra-thin round titanium frames for a seamless, barely-there feel. Perfect for intellectuals.",
        bestSeller: false,
        inStock: true
      },
      {
        name: "Wayfarer Edge",
        slug: "wayfarer-edge",
        category: "sunglasses",
        frameShape: "wayfarer",
        material: "acetate",
        price: 1599,
        originalPrice: 2199,
        images: ["/images/products/wayfarer-1.jpg"],
        colors: ["Matte Black", "Crystal Clear"],
        features: ["UV400 Protection", "Polarized Lenses", "Durable Hinges"],
        weight: "28g",
        description: "The classic wayfarer silhouette modernized with sharp angles and premium Italian acetate.",
        bestSeller: false,
        inStock: true
      },
      {
        name: "Graphite Rectangle Pro",
        slug: "graphite-rectangle-pro",
        category: "eyeglasses",
        frameShape: "rectangle",
        material: "mixed",
        price: 1299,
        originalPrice: 1999,
        images: ["/images/products/rectangle-1.jpg"],
        colors: ["Graphite", "Navy"],
        features: ["Anti-Glare", "Blue-Cut 420nm"],
        weight: "20g",
        description: "Professional rectangular frames designed for boardroom confidence and all-day comfort.",
        bestSeller: true,
        inStock: true
      },
      {
        name: "Amber Round Vintage",
        slug: "amber-round-vintage",
        category: "sunglasses",
        frameShape: "round",
        material: "acetate",
        price: 2899,
        originalPrice: 4299,
        images: ["/images/products/round-2.jpg"],
        colors: ["Amber Tortoise", "Champagne"],
        features: ["UV400 Protection", "Gradient Lenses", "Hand-polished"],
        weight: "26g",
        description: "Chunky round sunglasses that scream retro chic. Hand-polished acetate with a luxurious finish.",
        bestSeller: false,
        inStock: true
      },
      {
        name: "Titan Aviator Pro",
        slug: "titan-aviator-pro",
        category: "computer-glasses",
        frameShape: "aviator",
        material: "titanium",
        price: 4599,
        originalPrice: 5999,
        images: ["/images/products/aviator-2.jpg"],
        colors: ["Gold", "Silver"],
        features: ["Blue-Cut 420nm", "Anti-Glare Sapphire", "Super Hydrophobic"],
        weight: "14g",
        description: "The ultimate pilot glasses for screen time. Elite eye protection housed in aerospace-grade titanium.",
        bestSeller: false,
        inStock: true
      },
      {
        name: "Aura Hexa Clear",
        slug: "aura-hexa-clear",
        category: "eyeglasses",
        frameShape: "hexagonal",
        material: "TR90",
        price: 1799,
        originalPrice: 2599,
        images: ["/images/products/hexa-2.jpg"],
        colors: ["Clear", "Peach"],
        features: ["Blue-Cut 420nm", "Ultra-Flexible", "Lightweight"],
        weight: "15g",
        description: "Transparent geometric frames that adapt to any outfit. Playful yet sophisticated.",
        bestSeller: false,
        inStock: true
      },
      {
        name: "Midnight Cat-Eye Luxe",
        slug: "midnight-cat-eye-luxe",
        category: "sunglasses",
        frameShape: "cat-eye",
        material: "acetate",
        price: 3299,
        originalPrice: 4899,
        images: ["/images/products/cateye-2.jpg"],
        colors: ["Midnight Black", "Tortoise"],
        features: ["UV400 Protection", "Polarized", "Oversized"],
        weight: "30g",
        description: "Oversized cat-eye sunglasses for ultimate glamour and mystery. Premium polarization blocks harsh glare.",
        bestSeller: false,
        inStock: true
      },
      {
        name: "Zenith Wayfarer Tech",
        slug: "zenith-wayfarer-tech",
        category: "computer-glasses",
        frameShape: "wayfarer",
        material: "TR90",
        price: 1499,
        originalPrice: 2299,
        images: ["/images/products/wayfarer-2.jpg"],
        colors: ["Matte Blue", "Grey"],
        features: ["Blue-Cut 420nm", "Anti-Glare", "Flexible Temples"],
        weight: "18g",
        description: "Tech-forward wayfarers built for endless scrolling and coding sessions. Zero eye strain.",
        bestSeller: false,
        inStock: true
      }
    ];

    const result = await Product.insertMany(products);
    
    return NextResponse.json({ 
      message: 'Database seeded successfully', 
      count: result.length 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
