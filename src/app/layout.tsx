import type { Metadata } from "next";
import { Geist_Mono, Cinzel, Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SmoothScroll from "@/components/SmoothScroll";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALIGSWARE — Luxury Eyewear & Clinical Optics from Firozabad",
  description:
    "Trusted heritage craftsmanship from Firozabad with Dr. Sheeraz Ahmad (AMU-Certified). Premium titanium eyeglasses, 420nm blue-cut lenses, free home try-on, and expert eye care consultation.",
  keywords: [
    "Aligsware",
    "Firozabad eyewear",
    "luxury glasses",
    "blue cut lenses",
    "titanium frames",
    "Dr. Sheeraz Ahmad",
    "optometrist Firozabad",
    "eye care",
    "online glasses India",
  ],
  openGraph: {
    title: "ALIGSWARE — Luxury Eyewear from Firozabad",
    description:
      "Firozabad's trusted heritage craftsmanship, now online. Premium titanium frames, 420nm blue-cut crystal clarity, and AMU-certified clinical optometry.",
    type: "website",
  },
  icons: {
    icon: "/images/aligsware-logo.png",
    apple: "/images/aligsware-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F4E9D5] text-[#2A2118]">
        <SmoothScroll />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
