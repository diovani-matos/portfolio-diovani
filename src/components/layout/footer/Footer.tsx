"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";
import { useLenis } from "@/lib/lenis/provider";
import styles from "./Footer.module.css";

// ── Dados ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home",     href: "/"         },
  { label: "Projetos", href: "/projetos" },
  { label: "Serviços", href: "/servicos" },
  { label: "Sobre",    href: "/sobre"    },
  { label: "Contato",  href: "/contato"  },
] as const;

// Calculado uma vez ao importar o módulo — safe em client component
const YEAR = new Date().getFullYear();

// ── Componente ────────────────────────────────────────────────────────────────

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const topRef    = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const lenis    = useLenis();

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (pathname === href && lenis) {
      e.preventDefault();
      lenis.scrollTo(0, { duration: 1.5 });
    }
  };

  // ── Animação de entrada via ScrollTrigger ─────────────────────────────────
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const top    = topRef.current;
      const bottom = bottomRef.current;
      if (!top || !bottom) return;

      // Estado inicial — invisível antes de entrar na viewport
      gsap.set(top,    { opacity: 0, y: 20 });
      gsap.set(bottom, { opacity: 0 });

      // Dispara uma única vez quando o footer entra na viewport
      ScrollTrigger.create({
        trigger: footerRef.current,
        start:   "top 90%",
        once:    true,
        onEnter: () => {
          // Linha superior: move de baixo para cima + fade in
          gsap.to(top, {
            opacity:  1,
            y:        0,
            duration: 0.7,
            ease:     "power3.out",
          });
          // Linha inferior: apenas fade in, com leve delay
          gsap.to(bottom, {
            opacity:  1,
            duration: 0.5,
            delay:    0.2,
            ease:     "power3.out",
          });
        },
      });
    },
    { scope: footerRef }
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <footer ref={footerRef} className={styles.footer}>

      {/* ── Linha superior: três colunas ─────────────────────────────────── */}
      <div ref={topRef} className={styles.top}>

        {/* Coluna esquerda — Logo + tagline */}
        <div className={styles.colLeft}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="Diovani Matos — página inicial"
          >
            D<span className={styles.logoAccent}>M</span>
          </Link>
          <p className={styles.tagline}>Desenvolvedor web — Criciúma, SC</p>
        </div>

        {/* Coluna central — Navegação */}
        <div className={styles.colCenter}>
          <p className={styles.colTitle}>Navegação</p>
          <ul className={styles.navList}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={styles.navLink}
                  onClick={(e) => handleNavClick(href, e)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna direita — Contato + redes sociais */}
        <div className={styles.colRight}>
          <p className={styles.colTitle}>Contato</p>
          <a
            href="mailto:matosdiovani@gmail.com"
            className={styles.emailLink}
          >
            matosdiovani@gmail.com
          </a>

          <ul className={styles.socialList}>
            {/* Instagram */}
            <li>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Diovani Matos — abre em nova aba"
                className={styles.socialLink}
              >
                {/*
                  SVG estilizado via CSS (currentColor herda de .socialLink).
                  Nenhum valor de cor hardcoded nos atributos HTML.
                */}
                <svg
                  className={styles.socialIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  aria-hidden="true"
                  focusable="false"
                >
                  <rect x="2" y="2" width="20" height="20" rx="4" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
            </li>

            {/* LinkedIn */}
            <li>
              <a
                href="https://linkedin.com/in/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de Diovani Matos — abre em nova aba"
                className={styles.socialLink}
              >
                <svg
                  className={styles.socialIcon}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Linha inferior: copyright + crédito ──────────────────────────── */}
      <div ref={bottomRef} className={styles.bottom}>
        <p className={styles.copyright}>
          © {YEAR} Diovani Matos. Todos os direitos reservados.
        </p>
      </div>

    </footer>
  );
}
