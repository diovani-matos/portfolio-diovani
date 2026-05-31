import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import LenisProvider from "@/lib/lenis/provider";
import ScrollToTop from "@/components/ui/scroll-to-top/ScrollToTop";
// Side-effect import: garante que os plugins GSAP (ScrollTrigger,
// ScrollToPlugin, useGSAP) são registrados antes de qualquer componente
// cliente ser hidratado. GSAP é SSR-safe e não acessa o DOM na importação.
import "@/lib/gsap/config";
import "./globals.css";

// ── Fontes ────────────────────────────────────────────────────────────────────
// Nunca via @import ou CDN — sempre next/font (CLAUDE.md)

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

// ── Viewport ──────────────────────────────────────────────────────────────────
// Exportado separadamente de metadata — requisito do Next.js 15

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// ── Schema.org JSON-LD ────────────────────────────────────────────────────────
// Person + LocalBusiness conforme CLAUDE.md (Criciúma, SC)

const schema = {
  "@context": "https://schema.org",
  "@type": ["Person", "LocalBusiness"],
  name: "Diovani Matos",
  jobTitle: "Desenvolvedor Web",
  description:
    "Especialista em landing pages de alta conversão, sites institucionais e e-commerce.",
  url: "https://diovanimatos.com.br",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Criciúma",
    addressRegion: "SC",
    addressCountry: "BR",
  },
  areaServed: "Brasil",
  serviceType: ["Landing Page", "Site Institucional", "E-commerce"],
  // TODO: confirmar handles das redes sociais antes do deploy
  sameAs: [
    "https://www.instagram.com/matosdiovani",
    "https://www.linkedin.com/in/diovani-matos-333a2a228/",
    "https://github.com/diovani-matos",
  ],
};

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "Diovani Matos — Desenvolvedor Web",
    template: "%s | Diovani Matos",
  },
  description:
    "Especialista em landing pages de alta conversão, sites institucionais e e-commerce. Criciúma, SC.",
  keywords: [
    "desenvolvedor web",
    "landing page",
    "site institucional",
    "e-commerce",
    "Criciúma",
    "Santa Catarina",
  ],
  authors: [{ name: "Diovani Matos" }],
  creator: "Diovani Matos",
  metadataBase: new URL("https://diovanimatos.com.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://diovanimatos.com.br",
    siteName: "Diovani Matos",
    title: "Diovani Matos — Desenvolvedor Web",
    description:
      "Especialista em landing pages de alta conversão, sites institucionais e e-commerce. Criciúma, SC.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Diovani Matos — Desenvolvedor Web",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diovani Matos — Desenvolvedor Web",
    description:
      "Especialista em landing pages de alta conversão, sites institucionais e e-commerce. Criciúma, SC.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
};

// ── Layout ────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${dmSans.variable}`}>
      <head>
        {/*
          padding-top do <main> compensa o Header fixo.
          Feito via <style> no layout raiz pois:
          - não há layout.module.css (não queremos criar arquivo extra)
          - globals.css não deve receber regras de componente específico
          - React 18 faz hoisting automático de <style> para o <head>
          Desktop: 72px | Mobile ≤ 768px: 60px (alturas definidas em Header.module.css)
        */}
        <style>{`
          main { padding-top: 72px; }
          @media (max-width: 768px) { main { padding-top: 60px; } }
        `}</style>

        {/* Schema.org: Person + LocalBusiness (Criciúma, SC) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>

      {/*
        <body> sem className adicional — todos os estilos de body
        estão em globals.css (fundo #0A0A0A, cor #E8E8E8, font-family DM Sans)
      */}
      <body suppressHydrationWarning>
        <LenisProvider>
          <ScrollToTop />
          {/* Header fixo por CSS (position: fixed em Header.module.css) */}
          <Header />

          {/* Conteúdo de cada página — padding-top compensa o header */}
          <main>
            {children}
          </main>

          {/* Footer fora do <main>, dentro do LenisProvider */}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
