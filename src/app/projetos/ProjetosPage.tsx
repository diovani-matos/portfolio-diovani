"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/config";
import ProjetosGrid from "@/components/sections/projetos/ProjetosGrid";
import type { Projeto } from "@/components/sections/projetos/ProjetosGrid";
import styles from "./ProjetosPage.module.css";

// ── Filtros disponíveis ───────────────────────────────────────────────────────

const FILTROS = ["Todos", "Landing Page", "E-commerce", "Site Institucional"] as const;

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  projetos: Projeto[];
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function ProjetosPage({ projetos }: Props) {
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");

  const sectionRef  = useRef<HTMLElement>(null);
  const tagRef      = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const filtrosRef  = useRef<HTMLDivElement>(null);

  const projetosFiltrados =
    filtroAtivo === "Todos"
      ? projetos
      : projetos.filter((p) => p.categoria === filtroAtivo);

  // ── Animação de entrada do hero ───────────────────────────────────────────
  useGSAP(
    () => {
      const tag      = tagRef.current;
      const headline = headlineRef.current;
      const filtros  = filtrosRef.current;

      if (!tag || !headline || !filtros) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduced) {
        gsap.set([tag, headline, filtros], { opacity: 1, x: 0, y: 0 });
        return;
      }

      gsap.set(tag,      { opacity: 0, x: -20 });
      gsap.set(headline, { opacity: 0, y: 40 });
      gsap.set(filtros,  { opacity: 0, y: 20 });

      const tl = gsap.timeline({ delay: 0.15 });

      tl.to(tag,      { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" })
        .to(headline, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "+=0.1")
        .to(filtros,  { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "+=0.1");
    },
    { scope: sectionRef }
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Hero da página ── */}
      <section ref={sectionRef} className={styles.hero}>
        <div className={styles.heroInner}>

          <p ref={tagRef} className={styles.tag}>
            <span className={styles.tagLine} />
            Projetos
          </p>

          <h1 ref={headlineRef} className={styles.headline}>
            Trabalhos
            <br />
            <span className={styles.headlineAccent}>realizados.</span>
          </h1>

        </div>
      </section>

      {/* ── Barra de filtros (sticky abaixo do header) ── */}
      <div className={styles.filtrosWrapper}>
        <div className={styles.filtrosInner}>
          <div ref={filtrosRef} className={styles.filtros}>
            {FILTROS.map((filtro) => (
              <button
                key={filtro}
                className={`${styles.filtroBtn} ${
                  filtroAtivo === filtro ? styles.filtroBtnAtivo : ""
                }`}
                onClick={() => setFiltroAtivo(filtro)}
              >
                {filtro}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid de projetos com animação de filtro ── */}
      <ProjetosGrid projetos={projetosFiltrados} filtroAtivo={filtroAtivo} />
    </>
  );
}
