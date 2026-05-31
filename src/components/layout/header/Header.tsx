"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";
import { useLenis } from "@/lib/lenis/provider";
import styles from "./Header.module.css";

// ── Dados de navegação ────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home",     href: "/"         },
  { label: "Projetos", href: "/projetos" },
  { label: "Serviços", href: "/servicos" },
  { label: "Sobre",    href: "/sobre"    },
  { label: "Contato",  href: "/contato"  },
] as const;

// ── Componente ────────────────────────────────────────────────────────────────

export default function Header() {
  const headerRef     = useRef<HTMLElement>(null);
  const logoRef       = useRef<HTMLAnchorElement>(null);
  const navRef        = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileListRef = useRef<HTMLUListElement>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const lenis    = useLenis();

  // ── Fecha menu ao trocar de rota ──────────────────────────────────────────
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ── Body overflow quando menu mobile está aberto ──────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ── Animação de entrada + detecção de scroll ──────────────────────────────
  // Cleanup automático pelo contexto useGSAP no unmount
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Scroll detection via ScrollTrigger — NUNCA window.addEventListener
      // start: "top+=80 top" → dispara quando body.top+80px atinge
      //   o topo do viewport, ou seja, quando scrollY = 80px
      ScrollTrigger.create({
        trigger: document.body,
        start: "top+=80 top",
        onEnter:     () => headerRef.current?.classList.add(styles.scrolled),
        onLeaveBack: () => headerRef.current?.classList.remove(styles.scrolled),
      });

      // Se preferir movimento reduzido: elementos já visíveis, sem animar
      if (prefersReducedMotion) return;

      const logo     = logoRef.current;
      const navLinks = navRef.current?.querySelectorAll("a");

      // Estado inicial (invisível, deslocado)
      if (logo)              gsap.set(logo, { opacity: 0, y: -20 });
      if (navLinks?.length)  gsap.set(navLinks, { opacity: 0, y: -20 });

      // Anima logo
      if (logo) {
        gsap.to(logo, {
          opacity:  1,
          y:        0,
          duration: 0.7,
          delay:    0.3,
          ease:     "power3.out",
        });
      }

      // Anima links com stagger
      if (navLinks?.length) {
        gsap.to(navLinks, {
          opacity:  1,
          y:        0,
          duration: 0.6,
          delay:    0.3,
          stagger:  0.08,
          ease:     "power3.out",
        });
      }
    },
    { scope: headerRef }
  );

  // ── Animação do menu mobile ───────────────────────────────────────────────
  // Re-executa quando mobileOpen muda; contexto anterior é revertido
  // automaticamente pelo useGSAP antes de cada re-run
  useGSAP(
    () => {
      if (!mobileOpen || !mobileListRef.current) return;

      const items = mobileListRef.current.querySelectorAll("li");

      // Estado inicial dos itens para a animação
      gsap.set(items, { opacity: 0, y: 30 });

      gsap.to(items, {
        opacity:  1,
        y:        0,
        duration: 0.5,
        stagger:  0.06,
        ease:     "power3.out",
      });
    },
    { dependencies: [mobileOpen] }
  );

  // ── Handler de clique em links ────────────────────────────────────────────
  // Âncoras (#section) → scroll suave via Lenis
  // Links de página → Next.js router (comportamento padrão)
  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href.startsWith("#") && lenis) {
      e.preventDefault();
      lenis.scrollTo(href);
    } else if (pathname === href && lenis) {
      e.preventDefault();
      lenis.scrollTo(0, { duration: 1.5 });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <header ref={headerRef} className={styles.header}>
        {/* Logo */}
        <Link
          ref={logoRef}
          href="/"
          className={styles.logo}
          aria-label="Diovani Matos — página inicial"
        >
          D<span className={styles.logoAccent}>M</span>
        </Link>

        {/* Navegação desktop */}
        <nav
          ref={navRef}
          className={styles.nav}
          aria-label="Navegação principal"
        >
          <ul className={styles.navList}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={
                    pathname === href
                      ? `${styles.navLink} ${styles.navLinkActive}`
                      : styles.navLink
                  }
                  onClick={(e) => handleLinkClick(href, e)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Toggle hamburger / fechar — somente mobile */}
        <button
          className={`${styles.menuToggle} ${mobileOpen ? styles.menuToggleClose : ""}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span className={styles.toggleLine} />
          <span className={styles.toggleLine} />
        </button>
      </header>

      {/* Menu fullscreen mobile — irmão do header no DOM */}
      {/* z-index 99: header (z-index 100) sobrepõe o topo do menu,     */}
      {/* mostrando logo + botão X enquanto o conteúdo preenche o resto */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!mobileOpen}
        className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ""}`}
      >
        <ul ref={mobileListRef} className={styles.mobileNavList}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={styles.mobileNavLink}
                tabIndex={mobileOpen ? 0 : -1}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
