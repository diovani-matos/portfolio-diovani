import type { Metadata } from "next";
import Hero from "@/components/sections/hero/Hero";
import Servicos from "@/components/sections/servicos/Servicos";
import ScrollCamera from "@/components/sections/scroll-camera/ScrollCamera";
import Numeros from "@/components/sections/numeros/Numeros";
import CTA from "@/components/sections/cta/CTA";

export const metadata: Metadata = {
  // absolute bypassa o template "%s | Diovani Matos" do layout.tsx
  title: { absolute: "Diovani Matos — Desenvolvedor Web" },
  description:
    "Especialista em landing pages de alta conversão, sites institucionais e e-commerce em Criciúma, SC.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Servicos />
      <ScrollCamera
        card1={{
          src: "/images/projects/projeto-4.jpg",
          alt: "Landing page de produto premium Apex Ultra",
          title: "Apex Ultra",
          url: "https://apexultra.vercel.app",
        }}
        card2={{
          src: "/images/projects/projeto-3.jpg",
          alt: "Site para agência de marketing Nero Studio",
          title: "Nero Studio",
          url: "https://nero-studio.vercel.app",
        }}
        card3={{
          src: "/images/projects/projeto-2.jpg",
          alt: "E-commerce de produtos artesanais",
          title: "Ateliê Terra",
          url: "https://atelieterra.vercel.app/",
        }}
      />
      <Numeros />
      <CTA />
    </>
  );
}
