"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/config";
import styles from "./ServicosHero.module.css";

export default function ServicosHero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const tagRef      = useRef<HTMLParagraphElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const subtextRef  = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const tag     = tagRef.current;
      const title   = titleRef.current;
      const subtext = subtextRef.current;
      if (!tag || !title || !subtext) return;

      const lines = title.querySelectorAll(`.${styles.titleLine}`);

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ── Sem animação ───────────────────────────────────────────────────────
      if (reduced) {
        gsap.set(tag, { opacity: 1, x: 0 });
        if (lines.length) gsap.set(lines, { opacity: 1, clipPath: "inset(0% 0 0 0)" });
        gsap.set(subtext, { opacity: 1, y: 0 });
        return;
      }

      // ── Estados iniciais ───────────────────────────────────────────────────
      gsap.set(tag, { opacity: 0, x: -20 });
      if (lines.length) gsap.set(lines, { opacity: 0, clipPath: "inset(100% 0 0 0)" });
      gsap.set(subtext, { opacity: 0, y: 20 });

      // ── Timeline de entrada ────────────────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.3 });

      // 1. Tag
      tl.to(tag, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" });

      // 2. Título linha por linha com clip-path
      if (lines.length) {
        tl.to(
          lines,
          {
            opacity: 1,
            clipPath: "inset(0% 0 0 0)",
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
          },
          "+=0.1"
        );
      }

      // 3. Subtexto
      tl.to(subtext, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "+=0.1");
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.servicosHero}>
      <div className={styles.inner}>

        {/* Tag de seção */}
        <p ref={tagRef} className={styles.tag}>
          <span className={styles.tagLine} />
          O que eu faço
        </p>

        {/* Título */}
        <h1 ref={titleRef} className={styles.title}>
          <span className={styles.titleLine}>Serviços</span>
          <span className={`${styles.titleLine} ${styles.titleAccent}`}>
            sob medida.
          </span>
        </h1>

        {/* Subtexto */}
        <p ref={subtextRef} className={styles.subtext}>
          Cada projeto começa com entender o seu negócio. O resultado é sempre
          um site que trabalha por você — não só um site bonito.
        </p>

      </div>
    </section>
  );
}
