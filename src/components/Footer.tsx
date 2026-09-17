"use client";

import Link from "next/link";
import { Phone, MessageCircle, MapPin, Eye } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full glass-panel border-t border-white/10 bg-[#0a0a0a] pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center">
                <Eye className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-sans tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                ALIGH&apos;S WARE
              </span>
            </Link>
            <p className="text-gray-400 font-sans leading-relaxed">
              Firozabad ki bharosemand quality, ab online. Premium eyewear with precision and care.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 font-sans">Quick Links</h3>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link href="/shop" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    Shop Collection
                  </Link>
                </li>
                <li>
                  <Link href="/appointment" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    Book Appointment
                  </Link>
                </li>
                <li>
                  <Link href="/#doctor-section" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    Dr. Sheeraz Ahmad
                  </Link>
                </li>
                <li>
                  <Link href="/3d-tryon" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    3D Virtual Try-On
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-white mb-6 font-sans">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>+91 72173 71499</span>
              </li>
              <li>
                <a 
                  href="https://wa.me/917217371499?text=Hi%20ALIGH'S%20WARE!%20I'm%20interested%20in%20your%20premium%20eyewear%20collection."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#25D366] transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                <span>Firozabad, Uttar Pradesh, India</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-center text-center">
          <p className="text-gray-500 text-sm font-mono">
            &copy; 2026 ALIGH&apos;S WARE — Firozabad, Uttar Pradesh
          </p>
        </div>
      </div>
    </footer>
  );
}
