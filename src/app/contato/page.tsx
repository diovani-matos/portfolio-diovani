import type { Metadata } from "next";
import ContatoHero from "@/components/sections/contato/ContatoHero";
import ContatoForm from "@/components/sections/contato/ContatoForm";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com Diovani Matos. Orçamento para landing page, site institucional ou e-commerce. Criciúma, SC — atendo todo o Brasil.",
  alternates: {
    canonical: "/contato",
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      <ContatoHero />
      <ContatoForm />
    </>
  );
}
