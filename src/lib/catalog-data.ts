/**
 * Formato do catálogo como vem do banco (tabelas collections / products / product_variants).
 * A loja monta os produtos da vitrine (src/lib/bundles.ts) a partir disto; o importador CSV
 * do admin grava neste mesmo formato.
 */

export type CatalogCollection = {
  slug: string;
  name: string;
  description: string;
  image: string | null;
  sort: number;
};

export type CatalogVariant = {
  /** Valores na ordem das opções do produto (ex.: ["Preto", "42"]). */
  values: string[];
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  /** null = sem controle de estoque (sempre disponível). */
  stock: number | null;
  image: string | null;
};

export type CatalogProduct = {
  handle: string;
  title: string;
  /** Texto da descrição (parágrafos separados por linha em branco). */
  description: string;
  productType: string | null;
  vendor: string | null;
  tags: string[];
  /** Coleções (slugs); a primeira é a principal. */
  collections: string[];
  options: { name: string; values: string[] }[];
  variants: CatalogVariant[];
  images: string[];
  sort: number;
};

export type CatalogData = {
  collections: CatalogCollection[];
  products: CatalogProduct[];
  /** "db" = veio do banco; "seed" = catálogo inicial do código (banco vazio ou desligado). */
  source: "db" | "seed";
  /** Muda quando o catálogo muda (evita remontar a vitrine à toa). */
  version?: string;
};

/**
 * Catálogo inicial: o carrinho bate-bate Bump Buddy. Duas opções:
 * - Quantidade: 1, 2 ou 3 carrinhos (define o preço);
 * - Cores: a cor de cada carrinho, em ordem fixa (ex.: "Azul + Rosa"), para quem leva mais de um.
 * Preços: R$ 197 / 297 / 397 (definidos pelo dono da loja em 03/11). O "de" (riscado) só aparece
 * no kit de 2 e de 3: é o preço de 1 carrinho vezes a quantidade.
 */
export const KIT_HANDLE = "bump-buddy";
export const QTD_OPTION = "Quantidade";
export const CORES_OPTION = "Cores";

export const CORES = [
  {
    id: "Azul",
    sku: "AZ",
    hex: "#2f74ff",
    img: "/produtos/bump-azul.webp",
    recorte: "/produtos/recorte-azul.webp",
  },
  {
    id: "Rosa",
    sku: "RS",
    hex: "#ff3fa8",
    img: "/produtos/bump-rosa.webp",
    recorte: "/produtos/recorte-rosa.webp",
  },
  {
    id: "Roxo",
    sku: "RX",
    hex: "#8b4dff",
    img: "/produtos/bump-roxo.webp",
    recorte: "/produtos/recorte-roxo.webp",
  },
] as const;
export type Cor = (typeof CORES)[number]["id"];

export const OFERTAS = [
  { qtd: 1, price: 197 },
  { qtd: 2, price: 297 },
  { qtd: 3, price: 397 },
] as const;

export const qtdLabel = (n: number) => (n === 1 ? "1 carrinho" : `${n} carrinhos`);

/** Cores em ordem fixa (Azul, Rosa, Roxo), uma por carrinho: "Azul + Rosa". */
export const coresLabel = (cores: readonly Cor[]) =>
  [...cores]
    .sort((a, b) => CORES.findIndex((c) => c.id === a) - CORES.findIndex((c) => c.id === b))
    .join(" + ");

/** Todas as combinações de cores para `n` carrinhos (sem repetir a mesma combinação). */
function combinacoes(n: number, from = 0): Cor[][] {
  if (n === 0) return [[]];
  const out: Cor[][] = [];
  for (let i = from; i < CORES.length; i++)
    for (const resto of combinacoes(n - 1, i)) out.push([CORES[i]!.id, ...resto]);
  return out;
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const UNIDADE = OFERTAS[0].price;

const VARIANTES: CatalogVariant[] = OFERTAS.flatMap((o) =>
  combinacoes(o.qtd).map((cores) => ({
    values: [qtdLabel(o.qtd), coresLabel(cores)],
    sku: `BB-${o.qtd}-${cores.map((c) => CORES.find((x) => x.id === c)!.sku).join("-")}`,
    price: o.price,
    compareAtPrice: o.qtd > 1 ? r2(o.qtd * UNIDADE) : null,
    stock: null,
    image: CORES.find((c) => c.id === cores[0])!.img,
  })),
);

export const SEED_COLLECTIONS: CatalogCollection[] = [
  {
    slug: "bate-bate",
    name: "Carrinho bate-bate",
    description: "Carrinho bate-bate elétrico infantil com giro 360°, joystick e luzes de LED",
    image: "/produtos/bump-azul.webp",
    sort: 0,
  },
];

export const SEED_PRODUCTS: CatalogProduct[] = [
  {
    handle: KIT_HANDLE,
    title: "Bump Buddy — Carrinho Bate-Bate Elétrico",
    description: [
      "O Bump Buddy é um carrinho bate-bate elétrico para crianças de 3 a 8 anos. A criança senta, aperta o cinto e pilota com dois joysticks: anda para frente, para trás e gira 360° no lugar.",
      "Tem para-choque emborrachado em volta, assento acolchoado, luzes de LED na base e bateria recarregável. Mede 65 cm de largura por 48 cm de altura e aguenta até 30 kg.",
      "Vem nas cores azul, rosa e roxo. Levando 2 ou 3, você escolhe a cor de cada carrinho.",
    ].join("\n\n"),
    productType: "Carrinho bate-bate elétrico infantil",
    vendor: "BUMP BUDDY",
    tags: ["bate-bate"],
    collections: ["bate-bate"],
    options: [
      { name: QTD_OPTION, values: OFERTAS.map((o) => qtdLabel(o.qtd)) },
      { name: CORES_OPTION, values: [...new Set(VARIANTES.map((v) => v.values[1]!))] },
    ],
    variants: VARIANTES,
    images: [
      "/produtos/bump-azul.webp",
      "/produtos/info-recursos.webp",
      "/fotos/crianca-dirigindo.webp",
      "/produtos/info-medidas.webp",
      "/produtos/info-seguranca.webp",
      "/produtos/bump-rosa.webp",
      "/produtos/bump-roxo.webp",
    ],
    sort: 0,
  },
];

export const SEED_CATALOG: CatalogData = {
  collections: SEED_COLLECTIONS,
  products: SEED_PRODUCTS,
  source: "seed",
};
