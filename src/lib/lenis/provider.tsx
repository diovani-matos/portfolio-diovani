"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";

// ── Context ──────────────────────────────────────────────────────────────────

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

// ── Provider ──────────────────────────────────────────────────────────────────

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Alimenta ScrollTrigger com os eventos de scroll do Lenis
    lenisInstance.on("scroll", ScrollTrigger.update);

    // Usa o ticker do GSAP como loop de RAF para o Lenis
    // (time vem em segundos do GSAP; Lenis.raf espera milissegundos)
    const tickerHandler = (time: number) => lenisInstance.raf(time * 1000);
    gsap.ticker.add(tickerHandler);

    // Evita pulo brusco no Safari ao voltar para a aba
    gsap.ticker.lagSmoothing(0);

    setLenis(lenisInstance);

    return () => {
      gsap.ticker.remove(tickerHandler);
      lenisInstance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
