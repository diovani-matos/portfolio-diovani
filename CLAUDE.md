# Portfólio — Diovani Matos

## Identidade do Projeto
- Dono: Diovani Matos
- Profissão: Desenvolvedor web especialista em landing pages de alta
  conversão, sites institucionais e e-commerce
- Localização: Criciúma, SC
- URL futura: Ainda não decidi
- Objetivo: Portfólio profissional para captação de clientes

## Stack Obrigatória
- Next.js 15, App Router, TypeScript estrito
- CSS Modules exclusivamente — zero Tailwind, zero styled-components
- GSAP para todas as animações de entrada e movimento
- Lenis para scroll suave em todo o site
- next/image para todas as imagens
- next/font para todas as fontes
- next-sitemap para sitemap automático
- Sem bibliotecas de UI (sem shadcn, sem MUI, sem Radix visível)

## Identidade Visual
- Tema: dark exclusivamente
- Fundo base: #0A0A0A
- Cor primária de texto: #E8E8E8
- Acento único: #C8FF00 (verde ácido — usar com parcimônia,
  só em elementos de destaque, hover e detalhes)
- Tipografia display: Bricolage Grotesque (Google Fonts)
- Tipografia corpo: DM Sans (Google Fonts)
- Grain/noise sutil no fundo via pseudo-elemento SVG — não liso
- Nenhum border-radius > 4px em qualquer elemento
- Sem gradiente roxo em nenhuma circunstância

## Paleta Completa
- #0A0A0A — fundo principal
- #111111 — fundo de cards e seções alternadas
- #1A1A1A — bordas e divisores
- #E8E8E8 — texto principal
- #888888 — texto secundário/muted
- #C8FF00 — acento (sparingly)
- #FFFFFF — uso mínimo, só quando necessário

## Animação (regras absolutas)
- Todo scroll usa Lenis. Nunca scroll nativo.
- Todo movimento usa GSAP. Nunca CSS transition em entradas.
- Ease padrão: power3.out
- Duration mínima de entrada: 0.6s
- Nenhuma animação abaixo de 0.6s
- Stagger entre elementos de lista: 0.08s
- Entradas sempre de baixo para cima: y: 40 → 0, opacity: 0 → 1
- Nunca bounce, nunca elastic, nunca ease-in-out
- translateY mínimo em entradas: 30px
- ScrollTrigger.refresh() após qualquer resize

## Lenis + ScrollTrigger
- Inicializar Lenis uma única vez em providers.tsx dentro do layout.tsx
- Lenis alimenta ScrollTrigger via lenis.on('scroll', ScrollTrigger.update)
- NUNCA window.addEventListener('scroll') com Lenis ativo
- Lenis destroy() no cleanup do useEffect

## Componentes
- Um componente = um .tsx + um .module.css. Sem exceções.
- Todo componente com GSAP usa useGSAP do @gsap/react
- Cleanup obrigatório no return do useGSAP
- Nomes de componentes em PascalCase
- Nomes de arquivos em kebab-case
- Nenhum estilo inline — tudo em .module.css

## Páginas
1. / (Home) — hero com nome + posicionamento, serviços resumidos,
   projetos em destaque, números, CTA para contato
2. /projetos — grid com todos os projetos, filtro por tipo
3. /sobre — foto, história direta, stack
4. /servicos — Landing Page, Site Institucional, E-commerce
5. /contato — formulário + WhatsApp + email

## Projetos no Portfólio
1. LP Nutricionista — Landing page, conversão, saúde
2. Mini E-commerce Artesanal — E-commerce, produtos, varejo
3. [Terceiro projeto a definir]

## Copy e Tom de Voz
- Direto, sem rodeios, sem adjetivos vazios
- Nunca: "apaixonado por tecnologia", "soluções inovadoras",
  "transformando ideias em realidade"
- Foco em resultado para o cliente, não em processo técnico
- Headline principal fala sobre o que o cliente ganha,
  não sobre quem Diovani é
- Números reais apenas — nunca inventar métricas

## SEO
- lang="pt-BR"
- Meta title e description únicos por página
- Schema.org: Person + LocalBusiness (Criciúma, SC)
- Canonical em todas as páginas
- OG tags completas (og:title, og:description, og:image, og:url)
- Sitemap.xml via next-sitemap
- robots.txt configurado

## Performance
- Todas as imagens via next/image com WebP automático
- Fontes via next/font — nunca @import no CSS
- Sem dependências não listadas na stack
- Lazy loading em imagens de projetos
- CSS Modules elimina CSS não usado automaticamente

## O que nunca fazer
- Tailwind de qualquer forma
- border-radius > 4px
- Gradiente roxo
- Sombras excessivas
- Texto centralizado em parágrafos longos
- Ícones genéricos de UI kit
- Layout perfeitamente simétrico em todas as seções
- Animações simultâneas demais na mesma viewport
- Fonts via CDN ou @import — sempre next/font
