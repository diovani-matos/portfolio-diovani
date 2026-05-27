"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";
import styles from "./ScrollCamera.module.css";

interface CardData {
  src: string;
  alt: string;
  title: string;
  url?: string | null;
}

interface ScrollCameraProps {
  card1?: CardData;
  card2?: CardData;
  card3?: CardData;
}

// Conteúdo interno — reutilizado nos dois casos (com e sem link)
function CardContent({ data }: { data?: CardData }) {
  if (!data) {
    return (
      <div className={styles.placeholder}>
        <span>Em breve</span>
      </div>
    );
  }
  return (
    <>
      <div className={styles.imageContainer}>
        <Image
          src={data.src}
          alt={data.alt}
          fill
          sizes="(max-width: 768px) calc(100vw - 3rem), 220px"
          className={styles.cardImage}
        />
      </div>
      <div className={styles.cardOverlay}>
        <span className={styles.cardOverlayTitle}>{data.title}</span>
      </div>
    </>
  );
}

export default function ScrollCamera({ card1, card2, card3 }: ScrollCameraProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef  = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const card1Ref   = useRef<HTMLElement>(null);
  const card2Ref   = useRef<HTMLElement>(null);
  const card3Ref   = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isMobile = window.innerWidth < 768;

      const c1     = card1Ref.current;
      const c2     = card2Ref.current;
      const c3     = card3Ref.current;
      const title  = titleRef.current;
      const sticky = stickyRef.current;

      if (!c1 || !c2 || !c3 || !title || !sticky) return;

      // ── Acessibilidade: sem animação ────────────────────────────────────────
      if (prefersReduced) {
        if (isMobile) {
          gsap.set([c1, c2, c3], { opacity: 1, x: 0, y: 0 });
        } else {
          gsap.set(c1, { opacity: 1, x: 0, y: 20 });
          gsap.set(c2, { opacity: 1, y: 0 });
          gsap.set(c3, { opacity: 1, x: 0, y: 40 });
        }
        return;
      }

      // ── Mobile: animação simples sem pin ────────────────────────────────────
      if (isMobile) {
        gsap.set([c1, c2, c3], { opacity: 0, y: 40 });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to([c1, c2, c3], {
              opacity: 1,
              y: 0,
              stagger: 0.15,
              duration: 0.7,
              ease: "power3.out",
            });
          },
        });
        return;
      }

      // ── Desktop: estados iniciais ───────────────────────────────────────────
      gsap.set(c1, { xPercent: -140, opacity: 0 });
      gsap.set(c2, { y: 80, opacity: 0 });
      gsap.set(c3, { xPercent: 140, opacity: 0 });

      // ── Timeline principal com pin ──────────────────────────────────────────
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: sticky,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      mainTl.set({}, {}, 1);

      // Progresso 0.2 → 0.4: card 1 entra da esquerda
      mainTl.to(
        c1,
        { xPercent: 0, y: 20, opacity: 1, ease: "power3.out", duration: 0.2 },
        0.2
      );

      // Progresso 0.45 → 0.65: card 2 sobe do centro
      mainTl.to(
        c2,
        { y: 0, opacity: 1, ease: "power3.out", duration: 0.2 },
        0.45
      );

      // Progresso 0.7 → 0.9: card 3 entra da direita
      mainTl.to(
        c3,
        { xPercent: 0, y: 40, opacity: 1, ease: "power3.out", duration: 0.2 },
        0.7
      );

      // ── Parallax do título ──────────────────────────────────────────────────
      const parallaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: sticky,
          start: "top top",
          end: "+=200%",
          scrub: 1.2,
        },
      });

      parallaxTl.to(title, { y: -60, ease: "none" });

      return () => {
        // useGSAP context reverte tweens e ScrollTriggers automaticamente
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={stickyRef} className={styles.stickyArea}>
        <div className={styles.inner}>

          {/* ── Coluna esquerda: texto ── */}
          <div className={styles.textColumn}>
            <p className={styles.tag}>
              <span className={styles.tagLine} />
              03 — Projetos
            </p>

            <h2 ref={titleRef} className={styles.title}>
              <span className={styles.titleLine}>Trabalhos</span>
              <span className={styles.titleLine}>recentes.</span>
            </h2>

            <p className={styles.subtitle}>
              Projetos desenvolvidos para clientes reais e cases de
              demonstração.
            </p>

            <Link href="/projetos" className={styles.link}>
              Ver todos os projetos{" "}
              <span className={styles.linkArrow}>→</span>
            </Link>
          </div>

          {/* ── Coluna direita: cards ── */}
          <div className={styles.cardsColumn}>

            {/* Card 1 */}
            {card1?.url ? (
              <a
                ref={(el) => { card1Ref.current = el; }}
                href={card1.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver projeto ${card1.title} — abre em nova aba`}
                className={`${styles.card} ${styles.cardClickable}`}
              >
                <CardContent data={card1} />
              </a>
            ) : (
              <article ref={card1Ref} className={styles.card}>
                <CardContent data={card1} />
              </article>
            )}

            {/* Card 2 */}
            {card2?.url ? (
              <a
                ref={(el) => { card2Ref.current = el; }}
                href={card2.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver projeto ${card2.title} — abre em nova aba`}
                className={`${styles.card} ${styles.cardClickable}`}
              >
                <CardContent data={card2} />
              </a>
            ) : (
              <article ref={card2Ref} className={styles.card}>
                <CardContent data={card2} />
              </article>
            )}

            {/* Card 3 */}
            {card3?.url ? (
              <a
                ref={(el) => { card3Ref.current = el; }}
                href={card3.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver projeto ${card3.title} — abre em nova aba`}
                className={`${styles.card} ${styles.cardClickable}`}
              >
                <CardContent data={card3} />
              </a>
            ) : (
              <article ref={card3Ref} className={styles.card}>
                <CardContent data={card3} />
              </article>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
