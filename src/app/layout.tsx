import type { Metadata } from "next";
import { Geist_Mono, Cinzel, Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import SmoothScroll from "@/components/SmoothScroll";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
      suppressHydrationWarning
      className={`${cinzel.variable} ${cormorant.variable} ${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('aligsware_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <SmoothScroll />
        <ThemeProvider>
          <CartProvider>{children}</CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
