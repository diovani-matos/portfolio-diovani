"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/config";
import styles from "./ContatoHero.module.css";

// TODO: atualizar com email e WhatsApp definitivos após registrar o domínio
const EMAIL      = "matosdiovani@gmail.com";
const WHATSAPP   = "https://wa.me/5551994477827";
const WHATSAPP_DISPLAY = "+55 (51) 99447-7827";

export default function ContatoHero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const tagRef      = useRef<HTMLParagraphElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tag      = tagRef.current;
      const title    = titleRef.current;
      const rightCol = rightColRef.current;
      if (!tag || !title || !rightCol) return;

      const lines = title.querySelectorAll(`.${styles.titleLine}`);

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ── Sem animação ───────────────────────────────────────────────────────
      if (reduced) {
        gsap.set(tag, { opacity: 1, x: 0 });
        if (lines.length) gsap.set(lines, { opacity: 1, clipPath: "inset(0% 0 0 0)" });
        gsap.set(rightCol, { opacity: 1, x: 0 });
        return;
      }

      // ── Estados iniciais ───────────────────────────────────────────────────
      gsap.set(tag,      { opacity: 0, x: -20 });
      gsap.set(rightCol, { opacity: 0, x: 30 });
      if (lines.length) gsap.set(lines, { opacity: 0, clipPath: "inset(100% 0 0 0)" });

      // ── Timeline de entrada ────────────────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.3 });

      // 1. Tag
      tl.to(tag, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" });

      // 2. Título linha por linha — rightCol começa antes do título terminar
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

      // 3. Coluna direita entra junto com o início das linhas do título
      tl.to(
        rightCol,
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        "<0.3"
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.contatoHero}>
      <div className={styles.inner}>

        {/* ══ Lado esquerdo — Título ═══════════════════════════════════════ */}
        <div>
          <p ref={tagRef} className={styles.tag}>
            <span className={styles.tagLine} />
            Contato
          </p>
          <h1 ref={titleRef} className={styles.title}>
            <span className={styles.titleLine}>Vamos criar</span>
            <span className={`${styles.titleLine} ${styles.titleAccent}`}>
              algo juntos.
            </span>
          </h1>
        </div>

        {/* ══ Lado direito — Informações ═══════════════════════════════════ */}
        <div ref={rightColRef} className={styles.rightCol}>
          <div className={styles.contactInfo}>

            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Email</span>
              <a
                href={`mailto:${EMAIL}`}
                className={styles.contactValue}
              >
                {EMAIL}
              </a>
            </div>

            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>WhatsApp</span>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${WHATSAPP_DISPLAY} via WhatsApp — abre em nova aba`}
                className={styles.contactValue}
              >
                {WHATSAPP_DISPLAY}
              </a>
            </div>

            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Localização</span>
              <span className={styles.contactValue}>
                Criciúma, SC — Brasil
              </span>
            </div>

          </div>

          {/* Indicador de disponibilidade */}
          <div className={styles.disponibilidade}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>
              Disponível para novos projetos
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
