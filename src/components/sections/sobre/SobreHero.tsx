"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/config";
import Image from "next/image";
import styles from "./SobreHero.module.css";

export default function SobreHero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const textColRef  = useRef<HTMLDivElement>(null);
  const photoColRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const textCol  = textColRef.current;
      const photoCol = photoColRef.current;
      if (!textCol || !photoCol) return;

      // Highlights ficam dentro da coluna de texto
      const highlights = textCol.querySelectorAll(`.${styles.highlightItem}`);

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ── Sem animação ───────────────────────────────────────────────────────
      if (reduced) {
        gsap.set([textCol, photoCol], { opacity: 1, x: 0 });
        if (highlights.length) gsap.set(highlights, { opacity: 1, y: 0 });
        return;
      }

      // ── Estados iniciais ───────────────────────────────────────────────────
      gsap.set(textCol,  { opacity: 0, x: -40 });
      gsap.set(photoCol, { opacity: 0, x:  40 });
      if (highlights.length) gsap.set(highlights, { opacity: 0, y: 20 });

      // ── Timeline de entrada ────────────────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.3 });

      // 1+2. Texto e foto entram simultaneamente
      tl.to(textCol,  { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" }, 0)
        .to(photoCol, { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" }, 0);

      // 3. Destaques entram com stagger após text/foto
      if (highlights.length) {
        tl.to(
          highlights,
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
          },
          "+=0.1"
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.sobreHero}>
      <div className={styles.inner}>

        {/* ══ COLUNA ESQUERDA — Texto ══════════════════════════════════════ */}
        <div ref={textColRef}>

          {/* Tag de seção */}
          <p className={styles.tag}>
            <span className={styles.tagLine} />
            Sobre mim
          </p>

          {/* Título */}
          <h1 className={styles.title}>
            <span className={styles.titleLine}>Diovani</span>
            <span className={styles.titleLine}>Matos.</span>
          </h1>

          {/* Bio */}
          <p className={styles.bio}>
            Desenvolvedor web baseado em Criciúma, SC. Especializado em criar
            sites que equilibram design de alto nível com resultados concretos
            para o negócio.
          </p>
          <p className={styles.bio}>
            Trabalho com negócios que entendem que presença digital não é custo
            — é vantagem competitiva. Cada projeto começa com um problema real e
            termina com uma solução que funciona.
          </p>

          {/* Destaques numéricos */}
          <div className={styles.highlights}>
            <div className={styles.highlightItem}>
              <span className={styles.highlightNumber}>
                2<span className={styles.highlightSuffix}>+</span>
              </span>
              <span className={styles.highlightLabel}>Projetos entregues</span>
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightNumber}>
                100<span className={styles.highlightSuffix}>%</span>
              </span>
              <span className={styles.highlightLabel}>Taxa de satisfação</span>
            </div>
          </div>

        </div>

        {/* ══ COLUNA DIREITA — Foto ════════════════════════════════════════ */}
        <div ref={photoColRef} className={styles.photoCol}>

          {/*
            Elemento decorativo vem ANTES do container no DOM:
            pintado primeiro → aparece atrás sem precisar de z-index negativo.
          */}
          <div className={styles.photoDeco} aria-hidden="true" />

          <div className={styles.photoContainer}>
            <Image
              src="/images/foto-diovani.jpg"
              alt="Diovani Matos — Desenvolvedor Web"
              fill
              priority
              className={styles.image}
            />
          </div>

        </div>

      </div>
    </section>
  );
}
