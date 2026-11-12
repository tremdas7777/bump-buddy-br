# BUMP BUDDY Brasil

Loja de produto único: o carrinho bate-bate elétrico infantil Bump Buddy (azul, rosa ou roxo; 1, 2 ou
3 carrinhos), com checkout próprio (Pix), pós-compra, painel admin e integrações de rastreio e
marketing. Feita a partir da BEAM RIVALS Brasil (mesmo visual de galáxia, checkout e painel).

## O que tem na loja

- **Início** (`src/routes/index.tsx`) e **Produto** (`src/routes/produto.tsx`): seções em
  `src/components/br/BumpSections.tsx`, galeria em `src/components/br/Gallery.tsx`.
- **Escolha em 2 passos** na /produto: quantidade (1, 2 ou 3) e a cor de cada carrinho. A variação
  vai para o checkout como `variante=2 carrinhos|Azul + Rosa`.
- **Catálogo e preços** (`src/lib/catalog-data.ts`, `OFERTAS` e `CORES`): R$ 197 / 297 / 397.
  Com o banco ligado, dá para mudar pelo `/admin` → Produtos ("Carregar catálogo inicial" copia o
  produto para o banco).
- **Textos do produto** (`src/lib/bump.ts`): ficha técnica, selos das ofertas e perguntas.
- **Pós-compra**: /upsell (mais 1 carrinho 50% OFF na cor do 1º do pedido + seguro de entrega) →
  /expresso → /obrigado. Sem a etapa das pilhas.
- **Checkout** (`/checkout`): Pix pela Pix Black (`GATEWAY_UNICO` em `pix-gateway.server.ts`).
  O preço é sempre recalculado no servidor. Frete grátis sempre. Ofertas do checkout em
  `src/lib/order-bump.ts` (embrulho de presente e garantia estendida).
- **Painel admin** (`/admin`, ou `/admin?demo` local com dados de exemplo).

## Banco (Supabase)

Todas as tabelas têm o prefixo `bump_` e as fotos do admin vão no bucket `bump-produtos`, para a loja
poder dividir um projeto Supabase com outras. Crie tudo rodando
`supabase/migrations/20261103200000_bump_buddy.sql` uma vez no SQL Editor.

## Antes de vender

1. Prazo de entrega e dados da empresa (`src/lib/brand.ts`).
2. Chave da Pix Black no `/admin` e pixel da UTMify em `src/lib/pixels.ts`.
3. Domínio: troque `brand.siteUrl` e o `Sitemap:` de `public/robots.txt`.

Variáveis da Vercel (Production): `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PROJECT_ID`,
`VITE_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY` (secreta) e `ADMIN_PASSWORD` (secreta). O `.env`
do repositório só tem valores de exemplo.
