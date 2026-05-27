"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/config";
import styles from "./Servicos.module.css";

const SERVICES = [
  {
    number: "01",
    title: "Landing Page",
    description:
      "Páginas construídas para converter. Cada elemento tem função — nada está ali por acaso. Estrutura, copy e design alinhados ao seu objetivo.",
    href: "/servicos#landing-page",
  },
  {
    number: "02",
    title: "Site Institucional",
    description:
      "Presença digital que transmite autoridade. Para negócios que precisam de credibilidade antes de qualquer argumento de venda.",
    href: "/servicos#site-institucional",
  },
  {
    number: "03",
    title: "E-commerce",
    description:
      "Lojas virtuais com foco em conversão. Do catálogo ao checkout — cada etapa pensada para reduzir atrito e aumentar vendas.",
    href: "/servicos#ecommerce",
  },
] as const;

export default function Servicos() {
  const sectionRef    = useRef<HTMLElement>(null);
  const headerLeftRef = useRef<HTMLDivElement>(null);
  const headerRightRef = useRef<HTMLParagraphElement>(null);
  const gridRef       = useRef<HTMLDivElement>(null);
  const bottomRef     = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const headerLeft  = headerLeftRef.current;
      const headerRight = headerRightRef.current;
      const cards       = gridRef.current?.querySelectorAll(`.${styles.card}`);
      const bottom      = bottomRef.current;

      if (!headerLeft || !headerRight || !bottom) return;

      if (prefersReduced) {
        gsap.set([headerLeft, headerRight, bottom], { opacity: 1, x: 0, y: 0 });
        if (cards) gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      // Estados iniciais ocultos
      gsap.set(headerLeft,  { opacity: 0, x: -30 });
      gsap.set(headerRight, { opacity: 0, x: 30 });
      if (cards) gsap.set(cards, { opacity: 0, y: 40 });
      gsap.set(bottom, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      // 1. Cabeçalho esquerdo e direito simultâneos
      tl.to(headerLeft,  { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 0)
        .to(headerRight, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 0);

      // 2. Cards com stagger (0.2s após o cabeçalho)
      if (cards) {
        tl.to(
          cards,
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power3.out" },
          "+=0.2"
        );
      }

      // 3. Linha inferior
      tl.to(bottom, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });

      return () => {
        // useGSAP context reverte tweens e ScrollTriggers automaticamente
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.servicos}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div ref={headerLeftRef} className={styles.headerLeft}>
            <p className={styles.tag}>
              <span className={styles.tagLine} />
              02 — Serviços
            </p>
            <h2 className={styles.title}>O que eu faço</h2>
          </div>
          <p ref={headerRightRef} className={styles.headerRight}>
            Cada projeto começa com um problema real.
            <br />
            Termina com resultado mensurável.
          </p>
        </header>

        <div ref={gridRef} className={styles.grid}>
          {SERVICES.map((service) => (
            <article key={service.number} className={styles.card}>
              <span className={styles.number}>{service.number}</span>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.description}>{service.description}</p>
              <Link href={service.href} className={styles.cardLink}>
                Saiba mais <span className={styles.arrow}>→</span>
              </Link>
            </article>
          ))}
        </div>

        <div ref={bottomRef} className={styles.bottom}>
          <p className={styles.bottomText}>Tem um projeto em mente?</p>
          <Link href="/contato" className={styles.btnPrimary}>
            Vamos conversar
          </Link>
        </div>
      </div>
    </section>
  );
}
