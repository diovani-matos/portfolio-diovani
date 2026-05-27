"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";
import styles from "./SobreStack.module.css";

// ── Dados da stack ────────────────────────────────────────────────────────────

const STACK = [
  {
    categoria: "Frontend",
    items: ["Next.js 15", "TypeScript", "CSS Modules", "GSAP + Lenis"],
  },
  {
    categoria: "Backend",
    items: ["Node.js", "PHP", "API REST", "Supabase"],
  },
  {
    categoria: "E-commerce",
    items: [
      "Integração de pagamentos",
      "Mercado Pago",
      "Gestão de produtos",
      "Checkout otimizado",
    ],
  },
  {
    categoria: "SEO & Performance",
    items: ["Core Web Vitals", "Schema.org", "Sitemap dinâmico", "PageSpeed 90+"],
  },
  {
    categoria: "Design",
    items: ["Figma", "CSS avançado", "Design responsivo", "Animações web"],
  },
  {
    categoria: "Ferramentas",
    items: ["Git & GitHub", "VS Code", "Claude Code", "Vercel"],
  },
] as const;

// ── Componente ────────────────────────────────────────────────────────────────

export default function SobreStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      const cards = grid.querySelectorAll<HTMLElement>(`.${styles.card}`);
      if (!cards.length) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ── Sem animação ─────────────────────────────────────────────────────
      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      // ── Estado inicial ───────────────────────────────────────────────────
      gsap.set(cards, { opacity: 0, y: 30 });

      // ── ScrollTrigger: entrada com stagger ao entrar na viewport ─────────
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.sobreStack}>
      <div className={styles.inner}>

        {/* ── Cabeçalho ── */}
        <header className={styles.header}>
          <p className={styles.tag}>
            <span className={styles.tagLine} />
            Stack &amp; Ferramentas
          </p>
          <h2 className={styles.title}>Com o que trabalho</h2>
        </header>

        {/* ── Grid de categorias ── */}
        <div ref={gridRef} className={styles.grid}>
          {STACK.map(({ categoria, items }) => (
            <div key={categoria} className={styles.card}>
              <p className={styles.cardTitle}>{categoria}</p>
              <ul className={styles.list}>
                {items.map((item) => (
                  <li key={item} className={styles.listItem}>
                    <span className={styles.bullet} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
