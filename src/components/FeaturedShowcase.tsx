// src/components/FeaturedShowcase.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getFallbackProducts, ProductType } from "@/lib/products-data";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowRight, Sparkles, Check, Star, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

function getCircularDiff(idx: number, active: number, total: number) {
  if (total <= 1) return 0;
  let diff = (idx - active) % total;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

export default function FeaturedShowcase() {
  const { addToCart } = useCart();
  const { tier } = useDeviceTier();
  const [products, setProducts] = useState<ProductType[]>(() =>
    getFallbackProducts({ onlyActive: true })
  );
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Touch and Drag Gesture State
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [cardSpacing, setCardSpacing] = useState(300);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0, time: 0 });
  const dragOffsetRef = useRef(0);
  const moveHistoryRef = useRef({
    prevX: 0,
    prevTime: 0,
    curX: 0,
    curTime: 0,
  });
  const dragRafId = useRef<number | null>(null);

  const isSwiping = useRef(false);
  const hasDeterminedGesture = useRef(false);
  const wasDraggingRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const isTouchActiveRef = useRef(false);
  const wheelCooldownRef = useRef(false);
  const mouseTicking = useRef(false);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/products", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setProducts(
            data.filter(
              (p: ProductType) => !p.status || p.status.toLowerCase() === "active"
            )
          );
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const filters = [
    { id: "all", label: "All Curations" },
    { id: "eyeglasses", label: "👓 Eyeglasses" },
    { id: "computer-glasses", label: "💻 Computer (BLU)" },
    { id: "sunglasses", label: "🕶️ Polarized Sun" },
    { id: "titanium", label: "Air Titanium" },
  ];

  const filteredProducts = products.filter((product) => {
    if (product.status && product.status.toLowerCase() !== "active") return false;
    const cat = product.category?.toLowerCase() || "";
    if (selectedFilter === "eyeglasses") return cat === "eyeglasses";
    if (selectedFilter === "computer-glasses") return cat === "computer-glasses";
    if (selectedFilter === "sunglasses") return cat === "sunglasses";
    if (selectedFilter === "titanium") return product.material && product.material.toLowerCase().includes("titanium");
    return true;
  }).slice(0, 8);

  // Responsive spacing calibration
  useEffect(() => {
    const updateSpacing = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 640) {
        setCardSpacing(260);
      } else if (window.innerWidth < 1024) {
        setCardSpacing(290);
      } else {
        setCardSpacing(320);
      }
    };
    updateSpacing();
    window.addEventListener("resize", updateSpacing);
    return () => window.removeEventListener("resize", updateSpacing);
  }, []);

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => {
      if (filteredProducts.length <= 1) return prev;
      return (prev + 1) % filteredProducts.length;
    });
  }, [filteredProducts.length]);

  const prevCard = useCallback(() => {
    setActiveIndex((prev) => {
      if (filteredProducts.length <= 1) return prev;
      return (prev - 1 + filteredProducts.length) % filteredProducts.length;
    });
  }, [filteredProducts.length]);

  const handleFilterChange = (id: string) => {
    setSelectedFilter(id);
    setActiveIndex(0);
    setDragOffset(0);
    dragOffsetRef.current = 0;
    setIsDragging(false);
  };

  const handleQuickAdd = (product: ProductType) => {
    addToCart(
      {
        productId: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0] || "/images/clarity-showcase.jpg",
        color: product.colors[0] || "Black",
        colorHex: "#111111",
        weight: product.weight || "18g",
      },
      1
    );
    setAddedSlug(product.slug);
    setTimeout(() => setAddedSlug(null), 1800);
  };

  // 3D subtle mouse hover parallax tilt on stage
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tier === "LOW" || !stageRef.current || mouseTicking.current) return;
    mouseTicking.current = true;
    const clientX = e.clientX;
    const clientY = e.clientY;

    requestAnimationFrame(() => {
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
      }
      mouseTicking.current = false;
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Throttled RAF offset updater for fluid 60fps/120fps dragging
  const updateDragOffset = useCallback((offset: number) => {
    dragOffsetRef.current = offset;
    if (!dragRafId.current) {
      dragRafId.current = requestAnimationFrame(() => {
        setDragOffset(dragOffsetRef.current);
        dragRafId.current = null;
      });
    }
  }, []);

  // Cleanup pending RAF on unmount
  useEffect(() => {
    return () => {
      if (dragRafId.current) {
        cancelAnimationFrame(dragRafId.current);
      }
    };
  }, []);

  // Desktop Mouse Drag Listeners (attached to window for boundless drag capture)
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;

      // Detect released button outside window
      if (e.buttons === 0) {
        handleWindowMouseUp();
        return;
      }

      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Require genuine horizontal movement to initiate dragging
      if (!wasDraggingRef.current && absX > 8 && absX > absY) {
        wasDraggingRef.current = true;
        setIsDragging(true);
      }

      if (wasDraggingRef.current) {
        const now = Date.now();
        moveHistoryRef.current = {
          prevX: moveHistoryRef.current.curX,
          prevTime: moveHistoryRef.current.curTime,
          curX: e.clientX,
          curTime: now,
        };

        const maxDrag = cardSpacing * 1.15;
        let dampedDeltaX = deltaX;
        if (absX > maxDrag) {
          const excess = absX - maxDrag;
          dampedDeltaX = Math.sign(deltaX) * (maxDrag + excess * 0.25);
        }
        updateDragOffset(dampedDeltaX);
      }
    };

    const handleWindowMouseUp = () => {
      if (!isMouseDownRef.current) return;
      isMouseDownRef.current = false;

      if (dragRafId.current) {
        cancelAnimationFrame(dragRafId.current);
        dragRafId.current = null;
      }

      if (wasDraggingRef.current) {
        const now = Date.now();
        const { prevX, prevTime, curX, curTime } = moveHistoryRef.current;
        const timeSinceLastMove = now - curTime;
        let releaseVelocity = 0;
        if (timeSinceLastMove < 120 && curTime > prevTime) {
          releaseVelocity = (curX - prevX) / (curTime - prevTime);
        }

        const currentOffset = dragOffsetRef.current;
        const isFlick = Math.abs(releaseVelocity) > 0.4 && Math.abs(currentOffset) > 20;
        const isDistance = Math.abs(currentOffset) > 55;

        if (isFlick) {
          if (releaseVelocity < 0) {
            nextCard();
          } else {
            prevCard();
          }
        } else if (isDistance) {
          if (currentOffset < 0) {
            nextCard();
          } else {
            prevCard();
          }
        }

        setTimeout(() => {
          wasDraggingRef.current = false;
        }, 150);
      }

      dragOffsetRef.current = 0;
      setDragOffset(0);
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    window.addEventListener("blur", handleWindowMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
      window.removeEventListener("blur", handleWindowMouseUp);
    };
  }, [nextCard, prevCard, cardSpacing, updateDragOffset]);

  // Touch Event Handlers for Mobile & Tablets
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (filteredProducts.length <= 1) return;
    isTouchActiveRef.current = true;
    const touch = e.touches[0];
    const now = Date.now();
    dragStartPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: now,
    };
    moveHistoryRef.current = {
      prevX: touch.clientX,
      prevTime: now,
      curX: touch.clientX,
      curTime: now,
    };
    isSwiping.current = false;
    hasDeterminedGesture.current = false;
    wasDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (filteredProducts.length <= 1 || e.touches.length === 0 || e.touches.length > 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartPos.current.x;
    const deltaY = touch.clientY - dragStartPos.current.y;

    if (!hasDeterminedGesture.current) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Distinguish horizontal swipe vs vertical scroll
      if (absX > 8 || absY > 8) {
        hasDeterminedGesture.current = true;
        if (absX > absY) {
          isSwiping.current = true;
          setIsDragging(true);
          wasDraggingRef.current = true;
        } else {
          // Allow natural vertical browser page scroll without interference
          isSwiping.current = false;
        }
      }
    }

    if (isSwiping.current) {
      const now = Date.now();
      moveHistoryRef.current = {
        prevX: moveHistoryRef.current.curX,
        prevTime: moveHistoryRef.current.curTime,
        curX: touch.clientX,
        curTime: now,
      };

      const maxDrag = cardSpacing * 1.15;
      const absX = Math.abs(deltaX);
      let dampedDeltaX = deltaX;
      if (absX > maxDrag) {
        const excess = absX - maxDrag;
        dampedDeltaX = Math.sign(deltaX) * (maxDrag + excess * 0.25);
      }
      updateDragOffset(dampedDeltaX);
    }
  };

  const handleTouchEnd = () => {
    if (dragRafId.current) {
      cancelAnimationFrame(dragRafId.current);
      dragRafId.current = null;
    }

    if (isSwiping.current) {
      const now = Date.now();
      const { prevX, prevTime, curX, curTime } = moveHistoryRef.current;
      const timeSinceLastMove = now - curTime;
      let releaseVelocity = 0;
      if (timeSinceLastMove < 120 && curTime > prevTime) {
        releaseVelocity = (curX - prevX) / (curTime - prevTime);
      }

      const currentOffset = dragOffsetRef.current;
      const isFlick = Math.abs(releaseVelocity) > 0.4 && Math.abs(currentOffset) > 20;
      const isDistance = Math.abs(currentOffset) > 55;

      if (isFlick) {
        if (releaseVelocity < 0) {
          nextCard();
        } else {
          prevCard();
        }
      } else if (isDistance) {
        if (currentOffset < 0) {
          nextCard();
        } else {
          prevCard();
        }
      }

      setTimeout(() => {
        wasDraggingRef.current = false;
        isTouchActiveRef.current = false;
      }, 150);
    } else {
      setTimeout(() => {
        isTouchActiveRef.current = false;
      }, 300);
    }

    isSwiping.current = false;
    hasDeterminedGesture.current = false;
    dragOffsetRef.current = 0;
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleTouchCancel = () => {
    if (dragRafId.current) {
      cancelAnimationFrame(dragRafId.current);
      dragRafId.current = null;
    }
    isSwiping.current = false;
    hasDeterminedGesture.current = false;
    dragOffsetRef.current = 0;
    setDragOffset(0);
    setIsDragging(false);
    setTimeout(() => {
      wasDraggingRef.current = false;
      isTouchActiveRef.current = false;
    }, 150);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isTouchActiveRef.current || filteredProducts.length <= 1) return;
    isMouseDownRef.current = true;
    const now = Date.now();
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      time: now,
    };
    moveHistoryRef.current = {
      prevX: e.clientX,
      prevTime: now,
      curX: e.clientX,
      curTime: now,
    };
    wasDraggingRef.current = false;
  };

  // Suppress accidental clicks on buttons/links during or immediately after dragging
  const handleStageClickCapture = (e: React.MouseEvent) => {
    if (wasDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Trackpad 2-finger horizontal swipe sliding
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (wheelCooldownRef.current || filteredProducts.length <= 1) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 35) {
      wheelCooldownRef.current = true;
      if (e.deltaX > 0) {
        nextCard();
      } else {
        prevCard();
      }
      setDragOffset(0);
      dragOffsetRef.current = 0;
      setTimeout(() => {
        wheelCooldownRef.current = false;
      }, 450);
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevCard();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextCard();
    }
  };

  return (
    <section
      id="collection"
      className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Soft warm ambient lighting atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-br from-[#E8D2A8]/30 via-[#D4AF62]/15 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 border-b border-[#B88A32]/20 dark:border-[#B88A32]/30 pb-5 sm:pb-7">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF9EF] dark:bg-[#161622] border border-[#B88A32]/30 dark:border-[#D4AF62]/40 text-[10px] sm:text-xs font-mono tracking-[0.26em] text-[#B88A32] dark:text-[#D4AF62] uppercase font-bold mb-2.5 sm:mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
            <span>3D ATELIER GALLERY</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.08em] text-[#2A2118] dark:text-[#F5EFE6]">
            Architectural Eyewear Collection
          </h2>
          <p className="text-[#4A3928] dark:text-[#B8ADA0] mt-1.5 sm:mt-2.5 max-w-xl text-xs sm:text-base font-cormorant italic leading-relaxed">
            Calibrated for facial ergonomics, optical clarity, and timeless Firozabad luxury.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full py-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`cursor-pointer px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all duration-300 shrink-0 ${
                selectedFilter === f.id
                  ? "bg-gradient-to-r from-[#B88A32] to-[#D4AF62] text-white font-semibold shadow-[0_4px_15px_rgba(184,138,50,0.35)]"
                  : "bg-[#FFF9EF] dark:bg-[#161622] text-[#4A3928] dark:text-[#B8ADA0] hover:text-[#2A2118] dark:hover:text-[#F5EFE6] border border-[#B88A32]/25 dark:border-[#B88A32]/30 hover:bg-[#F4E9D5] dark:hover:bg-[#1E1E2A]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          3D EDITORIAL GALLERY STAGE (Swipe & Drag Enabled)
         ========================================================================= */}
      <div
        ref={stageRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onClickCapture={handleStageClickCapture}
        className={`relative w-full min-h-[520px] sm:min-h-[580px] flex items-center justify-center py-6 sm:py-10 touch-pan-y select-none outline-none focus-visible:ring-1 focus-visible:ring-[#B88A32]/40 rounded-3xl transition-cursor duration-150 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ perspective: "1200px", touchAction: "pan-y" }}
      >
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={prevCard}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          aria-label="Previous Frame"
          className="cursor-pointer absolute left-2 sm:left-4 z-50 p-3 rounded-full bg-[#FFF9EF]/90 dark:bg-[#161622]/90 hover:bg-white dark:hover:bg-[#1E1E2C] border border-[#B88A32]/30 dark:border-[#D4AF62]/40 text-[#2A2118] dark:text-[#F5EFE6] hover:text-[#B88A32] dark:hover:text-[#D4AF62] shadow-[0_8px_25px_rgba(42,33,24,0.08)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.5)] transition-all duration-200 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={nextCard}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          aria-label="Next Frame"
          className="cursor-pointer absolute right-2 sm:right-4 z-50 p-3 rounded-full bg-[#FFF9EF]/90 dark:bg-[#161622]/90 hover:bg-white dark:hover:bg-[#1E1E2C] border border-[#B88A32]/30 dark:border-[#D4AF62]/40 text-[#2A2118] dark:text-[#F5EFE6] hover:text-[#B88A32] dark:hover:text-[#D4AF62] shadow-[0_8px_25px_rgba(42,33,24,0.08)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.5)] transition-all duration-200 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Floating Perspective Cards Stack */}
        <div className="relative w-full max-w-4xl h-[480px] sm:h-[530px] flex items-center justify-center pointer-events-none">
          {filteredProducts.map((product, idx) => {
            const diff = getCircularDiff(idx, activeIndex, filteredProducts.length);
            const total = filteredProducts.length;

            // Render cards within view scope for optimal performance
            if (total > 5 && Math.abs(diff) > 3) return null;

            const pos = diff + dragOffset / cardSpacing;
            const absPos = Math.abs(pos);
            const sign = pos < 0 ? -1 : 1;
            const isCenter = diff === 0;

            // Continuous, seamless 3D transformation derived from real-time drag offset
            let xOffset = 0;
            let scale = 1.0;
            let rotateY = 0;
            let opacity = 1.0;

            if (absPos <= 1) {
              xOffset = pos * cardSpacing;
              scale = 1.0 - absPos * 0.15;
              opacity = 1.0 - absPos * 0.35;
              rotateY = -pos * 16 + (1 - absPos) * (tier !== "LOW" ? mousePos.x * 8 : 0);
            } else if (absPos <= 2) {
              const norm = absPos - 1;
              xOffset = sign * (cardSpacing + norm * 180);
              scale = 0.85 - norm * 0.13;
              opacity = Math.max(0.15, 0.65 - norm * 0.35);
              rotateY = -sign * (16 + norm * 9);
            } else {
              const extra = absPos - 2;
              xOffset = sign * (cardSpacing + 180 + extra * 160);
              scale = Math.max(0.5, 0.72 - extra * 0.15);
              opacity = Math.max(0, 0.30 - extra * 0.30);
              rotateY = -sign * (25 + Math.min(5, extra * 5));
            }

            const rotateX = isCenter && tier !== "LOW" ? -mousePos.y * 6 * Math.max(0, 1 - absPos) : 0;
            const zIndex = Math.max(1, Math.round(50 - absPos * 15));

            return (
              <motion.div
                key={product._id}
                onClick={() => {
                  if (wasDraggingRef.current) return;
                  if (!isCenter) {
                    setActiveIndex(idx);
                    setDragOffset(0);
                    dragOffsetRef.current = 0;
                  }
                }}
                initial={false}
                animate={{
                  x: xOffset,
                  scale,
                  rotateY,
                  rotateX,
                  opacity,
                  zIndex,
                }}
                transition={{
                  type: "spring",
                  stiffness: isDragging ? 550 : 260,
                  damping: isDragging ? 42 : 26,
                  mass: isDragging ? 0.6 : 1,
                }}
                className={`absolute pointer-events-auto w-[300px] sm:w-[400px] md:w-[460px] p-5 sm:p-7 rounded-3xl bg-[#FFF9EF] dark:bg-[#12121A] border transition-[border-color,box-shadow,background-color] duration-300 select-none ${
                  isDragging
                    ? "cursor-grabbing"
                    : absPos < 0.5
                    ? "cursor-grab"
                    : "cursor-pointer"
                } ${
                  absPos < 0.5
                    ? "border-[#B88A32]/45 dark:border-[#B88A32]/60 shadow-[0_20px_60px_rgba(42,33,24,0.14)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                    : "border-[#B88A32]/20 dark:border-[#B88A32]/25 shadow-[0_10px_30px_rgba(42,33,24,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:border-[#B88A32]/50 dark:hover:border-[#B88A32]/60"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  touchAction: "pan-y",
                }}
              >
                {/* Header Badge Row */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#8B7355] dark:text-[#C4B59E] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F4E9D5] dark:bg-[#1A1A26] border border-[#B88A32]/20 dark:border-[#B88A32]/30 truncate">
                    {product.material.toUpperCase()}
                  </span>

                  {product.bestSeller && (
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-[#B88A32] dark:text-[#D4AF62] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#B88A32]/15 dark:bg-[#B88A32]/25 border border-[#B88A32]/30 font-bold shrink-0">
                      <Star className="w-3 h-3 fill-[#B88A32] text-[#B88A32] dark:fill-[#D4AF62] dark:text-[#D4AF62]" />
                      <span>BESTSELLER</span>
                    </span>
                  )}
                </div>

                {/* Dominant Eyewear Photography Container */}
                <div className="relative w-full h-36 sm:h-52 my-3 rounded-2xl bg-gradient-to-br from-[#F4E9D5]/90 via-[#FFF9EF] to-[#E8D2A8]/40 dark:from-[#181824] dark:via-[#14141E] dark:to-[#0F0F16] border border-[#B88A32]/15 dark:border-[#B88A32]/30 flex items-center justify-center p-3 overflow-hidden group">
                  {/* Subtle pedestal glow */}
                  <div className="absolute inset-0 bg-radial from-[#D4AF62]/20 dark:from-[#D4AF62]/15 to-transparent opacity-50" />
                  
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      draggable={false}
                      className={`max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(42,33,24,0.18)] dark:drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] transition-transform duration-500 relative z-10 pointer-events-none select-none ${
                        isCenter ? "group-hover:scale-108" : ""
                      }`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative flex flex-col items-center z-10">
                      <span className="text-xs font-mono text-[#B88A32] dark:text-[#D4AF62] uppercase tracking-widest">
                        {product.frameShape} Frame
                      </span>
                    </div>
                  )}
                </div>

                {/* Eyewear Title & Details */}
                <div className="mt-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-cinzel text-sm sm:text-lg font-bold text-[#2A2118] dark:text-[#F5EFE6] line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-sm sm:text-base font-bold font-mono text-[#B88A32] dark:text-[#D4AF62]">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-[#8B7355] dark:text-[#A09383] line-through font-mono ml-1.5">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description with fluid opacity and fixed dimensional layout stability */}
                  <p
                    className="text-xs text-[#4A3928] dark:text-[#D5C7B5] mt-1.5 line-clamp-2 leading-relaxed font-cormorant italic transition-opacity duration-200"
                    style={{
                      opacity: Math.max(0, Math.min(1, 1 - absPos * 1.8)),
                    }}
                  >
                    {product.description}
                  </p>

                  {/* Finish Swatches & Specs */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#B88A32]/15 dark:border-[#B88A32]/25">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-[#6B5740] dark:text-[#A09383] mr-1">Finishes:</span>
                      {product.colors.slice(0, 3).map((col) => (
                        <span
                          key={col}
                          className="w-3 h-3 rounded-full border border-[#B88A32]/30 dark:border-[#B88A32]/50 shrink-0 shadow-sm"
                          title={col}
                          style={{
                            backgroundColor:
                              col.toLowerCase().includes("gold") ? "#D4AF37" :
                              col.toLowerCase().includes("green") || col.toLowerCase().includes("emerald") ? "#0F4C3A" :
                              col.toLowerCase().includes("blue") || col.toLowerCase().includes("cobalt") ? "#1E3A8A" :
                              col.toLowerCase().includes("red") || col.toLowerCase().includes("crimson") ? "#991B1B" :
                              col.toLowerCase().includes("silver") ? "#E5E7EB" :
                              col.toLowerCase().includes("tortoise") ? "#78350F" : "#171717"
                          }}
                        />
                      ))}
                    </div>

                    <span className="text-[10px] font-mono text-[#8B7355] dark:text-[#C4B59E] uppercase font-bold">
                      {product.weight || "14g"} &bull; {product.frameWidth || "Medium"}
                    </span>
                  </div>

                  {/* Actions (Consistently structured with zero layout popping and click isolation) */}
                  <div
                    className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 pt-2 transition-opacity duration-200"
                    style={{
                      opacity: Math.max(0, Math.min(1, 1 - absPos * 2)),
                      pointerEvents: absPos < 0.35 && !isDragging ? "auto" : "none",
                    }}
                  >
                    <Link
                      href={`/shop/${product.slug}`}
                      draggable={false}
                      className="cursor-pointer py-2.5 px-3 rounded-xl bg-[#F4E9D5] dark:bg-[#1A1A26] hover:bg-white dark:hover:bg-[#242436] border border-[#B88A32]/30 dark:border-[#B88A32]/40 text-xs font-mono font-bold uppercase tracking-wider text-[#2A2118] dark:text-[#F5EFE6] text-center transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 select-none"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B88A32] dark:text-[#D4AF62]" />
                      <span>Specs</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      className="cursor-pointer py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#B88A32] to-[#D4AF62] hover:brightness-105 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(184,138,50,0.3)] active:scale-95 select-none"
                    >
                      {addedSlug === product.slug ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-white" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Carousel Pagination & Indicator */}
      <div className="flex flex-col items-center justify-center mt-4 gap-3">
        <div className="flex items-center gap-1.5">
          {filteredProducts.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveIndex(idx);
                setDragOffset(0);
                dragOffsetRef.current = 0;
              }}
              aria-label={`Go to frame ${idx + 1}`}
              className={`cursor-pointer transition-all duration-300 rounded-full ${
                activeIndex === idx
                  ? "w-8 h-2 bg-[#B88A32]"
                  : "w-2 h-2 bg-[#B88A32]/30 hover:bg-[#B88A32]/60"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#6B5740] dark:text-[#A09383] tracking-widest uppercase font-bold">
          <span>
            {String(activeIndex + 1).padStart(2, "0")} / {String(filteredProducts.length).padStart(2, "0")} ATELIER FRAMES
          </span>
          <span className="text-[#B88A32]/40 dark:text-[#D4AF62]/40">&bull;</span>
          <span className="text-[11px] text-[#B88A32] dark:text-[#D4AF62] font-semibold flex items-center gap-1.5">
            <span className="inline-block animate-pulse">&larr;</span>
            <span className="sm:inline hidden">Swipe or Drag to slide</span>
            <span className="sm:hidden inline">Swipe to slide</span>
            <span className="inline-block animate-pulse">&rarr;</span>
          </span>
        </div>
      </div>

      {/* Bottom CTA to Shop */}
      <div className="text-center mt-12">
        <Link
          href="/shop"
          className="cursor-pointer inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#FFF9EF] dark:bg-[#14141C] hover:bg-white dark:hover:bg-[#1A1A26] border border-[#B88A32]/35 dark:border-[#B88A32]/45 text-[#2A2118] dark:text-[#F5EFE6] font-bold text-xs font-mono tracking-[0.18em] uppercase hover:shadow-[0_4px_25px_rgba(184,138,50,0.25)] hover:scale-105 transition-all duration-300"
        >
          <span>Explore Full 40+ Architectural Catalog</span>
          <ArrowRight className="w-4 h-4 text-[#B88A32] dark:text-[#D4AF62]" />
        </Link>
      </div>
    </section>
  );
}
