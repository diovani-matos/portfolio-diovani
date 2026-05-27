"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";
import styles from "./Hero.module.css";

const LINE_1 = ["Sites", "que", "vendem."];
const LINE_2 = ["Design", "que", "impõe."];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const tag = tagRef.current;
      const words1 = line1Ref.current?.querySelectorAll(`.${styles.word}`);
      const words2 = line2Ref.current?.querySelectorAll(`.${styles.word}`);
      const sub = subRef.current;
      const ctaBtns = ctaRef.current
        ? Array.from(ctaRef.current.children)
        : [];
      const scrollEl = scrollRef.current;

      if (!tag || !sub || !scrollEl) return;

      if (prefersReduced) {
        gsap.set([tag, sub, scrollEl, ...ctaBtns], {
          opacity: 1,
          x: 0,
          y: 0,
        });
        if (words1) gsap.set(words1, { opacity: 1, clipPath: "inset(0% 0 0 0)" });
        if (words2) gsap.set(words2, { opacity: 1, clipPath: "inset(0% 0 0 0)" });
        return;
      }

      // Estados iniciais ocultos
      gsap.set(tag, { opacity: 0, x: -20 });
      if (words1) gsap.set(words1, { opacity: 0, clipPath: "inset(100% 0 0 0)" });
      if (words2) gsap.set(words2, { opacity: 0, clipPath: "inset(100% 0 0 0)" });
      gsap.set(sub, { opacity: 0, y: 30 });
      gsap.set(ctaBtns, { opacity: 0, y: 20 });
      gsap.set(scrollEl, { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.4 });

      // 1. Tag de apresentação
      tl.to(tag, {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      // 2. Palavras da headline — linha 1
      if (words1) {
        tl.to(words1, {
          opacity: 1,
          clipPath: "inset(0% 0 0 0)",
          stagger: 0.08,
          duration: 0.9,
          ease: "power3.out",
        });
      }

      // 3. Palavras da headline — linha 2 (overlap de 0.2s com linha 1)
      if (words2) {
        tl.to(
          words2,
          {
            opacity: 1,
            clipPath: "inset(0% 0 0 0)",
            stagger: 0.08,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.2"
        );
      }

      // 4. Sub-headline (0.15s após a última word)
      tl.to(
        sub,
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "+=0.15"
      );

      // 5. Botões CTA
      tl.to(ctaBtns, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
      });

      // 6. Scroll indicator: entrada + pulso infinito
      tl.to(scrollEl, { opacity: 1, duration: 0.5 }).call(() => {
        gsap.fromTo(
          scrollEl,
          { opacity: 0.8 },
          {
            opacity: 0.3,
            duration: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }
        );
      });

      // ScrollTrigger separado: scroll indicator some ao rolar
      ScrollTrigger.create({
        id: "hero-scroll-fade",
        trigger: sectionRef.current,
        start: "top top",
        end: "150px top",
        scrub: 1,
        animation: gsap.to(scrollEl, { opacity: 0, ease: "none" }),
      });

      return () => {
        ScrollTrigger.getById("hero-scroll-fade")?.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.content}>
        <p ref={tagRef} className={styles.tag}>
          <span className={styles.tagLine} />
          Desenvolvedor Web — Aumente sua presença online
        </p>

        <h1 className={styles.headline}>
          <span ref={line1Ref} className={styles.line}>
            {LINE_1.map((word) => (
              <span key={word} className={styles.word}>
                {word}
              </span>
            ))}
          </span>
          <span ref={line2Ref} className={styles.line}>
            {LINE_2.map((word) => (
              <span key={word} className={styles.word}>
                {word}
              </span>
            ))}
          </span>
        </h1>

        <p ref={subRef} className={styles.sub}>
          Landing pages, sites institucionais e e-commerce para negócios que
          levam o digital a sério.
        </p>

        <div ref={ctaRef} className={styles.cta}>
          <Link href="/projetos" className={styles.btnPrimary}>
            Ver projetos
          </Link>
          <Link href="/contato" className={styles.btnSecondary}>
            Entrar em contato
          </Link>
        </div>
      </div>

      <div ref={scrollRef} className={styles.scrollIndicator}>
        <span className={styles.scrollText}>scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}
