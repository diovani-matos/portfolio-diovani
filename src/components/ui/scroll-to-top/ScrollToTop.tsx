"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@/lib/lenis/provider";

export default function ScrollToTop() {
  const pathname    = usePathname();
  const lenis       = useLenis();
  const isFirst     = useRef(true);

  useEffect(() => {
    // Ignora a montagem inicial — não rola ao carregar a página pela primeira vez
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}
