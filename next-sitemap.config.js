/** @type {import('next-sitemap').IConfig} */

// TODO: substituir pela URL real após o domínio ser registrado
// Este arquivo é um fallback para geração estática no build via `postbuild`.
// O sitemap principal é gerado pelo Next.js 15 via src/app/sitemap.ts.
// O robots.txt é gerado via src/app/robots.ts — generateRobotsTxt: false.

module.exports = {
  siteUrl: "https://diovanimatos.com.br",
  generateRobotsTxt: false,
  changefreq: "monthly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/api/*"],
};
