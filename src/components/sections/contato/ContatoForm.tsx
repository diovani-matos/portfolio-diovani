"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/config";
import styles from "./ContatoForm.module.css";

// ── Tipos ─────────────────────────────────────────────────────────────────────

type Campos = {
  nome: string;
  email: string;
  telefone: string;
  servico: string;
  mensagem: string;
};

type Status = "idle" | "loading" | "success" | "error";
type Erros = Partial<Record<keyof Campos, string>>;

// ── Constantes ────────────────────────────────────────────────────────────────

const CAMPOS_INICIAIS: Campos = {
  nome: "",
  email: "",
  telefone: "",
  servico: "",
  mensagem: "",
};

const ETAPAS = [
  {
    num: "01",
    titulo: "Resposta em até 24h",
    desc: "Analiso sua mensagem e respondo com perguntas para entender melhor o projeto.",
  },
  {
    num: "02",
    titulo: "Briefing e proposta",
    desc: "Fazemos uma conversa rápida e envio uma proposta detalhada com prazo e valor.",
  },
  {
    num: "03",
    titulo: "Início do projeto",
    desc: "Com a proposta aprovada, começamos imediatamente. Você acompanha cada etapa.",
  },
] as const;

// ── Máscara de telefone ────────────────────────────────────────────────────────

function maskTelefone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

// ── Validação ─────────────────────────────────────────────────────────────────

function validar(campos: Campos): Erros {
  const erros: Erros = {};

  if (!campos.nome.trim()) {
    erros.nome = "Nome é obrigatório";
  } else if (campos.nome.trim().length < 2) {
    erros.nome = "Nome muito curto";
  }

  if (!campos.email.trim()) {
    erros.email = "Email é obrigatório";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email)) {
    erros.email = "Email inválido";
  }

  if (!campos.servico) {
    erros.servico = "Selecione um serviço";
  }

  if (!campos.mensagem.trim()) {
    erros.mensagem = "Mensagem é obrigatória";
  } else if (campos.mensagem.trim().length < 20) {
    erros.mensagem = "Mensagem muito curta (mín. 20 caracteres)";
  }

  return erros;
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function ContatoForm() {
  const [campos, setCampos]     = useState<Campos>(CAMPOS_INICIAIS);
  const [status, setStatus]     = useState<Status>("idle");
  const [erros, setErros]       = useState<Erros>({});
  const [honeypot, setHoneypot] = useState("");

  const sectionRef  = useRef<HTMLElement>(null);
  const formColRef  = useRef<HTMLDivElement>(null);
  const stepsRef    = useRef<HTMLDivElement>(null);

  // ── Animação de entrada ────────────────────────────────────────────────────
  useGSAP(
    () => {
      const formCol = formColRef.current;
      const stepsEl = stepsRef.current;
      if (!formCol || !stepsEl) return;

      const steps = stepsEl.querySelectorAll<HTMLElement>(`.${styles.step}`);

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ── Sem animação ─────────────────────────────────────────────────────
      if (reduced) {
        gsap.set(formCol, { opacity: 1, y: 0 });
        if (steps.length) gsap.set(steps, { opacity: 1, x: 0 });
        return;
      }

      // ── Estados iniciais ─────────────────────────────────────────────────
      gsap.set(formCol, { opacity: 0, y: 30 });
      if (steps.length) gsap.set(steps, { opacity: 0, x: 30 });

      const trigger = {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      };

      // Coluna do formulário
      gsap.to(formCol, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: trigger,
      });

      // Etapas do processo com stagger
      if (steps.length) {
        gsap.to(steps, {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: trigger,
        });
      }
    },
    { scope: sectionRef }
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    const parsed = name === "telefone" ? maskTelefone(value) : value;
    setCampos((prev) => ({ ...prev, [name]: parsed }));
  }

  function handleBlur(campo: keyof Campos) {
    const novosErros = validar(campos);
    setErros((prev) => ({
      ...prev,
      [campo]: novosErros[campo] ?? undefined,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Proteção honeypot — se preenchido, é bot
    if (honeypot) return;

    const novosErros = validar(campos);
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setStatus("loading");
    setErros({});

    try {
      const response = await fetch("https://formspree.io/f/mzdwydke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          nome:      campos.nome,
          email:     campos.email,
          telefone:  campos.telefone,
          servico:   campos.servico,
          mensagem:  campos.mensagem,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setTimeout(() => {
          setCampos(CAMPOS_INICIAIS);
          setStatus("idle");
        }, 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  // ── Classe do botão de submit ──────────────────────────────────────────────
  function getSubmitClass(): string {
    if (status === "loading") return `${styles.submitBtn} ${styles.submitLoading}`;
    if (status === "success") return `${styles.submitBtn} ${styles.submitSuccess}`;
    if (status === "error")   return `${styles.submitBtn} ${styles.submitError}`;
    return styles.submitBtn;
  }

  // ── Label do botão de submit ───────────────────────────────────────────────
  function getSubmitLabel(): React.ReactNode {
    if (status === "loading") {
      return (
        <>
          {/* Spinner SVG animado */}
          <svg
            className={styles.spinner}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          Enviando...
        </>
      );
    }
    if (status === "success") return "✓ Mensagem enviada!";
    if (status === "error")   return "Erro ao enviar — tente novamente";
    return "Enviar mensagem";
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section ref={sectionRef} className={styles.contatoForm}>
      <div className={styles.inner}>

        {/* ══ Coluna esquerda — Formulário ═════════════════════════════════ */}
        <div ref={formColRef} className={styles.formCol}>
          <form onSubmit={handleSubmit} noValidate className={styles.form}>

            {/* Honeypot — invisível para humanos, armadilha para bots */}
            <input
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className={styles.honeypot}
            />

            {/* Campo: Nome */}
            <div className={styles.fieldGroup}>
              <label htmlFor="nome" className={styles.label}>
                Nome
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={campos.nome}
                onChange={handleChange}
                onBlur={() => handleBlur("nome")}
                placeholder="Seu nome completo"
                minLength={2}
                className={`${styles.input} ${erros.nome ? styles.inputError : ""}`}
              />
              {erros.nome && (
                <span className={styles.errorMsg} role="alert">
                  {erros.nome}
                </span>
              )}
            </div>

            {/* Campo: Email */}
            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={campos.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                placeholder="seu@email.com"
                className={`${styles.input} ${erros.email ? styles.inputError : ""}`}
              />
              {erros.email && (
                <span className={styles.errorMsg} role="alert">
                  {erros.email}
                </span>
              )}
            </div>

            {/* Campo: Telefone */}
            <div className={styles.fieldGroup}>
              <label htmlFor="telefone" className={styles.label}>
                Telefone{" "}
                <span className={styles.labelOpcional}>(opcional)</span>
              </label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                value={campos.telefone}
                onChange={handleChange}
                placeholder="(48) 9XXXX-XXXX"
                className={styles.input}
              />
            </div>

            {/* Campo: Serviço */}
            <div className={styles.fieldGroup}>
              <label htmlFor="servico" className={styles.label}>
                Serviço de interesse
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="servico"
                  name="servico"
                  value={campos.servico}
                  onChange={handleChange}
                  onBlur={() => handleBlur("servico")}
                  className={`${styles.select} ${erros.servico ? styles.inputError : ""}`}
                >
                  <option value="" disabled>
                    Selecione um serviço
                  </option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="Site Institucional">Site Institucional</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Não sei ainda">Não sei ainda</option>
                </select>
              </div>
              {erros.servico && (
                <span className={styles.errorMsg} role="alert">
                  {erros.servico}
                </span>
              )}
            </div>

            {/* Campo: Mensagem */}
            <div className={styles.fieldGroup}>
              <label htmlFor="mensagem" className={styles.label}>
                Mensagem
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={4}
                value={campos.mensagem}
                onChange={handleChange}
                onBlur={() => handleBlur("mensagem")}
                placeholder="Conte um pouco sobre o projeto..."
                minLength={20}
                className={`${styles.textarea} ${erros.mensagem ? styles.inputError : ""}`}
              />
              {erros.mensagem && (
                <span className={styles.errorMsg} role="alert">
                  {erros.mensagem}
                </span>
              )}
            </div>

            {/* Botão de submit */}
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className={getSubmitClass()}
            >
              {getSubmitLabel()}
            </button>

          </form>
        </div>

        {/* ══ Coluna direita — Próximos passos ═════════════════════════════ */}
        <div className={styles.infoCol}>
          <h2 className={styles.infoTitle}>O que acontece depois?</h2>
          <div ref={stepsRef} className={styles.steps}>
            {ETAPAS.map((etapa) => (
              <div key={etapa.num} className={styles.step}>
                <span className={styles.stepNum} aria-hidden="true">
                  {etapa.num}
                </span>
                <div className={styles.stepContent}>
                  <p className={styles.stepTitle}>{etapa.titulo}</p>
                  <p className={styles.stepDesc}>{etapa.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
