"use client";

import { useState, useEffect, RefObject } from "react";

export function useInViewFast(ref: RefObject<HTMLElement | null>, rootMargin = "250px"): boolean {
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [ref, rootMargin]);

  return isInView;
}
