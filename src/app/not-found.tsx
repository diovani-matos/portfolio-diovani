"use client";

// Metadata não pode ser exportada de Client Components.
// O título da aba é herdado do template no layout.tsx:
// template: "%s | Diovani Matos" → "404 | Diovani Matos" via Next.js

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/config";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const decoRef      = useRef<HTMLSpanElement>(null);
  const tagRef       = useRef<HTMLParagraphElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const subtextRef   = useRef<HTMLParagraphElement>(null);
  const actionsRef   = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const deco    = decoRef.current;
      const tag     = tagRef.current;
      const title   = titleRef.current;
      const subtext = subtextRef.current;
      const actions = actionsRef.current;

      if (!deco || !tag || !title || !subtext || !actions) return;

      const lines = title.querySelectorAll(`.${styles.titleLine}`);

      // Centraliza o deco via yPercent — mantém consistência com os tweens de y.
      // CSS tem transform: translateY(-50%) como fallback pré-JS.
      gsap.set(deco, { yPercent: -50, opacity: 0 });

      // ── Sem animação (prefers-reduced-motion) ─────────────────────────────
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduced) {
        gsap.set(tag,     { opacity: 1, x: 0 });
        gsap.set(subtext, { opacity: 1, y: 0 });
        gsap.set(actions, { opacity: 1, y: 0 });
        gsap.set(deco,    { yPercent: -50, opacity: 0.3 });
        if (lines.length) gsap.set(lines, { opacity: 1, clipPath: "inset(0% 0 0 0)" });
        return;
      }

      // ── Estados iniciais ocultos ──────────────────────────────────────────
      gsap.set(tag,     { opacity: 0, x: -20 });
      gsap.set(subtext, { opacity: 0, y: 20 });
      gsap.set(actions, { opacity: 0, y: 20 });
      if (lines.length) gsap.set(lines, { opacity: 0, clipPath: "inset(100% 0 0 0)" });

      // ── Timeline de entrada ───────────────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.2 });

      // 1. Tag de seção
      tl.to(tag, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" });

      // 2. Linhas do título com clip-path
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

      // 404 decorativo entra em paralelo com o início do título
      tl.to(deco, { opacity: 0.3, duration: 1.2, ease: "power3.out" }, "<");

      // 3. Subtexto
      tl.to(subtext, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });

      // 4. Grupo de ações
      tl.to(actions, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });

      // ── Float infinito do 404 (inicia após a entrada) ─────────────────────
      // yPercent: -50 já está definido — o y adicional soma ao transform
      gsap.to(deco, {
        y: -15,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.5,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={styles.container}>

      {/*
        404 decorativo como <span> real (não ::before).
        GSAP não consegue animar pseudo-elementos — precisa de ref ao DOM.
      */}
      <span ref={decoRef} aria-hidden="true" className={styles.deco}>
        404
      </span>

      {/* Conteúdo principal — z-index 1, acima do deco */}
      <div className={styles.content}>

        {/* Tag */}
        <p ref={tagRef} className={styles.tag}>
          <span className={styles.tagLine} />
          Erro 404
        </p>

        {/* Título */}
        <h1 ref={titleRef} className={styles.title}>
          <span className={styles.titleLine}>Página não</span>
          <span className={styles.titleLine}>encontrada.</span>
        </h1>

        {/* Subtexto */}
        <p ref={subtextRef} className={styles.subtext}>
          Essa página não existe ou foi removida.
        </p>

        {/* Ações */}
        <div ref={actionsRef} className={styles.actions}>
          <Link href="/" className={styles.btnPrimary}>
            Voltar para o início
          </Link>
          <Link href="/projetos" className={styles.linkSecondary}>
            Ver projetos →
          </Link>
        </div>

      </div>
    </div>
  );
}
