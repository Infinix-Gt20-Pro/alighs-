import { Request, Response } from 'express';
import Product from '../models/Product';

export async function seedDatabase(req: Request, res: Response) {
  try {
    await Product.deleteMany({});
    
    const seedData = [
      {
        name: "Aligh Prime Aviator",
        slug: "aligh-prime-aviator",
        category: "sunglasses",
        price: 3499,
        originalPrice: 4999,
        description: "Classic teardrop aviator engineered with ultra-light Japanese titanium and polarized CR-39 lenses.",
        features: ["Polarized UV400", "Japanese Titanium Frame", "Hydrophobic Coating", "Anti-Reflective Backing"],
        frameShape: "aviator",
        frameMaterial: "titanium",
        frameWidth: "142mm",
        colors: [
          { name: "Gunmetal Shadow", hex: "#2C3539" },
          { name: "Matte Gold", hex: "#D4AF37" },
          { name: "Obsidian Black", hex: "#0B0B0B" }
        ],
        images: ["/images/products/aviator-1.jpg"],
        weight: "14g",
        bestSeller: true,
        inStock: true
      },
      {
        name: "CyberOptic Blue-Cut",
        slug: "cyberoptic-blue-cut",
        category: "computer-glasses",
        price: 2499,
        originalPrice: 3299,
        description: "Engineered for screen professionals. Blocks 99.4% of high-energy 420nm blue light without yellow tint.",
        features: ["HEV 420nm Blue Block", "Zero Color Distortion", "Featherweight TR90", "Anti-Fatigue Geometry"],
        frameShape: "rectangle",
        frameMaterial: "TR90",
        frameWidth: "138mm",
        colors: [
          { name: "Cyan Frost", hex: "#00F2FE" },
          { name: "Midnight Navy", hex: "#0A1128" },
          { name: "Smoky Translucent", hex: "#4A4A4A" }
        ],
        images: ["/images/products/cyber-1.jpg"],
        weight: "11g",
        bestSeller: true,
        inStock: true
      },
      {
        name: "Firozabad Heritage Round",
        slug: "firozabad-heritage-round",
        category: "eyeglasses",
        price: 1999,
        originalPrice: 2799,
        description: "Inspired by Firozabad's historic glass craftsmanship. Perfectly balanced circular silhouette.",
        features: ["High-Index Compatible", "Acetate Temple Tips", "Spring Hinges", "Hand-Polished Finish"],
        frameShape: "round",
        frameMaterial: "mixed",
        frameWidth: "136mm",
        colors: [
          { name: "Amber Tortoise", hex: "#8B4513" },
          { name: "Polished Rose", hex: "#B76E79" },
          { name: "Brushed Silver", hex: "#C0C0C0" }
        ],
        images: ["/images/products/heritage-1.jpg"],
        weight: "16g",
        bestSeller: true,
        inStock: true
      },
      {
        name: "Vanguard Hexagonal",
        slug: "vanguard-hexagonal",
        category: "sunglasses",
        price: 4299,
        originalPrice: 5999,
        description: "Avant-garde geometric design crafted for the modern luxury purist.",
        features: ["Flash Mirror Finish", "Aircraft-Grade Aluminum", "Adjustable Silicone Pads", "Scratch-Resistant Armor"],
        frameShape: "hexagonal",
        frameMaterial: "titanium",
        frameWidth: "140mm",
        colors: [
          { name: "Matte Emerald", hex: "#046307" },
          { name: "Deep Amethyst", hex: "#4B0082" },
          { name: "Satin Platinum", hex: "#E5E4E2" }
        ],
        images: ["/images/products/vanguard-1.jpg"],
        weight: "15g",
        bestSeller: false,
        inStock: true
      }
    ];

    const result = await Product.insertMany(seedData);
    res.json({ message: 'Seeded successfully', count: result.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}
