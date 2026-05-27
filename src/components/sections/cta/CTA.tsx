"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";
import styles from "./CTA.module.css";

// TODO: substituir pelo número real no formato 55DDD9XXXXXXXX
const WHATSAPP_HREF =
  "https://wa.me/5551994477827?text=Ol%C3%A1%2C%20Diovani%21%20Vim%20pelo%20seu%20site%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto.";

// TODO: atualizar com o e-mail do domínio definitivo
const EMAIL = "matosdiovani@gmail.com";

export default function CTA() {
  const sectionRef  = useRef<HTMLElement>(null);
  const decoRef     = useRef<HTMLSpanElement>(null);
  const tagRef      = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef  = useRef<HTMLParagraphElement>(null);
  const actionsRef  = useRef<HTMLDivElement>(null);
  const contextRef  = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const deco      = decoRef.current;
      const tag       = tagRef.current;
      const headline  = headlineRef.current;
      const sub       = subtextRef.current;
      const actions   = actionsRef.current;
      const contextEl = contextRef.current;

      if (!deco || !tag || !headline || !sub || !actions || !contextEl) return;

      const lines        = headline.querySelectorAll(`.${styles.headlineLine}`);
      const contextItems = contextEl.querySelectorAll(`.${styles.contextItem}`);

      // Sempre centralizar o deco via GSAP (mantém consistência com o parallax)
      // O CSS já tem transform: translateY(-50%) como fallback pré-JS
      gsap.set(deco, { yPercent: -50, x: 20 });

      // ── Sem animação (prefers-reduced-motion) ─────────────────────────────
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        gsap.set([tag, sub, actions], { opacity: 1, x: 0, y: 0 });
        if (lines) gsap.set(lines, { opacity: 1, clipPath: "inset(0% 0 0 0)" });
        if (contextItems) gsap.set(contextItems, { opacity: 1, y: 0 });
        return;
      }

      // ── Estados iniciais ocultos ──────────────────────────────────────────
      gsap.set(tag, { opacity: 0, x: -20 });
      if (lines) gsap.set(lines, { opacity: 0, clipPath: "inset(100% 0 0 0)" });
      gsap.set(sub, { opacity: 0, y: 20 });
      gsap.set(actions, { opacity: 0, y: 20 });
      if (contextItems) gsap.set(contextItems, { opacity: 0, y: 10 });

      // ── Timeline de entrada ───────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      // 1. Tag de seção
      tl.to(tag, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" });

      // 2. Headline lines com stagger (0.15s após tag)
      if (lines) {
        tl.to(
          lines,
          {
            opacity: 1,
            clipPath: "inset(0% 0 0 0)",
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
          },
          "+=0.15"
        );
      }

      // 3. Subtexto (após última headline line + 0.1s)
      tl.to(
        sub,
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "+=0.1"
      );

      // 4. Grupo de ações (0.1s após subtexto)
      tl.to(
        actions,
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "+=0.1"
      );

      // 5. Itens de contexto (0.1s após grupo de ações)
      if (contextItems) {
        tl.to(
          contextItems,
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power3.out",
          },
          "+=0.1"
        );
      }

      // ── Parallax do elemento decorativo "DM" (ScrollTrigger separado) ─────
      // Anima translateX: 20px → -20px ao longo de todo o scroll da seção
      gsap.fromTo(
        deco,
        { x: 20 },
        {
          x: -20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      return () => {
        // useGSAP context reverte tweens e ScrollTriggers automaticamente
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.cta}>
      <div className={styles.inner}>

        {/* ── Elemento decorativo tipográfico ── */}
        <span ref={decoRef} aria-hidden="true" className={styles.deco}>
          DM
        </span>

        {/* ── Tag de seção ── */}
        <p ref={tagRef} className={styles.tag}>
          <span className={styles.tagLine} />
          05 — Contato
        </p>

        {/* ── Headline principal ── */}
        <h2 ref={headlineRef} className={styles.headline}>
          <span className={styles.headlineLine}>Tem um projeto</span>
          <span className={styles.headlineLine}>em mente?</span>
          <span className={`${styles.headlineLine} ${styles.headlineAccent}`}>
            Vamos conversar.
          </span>
        </h2>

        {/* ── Subtexto ── */}
        <p ref={subtextRef} className={styles.subtext}>
          Respondo em até 24 horas.
        </p>

        {/* ── Grupo de ações ── */}
        <div ref={actionsRef} className={styles.actions}>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chamar no WhatsApp — abre em nova aba"
            className={styles.btnWhatsapp}
          >
            {/* WhatsApp SVG oficial — 18×18, currentColor */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chamar no WhatsApp
          </a>

          <a href={`mailto:${EMAIL}`} className={styles.emailLink}>
            {EMAIL}
          </a>
        </div>

        {/* ── Linha inferior de contexto ── */}
        <div ref={contextRef} className={styles.context}>
          <span className={styles.contextItem}>
            <span aria-hidden="true">✦</span>
            Resposta em 24h
          </span>
          <span className={styles.contextItem}>
            <span aria-hidden="true">✦</span>
            Orçamento sem compromisso
          </span>
          <span className={styles.contextItem}>
            <span aria-hidden="true">✦</span>
            Criciúma, SC — atendo todo o Brasil
          </span>
        </div>

      </div>
    </section>
  );
}
