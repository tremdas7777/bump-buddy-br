import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { brand } from "@/lib/brand";
import {
  encodeVariant,
  isFreeShippingEligible,
  listedBundles,
  STANDARD_SHIPPING,
  type Bundle,
  type Variant,
} from "@/lib/bundles";
import { ensureCatalog } from "@/lib/catalog.server";
import { CORES_OPTION, QTD_OPTION } from "@/lib/catalog-data";
import { absUrl, productPath } from "@/lib/seo";

/**
 * Feed de produtos do Google Merchant Center (listagens gratuitas do Google Shopping):
 * um item por variação (quantidade e cores), com o SKU como id.
 * O Merchant Center busca este endereço uma vez por dia.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Categoria na taxonomia do Google (o caminho em inglês vale para qualquer país). */
const GOOGLE_CATEGORY = "Toys & Games > Toys > Riding Toys > Electric Riding Vehicles";

/** Números do prazo de entrega ("7 a 10 dias úteis" → 7 e 10). */
const [PRAZO_MIN = 7, PRAZO_MAX = PRAZO_MIN] = (brand.prazoEntrega.match(/\d+/g) ?? []).map(Number);

const tag = (name: string, value: string | number) =>
  `<g:${name}>${esc(String(value))}</g:${name}>`;

/** Abre a /produto já com a variação escolhida (o preço da página bate com o do anúncio). */
const variantLink = (b: Bundle, v: Variant) => {
  const path = productPath(b);
  if (!v.values.length) return absUrl(path);
  const sep = path.includes("?") ? "&" : "?";
  return absUrl(`${path}${sep}variante=${encodeURIComponent(encodeVariant(v.values))}`);
};

const valueOf = (b: Bundle, v: Variant, option: string) =>
  v.values[b.options.findIndex((o) => o.name === option)] ?? "";

/** Título e descrição do anúncio. Sem preço, frete ou "promoção" no texto (o Google recusa). */
function texts(b: Bundle, v: Variant) {
  const qtd = valueOf(b, v, QTD_OPTION);
  const cores = valueOf(b, v, CORES_OPTION);
  const title = [
    b.name,
    qtd && ` - ${qtd}`,
    cores && ` (${cores.toLowerCase().replace(/ \+ /g, ", ")})`,
  ]
    .filter(Boolean)
    .join("");
  const description = [
    b.description?.[0] ?? b.checkoutProductDescription,
    b.description?.[1],
    qtd && cores && `Esta opção traz ${qtd}: ${cores.toLowerCase().replace(/ \+ /g, ", ")}.`,
  ]
    .filter(Boolean)
    .join(" ");
  return { title: title.slice(0, 150), description: description.slice(0, 5000) };
}

/** Frete grátis a partir de FREE_SHIPPING_MIN; abaixo disso, o Frete Padrão. */
function shipping(price: number) {
  const gratis = isFreeShippingEligible(price);
  const [nome, valor, min, max] = gratis
    ? ["Frete grátis", 0, PRAZO_MIN, PRAZO_MAX]
    : ["Frete Padrão", STANDARD_SHIPPING.price, STANDARD_SHIPPING.days, STANDARD_SHIPPING.days];
  return `<g:shipping>${tag("country", "BR")}${tag("service", nome)}${tag("price", `${valor.toFixed(2)} BRL`)}${tag("min_handling_time", 0)}${tag("max_handling_time", 1)}${tag("min_transit_time", min)}${tag("max_transit_time", max)}</g:shipping>`;
}

function item(b: Bundle, v: Variant) {
  const { title, description } = texts(b, v);
  const image = absUrl(v.image ?? b.img);
  const extra = [...new Set(b.images.map(absUrl))].filter((i) => i !== image).slice(0, 10);
  const inStock = v.stock === null || v.stock > 0;
  const fields = [
    tag("id", v.sku ?? (v.values.length ? `${b.id}-${v.values.join("-")}` : b.id)),
    tag("item_group_id", b.id),
    tag("title", title),
    tag("description", description),
    tag("link", variantLink(b, v)),
    tag("image_link", image),
    ...extra.map((i) => tag("additional_image_link", i)),
    tag("availability", inStock ? "in_stock" : "out_of_stock"),
    tag("price", `${v.price.toFixed(2)} BRL`),
    tag("condition", "new"),
    tag("brand", brand.name),
    tag("identifier_exists", "no"),
    tag("google_product_category", GOOGLE_CATEGORY),
    tag("product_type", "Brinquedos > Carrinho bate-bate elétrico"),
    shipping(v.price),
  ];
  return ["    <item>", ...fields.map((f) => `      ${f}`), "    </item>"].join("\n");
}

export const Route = createFileRoute("/feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        await ensureCatalog();
        const items = listedBundles()
          .filter((b) => !b.kit)
          .flatMap((b) => (b.variants ?? []).filter((v) => v.price > 0).map((v) => item(b, v)));
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">`,
          `  <channel>`,
          `    <title>${esc(brand.name)}</title>`,
          `    <link>${esc(`${brand.siteUrl}/`)}</link>`,
          `    <description>${esc(`${brand.taglineShort}. ${brand.tagline}`)}</description>`,
          ...items,
          `  </channel>`,
          `</rss>`,
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
