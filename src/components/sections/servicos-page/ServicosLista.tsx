"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/config";
import Link from "next/link";
import styles from "./ServicosLista.module.css";

// ── Dados dos serviços ────────────────────────────────────────────────────────

const SERVICOS = [
  {
    numero: "01",
    titulo: "Landing Page",
    prazo: "7 a 14 dias",
    descricao:
      "Página construída para transformar visitantes em clientes. Cada elemento tem uma função — nada está ali por acaso. Estrutura, copy e design alinhados ao seu objetivo.",
    inclui: [
      "Design personalizado para o nicho",
      "Copywriting orientado a conversão",
      "Formulário ou integração WhatsApp",
      "SEO on-page completo",
      "Responsivo para todos os dispositivos",
      "Entrega com código-fonte",
    ],
  },
  {
    numero: "02",
    titulo: "Site Institucional",
    prazo: "14 a 21 dias",
    descricao:
      "Presença digital que transmite autoridade antes de qualquer argumento. Para negócios que precisam de credibilidade como primeiro passo de venda.",
    inclui: [
      "Até 6 páginas personalizadas",
      "Design alinhado à identidade da marca",
      "Blog opcional",
      "Formulário de contato seguro",
      "SEO técnico completo",
      "Painel simples para edição de conteúdo",
    ],
  },
  {
    numero: "03",
    titulo: "E-commerce",
    prazo: "21 a 35 dias",
    descricao:
      "Loja virtual com foco em conversão. Do catálogo ao checkout — cada etapa pensada para reduzir atrito e aumentar vendas.",
    inclui: [
      "Catálogo com variações de produto",
      "Integração com gateway de pagamento",
      "Gestão de estoque e pedidos",
      "Checkout otimizado",
      "SEO para páginas de produto",
      "Painel administrativo",
    ],
  },
] as const;

// ── Componente ────────────────────────────────────────────────────────────────

export default function ServicosLista() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef   = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const inner = innerRef.current;
      if (!inner) return;

      const cards = inner.querySelectorAll<HTMLElement>(`.${styles.card}`);
      if (!cards.length) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ── Sem animação ─────────────────────────────────────────────────────
      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      // ── Estado inicial ───────────────────────────────────────────────────
      gsap.set(cards, { opacity: 0, y: 40 });

      // ── ScrollTrigger: entrada com stagger ───────────────────────────────
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.servicosLista}>
      <div ref={innerRef} className={styles.inner}>
        {SERVICOS.map((servico) => (
          <article key={servico.numero} className={styles.card}>

            {/* ══ Coluna esquerda — Identificação ══════════════════════════ */}
            <div>
              <p className={styles.numero}>{servico.numero}</p>
              <h2 className={styles.titulo}>{servico.titulo}</h2>
              <span className={styles.prazo}>{servico.prazo}</span>
            </div>

            {/* ══ Coluna central — Descrição ════════════════════════════════ */}
            <div>
              <p className={styles.descricao}>{servico.descricao}</p>
              <p className={styles.incluiTitle}>O que inclui:</p>
              <ul className={styles.incluiLista}>
                {servico.inclui.map((item) => (
                  <li key={item} className={styles.incluiItem}>
                    <span className={styles.bullet} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* ══ Coluna direita — CTA ══════════════════════════════════════ */}
            <div className={styles.cardCta}>
              <div>
                <span className={styles.precoLabel}>A partir de</span>
                <span className={styles.precoValor}>Sob consulta</span>
              </div>
              <Link href="/contato" className={styles.btnCta}>
                Solicitar orçamento
              </Link>
            </div>

          </article>
        ))}
      </div>
    </section>
  );
}
