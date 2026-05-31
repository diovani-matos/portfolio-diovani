import type { Metadata } from "next";
import ProjetosPage from "./ProjetosPage";
import type { Projeto } from "@/components/sections/projetos/ProjetosGrid";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Projetos desenvolvidos por Diovani Matos — landing pages, sites institucionais e e-commerce em Criciúma, SC.",
  alternates: {
    canonical: "/projetos",
  },
};

// ── Dados dos projetos ────────────────────────────────────────────────────────
// Adicione novos projetos aqui. O grid e os filtros atualizam automaticamente.

const projetos: Projeto[] = [
  {
    id: 0,
    titulo: "Apex Ultra",
    categoria: "Landing Page",
    descricao:
      "Landing page premium para notebook ultrafino fictício. Animações cinematográficas com GSAP, ScrollCamera, contadores animados, scroll suave com Lenis e design dark de alto impacto.",
    src: "/images/projects/projeto-4.jpg",
    alt: "Landing page de produto premium Apex Ultra",
    tags: ["Next.js", "GSAP", "CSS Modules", "Lenis"],
    url: "https://apexultra.vercel.app",
    destaque: true,
  },
  {
    id: 1,
    titulo: "Nutricionista",
    categoria: "Landing Page",
    descricao:
      "Landing page de alta conversão para consultório de nutrição. Foco em agendamento de consultas e captação de leads.",
    src: "/images/projects/projeto-1.jpg",
    alt: "Landing page para nutricionista",
    tags: ["Next.js", "Tailwind", "SEO"],
    url: "https://nutricionista-ivory.vercel.app/",
    destaque: true,
  },
  {
    id: 2,
    titulo: "Ateliê Terra",
    categoria: "E-commerce",
    descricao:
      "Loja virtual de produtos artesanais com catálogo, carrinho e checkout. Foco em experiência de compra e conversão.",
    src: "/images/projects/projeto-2.jpg",
    alt: "E-commerce de produtos artesanais",
    tags: ["Next.js", "Supabase", "E-commerce"],
    url: "https://atelieterra.vercel.app/",
    destaque: true,
  },
  {
    id: 3,
    titulo: "Nero Studio",
    categoria: "Site Institucional",
    descricao:
      "Site institucional para agência de marketing digital com animações cinematográficas, GSAP, Lenis e design premium dark.",
    src: "/images/projects/projeto-3.jpg",
    alt: "Site para agência de marketing Nero Studio",
    tags: ["Next.js", "GSAP", "CSS Modules"],
    url: "https://nero-studio.vercel.app",
    destaque: true,
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  return <ProjetosPage projetos={projetos} />;
}
