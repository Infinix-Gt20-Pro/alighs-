import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALIGH'S WARE — Firozabad's Premium Eyewear & Optics",
  description:
    "Dr. Sheeraz Ahmad (AMU-Certified) ke saath Firozabad ki bharosemand quality ab online. Premium titanium eyeglasses, blue-cut lenses, free home try-on, aur expert eye care consultation.",
  keywords: [
    "Aligh's Ware",
    "Firozabad eyewear",
    "premium glasses",
    "blue cut lenses",
    "titanium frames",
    "Dr. Sheeraz Ahmad",
    "optometrist Firozabad",
    "eye care",
    "online glasses India",
  ],
  openGraph: {
    title: "ALIGH'S WARE — Premium Eyewear from Firozabad",
    description:
      "Firozabad ki bharosemand offline quality, ab online. Premium titanium frames, 420nm blue-cut crystal clarity, aur AMU-certified optometrist ki eye care.",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
