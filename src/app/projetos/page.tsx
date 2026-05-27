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
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  return <ProjetosPage projetos={projetos} />;
}
