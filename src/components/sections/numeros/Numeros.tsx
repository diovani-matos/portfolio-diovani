"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";
import styles from "./Numeros.module.css";

interface Diferencial {
  icon: ReactNode;
  title: string;
  description: string;
}

const DIFERENCIAIS: Diferencial[] = [
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="3" width="26" height="26" rx="1"/>
        <line x1="3" y1="10" x2="29" y2="10"/>
        <line x1="10" y1="10" x2="10" y2="29"/>
      </svg>
    ),
    title: "Design sob medida",
    description:
      "Nenhum template. Cada projeto é criado do zero para o seu negócio, seu público e seus objetivos.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="16" cy="16" r="12"/>
        <polyline points="16,8 16,16 21,21"/>
      </svg>
    ),
    title: "Entrega no prazo",
    description:
      "Prazo definido em contrato antes de começar. Você sabe exatamente quando o projeto estará pronto.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <polyline points="4,24 12,14 18,18 28,8"/>
        <polyline points="22,8 28,8 28,14"/>
      </svg>
    ),
    title: "SEO desde o início",
    description:
      "Performance, estrutura e indexação pensados no desenvolvimento, não adicionados depois como complemento.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M4 6h24v18H4z"/>
        <polyline points="4,24 10,18"/>
        <line x1="10" y1="12" x2="22" y2="12"/>
        <line x1="10" y1="17" x2="18" y2="17"/>
      </svg>
    ),
    title: "Suporte pós-entrega",
    description:
      "Disponível por 24 horas após o lançamento para ajustes e correções. O projeto não termina na entrega.",
  },
];

export default function Numeros() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const header = headerRef.current;
      const grid   = gridRef.current;
      const cards  = grid?.querySelectorAll(`.${styles.card}`);

      if (!header || !grid || !cards?.length) return;

      if (prefersReduced) {
        gsap.set([header, cards], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(header, { opacity: 0, y: 30 });
      gsap.set(cards, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      tl.to(header, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
      tl.to(
        cards,
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power3.out" },
        "+=0.2"
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.numeros}>
      <div className={styles.inner}>

        <div ref={headerRef} className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.tag}>
              <span className={styles.tagLine} />
              04 — Diferenciais
            </p>
            <h2 className={styles.title}>Por que trabalhar comigo</h2>
          </div>
          <p className={styles.headerRight}>
            Cada detalhe pensado para o resultado do seu negócio.
          </p>
        </div>

        <div ref={gridRef} className={styles.grid}>
          {DIFERENCIAIS.map((item) => (
            <div key={item.title} className={styles.card}>
              <div className={styles.icon}>{item.icon}</div>
              <p className={styles.cardTitle}>{item.title}</p>
              <p className={styles.cardDesc}>{item.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
