"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/config";
import styles from "./ServicosFAQ.module.css";

// ── Dados das perguntas ───────────────────────────────────────────────────────

const FAQ = [
  {
    pergunta: "Você faz sites para qualquer nicho?",
    resposta:
      "Sim. Já desenvolvi projetos para saúde, varejo, serviços profissionais e outros segmentos. O processo começa sempre entendendo o negócio e o público-alvo.",
  },
  {
    pergunta: "Como funciona o processo de desenvolvimento?",
    resposta:
      "Começa com um briefing detalhado para entender seus objetivos. Depois apresento a estrutura e o design para aprovação. Só após sua aprovação o desenvolvimento começa. Você acompanha cada etapa.",
  },
  {
    pergunta: "Preciso ter domínio e hospedagem?",
    resposta:
      "Não necessariamente. Posso indicar e configurar tudo para você. O custo de domínio e hospedagem é separado do desenvolvimento e fica no seu nome.",
  },
  {
    pergunta: "Quanto tempo leva para ficar pronto?",
    resposta:
      "Depende do projeto. Landing pages entre 7 e 14 dias, sites institucionais entre 14 e 21 dias e e-commerces entre 21 e 35 dias. Prazos definidos no contrato.",
  },
  {
    pergunta: "Tem suporte após a entrega?",
    resposta:
      "Sim. Ofereço suporte de 24 horas após a entrega para ajustes e correções. Para manutenção contínua, temos planos mensais disponíveis.",
  },
] as const;

// ── Componente ────────────────────────────────────────────────────────────────

export default function ServicosFAQ() {
  const [aberto, setAberto] = useState<number | null>(null);

  const sectionRef  = useRef<HTMLElement>(null);
  const leftColRef  = useRef<HTMLDivElement>(null);
  const faqListRef  = useRef<HTMLDivElement>(null);

  // ── Toggle do accordion ───────────────────────────────────────────────────
  function toggleItem(index: number) {
    setAberto((prev) => (prev === index ? null : index));
  }

  // ── Animação de entrada via ScrollTrigger ─────────────────────────────────
  useGSAP(
    () => {
      const leftCol = leftColRef.current;
      const faqList = faqListRef.current;
      if (!leftCol || !faqList) return;

      const items = faqList.querySelectorAll<HTMLElement>(`.${styles.faqItem}`);

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ── Sem animação ─────────────────────────────────────────────────────
      if (reduced) {
        gsap.set(leftCol, { opacity: 1, x: 0 });
        if (items.length) gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      // ── Estados iniciais ─────────────────────────────────────────────────
      gsap.set(leftCol, { opacity: 0, x: -30 });
      if (items.length) gsap.set(items, { opacity: 0, y: 20 });

      // ── ScrollTrigger ─────────────────────────────────────────────────────
      const trigger = {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none none",
      };

      // Coluna esquerda
      gsap.to(leftCol, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: trigger,
      });

      // Itens do accordion com stagger
      if (items.length) {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: trigger,
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.servicosFaq}>
      <div className={styles.inner}>

        {/* ══ Coluna esquerda — Título ══════════════════════════════════════ */}
        <div ref={leftColRef}>
          <p className={styles.tag}>
            <span className={styles.tagLine} />
            Dúvidas frequentes
          </p>
          <h2 className={styles.title}>Perguntas &amp; respostas</h2>
          <p className={styles.subtitle}>Não encontrou o que procurava?</p>
          <Link href="/contato" className={styles.faqLink}>
            Fale comigo →
          </Link>
        </div>

        {/* ══ Coluna direita — Accordion ═══════════════════════════════════ */}
        <div ref={faqListRef} className={styles.faqList}>
          {FAQ.map((item, index) => (
            <div key={index} className={styles.faqItem}>

              {/* Botão da pergunta */}
              <button
                className={styles.faqBtn}
                onClick={() => toggleItem(index)}
                aria-expanded={aberto === index}
              >
                <span>{item.pergunta}</span>
                <span className={styles.faqIcon} aria-hidden="true">
                  {aberto === index ? "−" : "+"}
                </span>
              </button>

              {/* Resposta com transição CSS (max-height) */}
              <div
                className={`${styles.answer} ${
                  aberto === index ? styles.answerOpen : ""
                }`}
                role="region"
                aria-hidden={aberto !== index}
              >
                <p className={styles.answerText}>{item.resposta}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
