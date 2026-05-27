import type { Metadata } from "next";
import ServicosHero from "@/components/sections/servicos-page/ServicosHero";
import ServicosLista from "@/components/sections/servicos-page/ServicosLista";
import ServicosFAQ from "@/components/sections/servicos-page/ServicosFAQ";

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Landing pages de alta conversão, sites institucionais e e-commerce desenvolvidos por Diovani Matos. Criciúma, SC — atendo todo o Brasil.",
  alternates: {
    canonical: "/servicos",
  },
};

// ── Schema.org FAQ (JSON-LD) ──────────────────────────────────────────────────

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Você faz sites para qualquer nicho?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Já desenvolvi projetos para saúde, varejo, serviços profissionais e outros segmentos. O processo começa sempre entendendo o negócio e o público-alvo.",
      },
    },
    {
      "@type": "Question",
      name: "Como funciona o processo de desenvolvimento?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Começa com um briefing detalhado para entender seus objetivos. Depois apresento a estrutura e o design para aprovação. Só após sua aprovação o desenvolvimento começa. Você acompanha cada etapa.",
      },
    },
    {
      "@type": "Question",
      name: "Preciso ter domínio e hospedagem?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não necessariamente. Posso indicar e configurar tudo para você. O custo de domínio e hospedagem é separado do desenvolvimento e fica no seu nome.",
      },
    },
    {
      "@type": "Question",
      name: "Quanto tempo leva para ficar pronto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende do projeto. Landing pages entre 7 e 14 dias, sites institucionais entre 14 e 21 dias e e-commerces entre 21 e 35 dias. Prazos definidos no contrato.",
      },
    },
    {
      "@type": "Question",
      name: "Tem suporte após a entrega?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Ofereço suporte de 24 horas após a entrega para ajustes e correções. Para manutenção contínua, temos planos mensais disponíveis.",
      },
    },
  ],
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      {/* Schema.org FAQPage para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ServicosHero />
      <ServicosLista />
      <ServicosFAQ />
    </>
  );
}
