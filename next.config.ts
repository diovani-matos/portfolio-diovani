import type { NextConfig } from "next";

// ── Headers de segurança HTTP ─────────────────────────────────────────────────
//
// Aplicados em todas as rotas via source: '/(.*)'
// Protegem contra XSS, clickjacking, sniffing de MIME e outros ataques comuns.
//
// TODO — Google Analytics: se adicionado no futuro, incluir em script-src:
//   https://www.googletagmanager.com
//   https://www.google-analytics.com
//   E em connect-src:
//   https://www.google-analytics.com
//   https://region1.google-analytics.com
//
// TODO — Formulário de contato: ao integrar Resend ou Formspree, incluir
//   em connect-src a URL da API:
//   Resend:    https://api.resend.com
//   Formspree: https://formspree.io

const securityHeaders = [
  {
    // Habilita pre-fetch de DNS para domínios externos linkados na página,
    // melhorando levemente a performance de recursos de terceiros.
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    // Impede que o site seja embutido em iframes de outros domínios.
    // Proteção primária contra ataques de clickjacking.
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Impede que o browser "adivinhe" o tipo de conteúdo (MIME sniffing).
    // Evita que arquivos maliciosos sejam executados como scripts.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Controla quanta informação de referência é enviada ao navegar.
    // strict-origin-when-cross-origin: envia origin completo em same-origin,
    // só a origin (sem path) em cross-origin, e nada em downgrade (HTTPS→HTTP).
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Desabilita acesso a câmera, microfone e geolocalização.
    // O site não usa nenhum desses recursos — bloquear por padrão é seguro.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // Header legado de proteção XSS para browsers mais antigos.
    // Browsers modernos usam o CSP abaixo, mas mantemos como fallback.
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    // Content Security Policy — define fontes confiáveis de conteúdo.
    // unsafe-eval e unsafe-inline em script-src são necessários para
    // Next.js (hydration) e GSAP (animações inline) funcionarem corretamente.
    // unsafe-inline em style-src é necessário para CSS-in-JS do Next.js.
    key: "Content-Security-Policy",
    value: [
      // Bloqueia tudo por padrão; as diretivas abaixo abrem exceções.
      "default-src 'self'",

      // Scripts: apenas do próprio domínio + eval/inline para Next.js e GSAP.
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",

      // Estilos: próprio domínio + inline (Next.js) + Google Fonts CDN.
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

      // Fontes: próprio domínio + Google Fonts (arquivos .woff2).
      "font-src 'self' https://fonts.gstatic.com",

      // Imagens: próprio domínio + data URIs (grain SVG) + blobs.
      "img-src 'self' data: blob:",

      // Conexões XHR/fetch/WebSocket: apenas próprio domínio.
      "connect-src 'self'",

      // Bloqueia completamente este site de ser embutido em iframes.
      // Reforça o X-Frame-Options acima.
      "frame-ancestors 'none'",

      // Restringe URLs base (evita ataques via <base> tag injetada).
      "base-uri 'self'",

      // Restringe para onde formulários podem enviar dados.
      "form-action 'self'",
    ].join("; "),
  },
  {
    // HSTS — força o browser a usar HTTPS em todas as visitas futuras.
    // max-age=63072000 = 2 anos. preload lista o domínio nos browsers.
    // IMPORTANTE: só ativar quando o domínio estiver com HTTPS configurado.
    // Habilitar em HTTP causa loop de redirecionamento.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

// ── Configuração do Next.js ───────────────────────────────────────────────────

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Gera automaticamente versões WebP das imagens via next/image.
    formats: ["image/webp"],
  },

  async headers() {
    return [
      {
        // Aplica os headers de segurança em todas as rotas do site.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
