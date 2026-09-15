"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 15, stiffness: 200, delay: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="relative group">
        <div className="absolute -inset-2 bg-[#25D366] rounded-full opacity-40 group-hover:opacity-60 blur-md animate-pulse"></div>
        <motion.a
          href="https://wa.me/919876543210?text=Hi%20ALIGH'S%20WARE!%20I'm%20interested%20in%20your%20premium%20eyewear%20collection."
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg text-white"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
        </motion.a>
      </div>
    </motion.div>
  );
}
