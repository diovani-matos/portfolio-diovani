"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/config";
import Image from "next/image";
import styles from "./ProjetosGrid.module.css";

// ── Tipo exportado para uso em page.tsx e ProjetosPage.tsx ────────────────────

export type Projeto = {
  id: number;
  titulo: string;
  categoria: string;
  descricao: string;
  src: string;
  alt: string;
  tags: string[];
  url: string;
  destaque: boolean;
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  projetos: Projeto[];
  filtroAtivo: string;
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function ProjetosGrid({ projetos, filtroAtivo }: Props) {
  const [displayed, setDisplayed] = useState<Projeto[]>(projetos);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  // Controla se a animação inicial já foi concluída (libera transições de filtro)
  const readyRef = useRef(false);

  // Guards para pular o primeiro disparo de cada useEffect
  const filterMountedRef    = useRef(false);
  const displayedMountedRef = useRef(false);

  // ── Animação inicial de entrada ──────────────────────────────────────────
  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      const cards = grid.querySelectorAll<HTMLElement>(`.${styles.card}`);
      if (!cards.length) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0 });
        readyRef.current = true;
        return;
      }

      gsap.set(cards, { opacity: 0, y: 40 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.3,
        onComplete: () => {
          readyRef.current = true;
        },
      });
    },
    { scope: sectionRef }
  );

  // ── Saída ao trocar filtro → atualiza displayed ───────────────────────────
  useEffect(() => {
    if (!filterMountedRef.current) {
      filterMountedRef.current = true;
      return;
    }

    const grid = gridRef.current;

    if (!grid || !readyRef.current) {
      setDisplayed(projetos);
      return;
    }

    const cards = Array.from(
      grid.querySelectorAll<HTMLElement>(`.${styles.card}`)
    );
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced || !cards.length) {
      setDisplayed(projetos);
      return;
    }

    gsap.killTweensOf(cards);
    gsap.to(cards, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power3.out",
      stagger: 0.04,
      onComplete: () => setDisplayed(projetos),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroAtivo]);

  // ── Entrada após o React renderizar os novos cards ────────────────────────
  useEffect(() => {
    if (!displayedMountedRef.current) {
      displayedMountedRef.current = true;
      return;
    }

    const grid = gridRef.current;
    if (!grid) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const cards = grid.querySelectorAll<HTMLElement>(`.${styles.card}`);
        if (!cards.length) return;

        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduced) {
          gsap.set(cards, { opacity: 1, y: 0 });
          return;
        }

        gsap.killTweensOf(cards);
        gsap.set(cards, { opacity: 0, y: 40 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
        });
      });
    });
  }, [displayed]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section ref={sectionRef} className={styles.projetos}>
      <div className={styles.inner}>
        {displayed.length === 0 ? (
          <p className={styles.empty}>Nenhum projeto nessa categoria ainda.</p>
        ) : (
          <div ref={gridRef} className={styles.grid}>
            {displayed.map((projeto) => (
              <a
                key={projeto.id}
                href={projeto.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver projeto ${projeto.titulo} — abre em nova aba`}
                className={styles.card}
              >
                {/* ── Imagem ── */}
                <div className={styles.imageWrapper}>
                  <Image
                    src={projeto.src}
                    alt={projeto.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.image}
                  />
                  <div className={styles.imageOverlay} aria-hidden="true" />
                </div>

                {/* ── Corpo ── */}
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.categoria}>{projeto.categoria}</span>
                    <div className={styles.tags}>
                      {projeto.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h2 className={styles.titulo}>{projeto.titulo}</h2>
                  <p className={styles.descricao}>{projeto.descricao}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
