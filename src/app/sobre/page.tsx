import type { Metadata } from "next";
import SobreHero from "@/components/sections/sobre/SobreHero";
import SobreStack from "@/components/sections/sobre/SobreStack";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça Diovani Matos, desenvolvedor web especialista em landing pages, sites institucionais e e-commerce.",
  alternates: {
    canonical: "/sobre",
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      <SobreHero />
      <SobreStack />
    </>
  );
}
