/**
 * Marca da loja.
 * PREENCHA `cnpj` e `whatsapp` com os dados da sua empresa antes de vender.
 */
export const brand = {
  name: "BUMP BUDDY",
  /** Endereço oficial da loja (o www redireciona para cá). */
  siteUrl: "https://bumpbuddy.store",
  /** Linha pequena embaixo do nome no logo. */
  logoTagline: "Carrinho bate-bate infantil",
  productName: "Carrinho Bate-Bate Elétrico Infantil",
  /** Nome genérico que aparece na fatura do cliente (gateways Pix e cartão). */
  gatewayName: "BUMP BUDDY",
  tagline: "O parque de diversões dentro de casa.",
  taglineShort: "Carrinho bate-bate elétrico para crianças",
  manufacturer: "BUMP BUDDY",
  manufacturerTagline: "Carrinho bate-bate infantil",
  /** Cidade da loja (entregas por motoboy). Vazio = não mostra. */
  city: "" as string,
  cnpj: "64.756.111/0001-05",
  /** Ex.: "@sualoja". Vazio = não mostra. */
  instagram: "" as string,
  whatsapp: {
    /**
     * Número inicial em E.164 (55 + DDD + número), sem símbolos. Depois de trocado no
     * admin (Configurações da loja → Botão de WhatsApp), vale o do admin. Vazio = oculto.
     */
    phoneE164: "5585958549956",
    /** Mensagem pronta do link. O número atende várias lojas, então ela diz de qual o cliente veio. */
    message: "Olá! Vim pelo site da BUMP BUDDY e quero saber mais sobre o carrinho bate-bate.",
  },
  /** Prazo de entrega mostrado na loja (o mesmo do frete grátis no checkout). */
  prazoEntrega: "7 a 12 dias úteis",
  /** Garantia de devolução do dinheiro, em dias contados da entrega. */
  garantiaDias: 30,
  colors: {
    primary: "#1556e8",
    primaryDark: "#0f43bd",
    primaryDeep: "#101c3b",
    onPrimary: "#ffffff",
    surfaceTint: "#f4f8ff",
  },
} as const;
