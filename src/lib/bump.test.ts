import { describe, expect, test } from "bun:test";
import { getBundle, parseVariant, productLabel, withVariantPrice } from "@/lib/bundles";
import { CORES, coresLabel, KIT_HANDLE, OFERTAS, qtdLabel, type Cor } from "@/lib/catalog-data";
import { boughtBundle, corDoPedido, extraLabel, upsellPrice } from "@/lib/upsell";

const p = getBundle(KIT_HANDLE);
const ids = CORES.map((c) => c.id);

/** Todas as escolhas possíveis na página: uma cor por carrinho, em qualquer ordem. */
function escolhas(n: number): Cor[][] {
  if (n === 0) return [[]];
  return escolhas(n - 1).flatMap((r) => ids.map((c) => [...r, c]));
}

describe("catálogo do Bump Buddy", () => {
  test("toda escolha de cores vira uma variação com o preço da quantidade", () => {
    for (const o of OFERTAS)
      for (const cores of escolhas(o.qtd)) {
        const values = [qtdLabel(o.qtd), coresLabel(cores)];
        expect(parseVariant(p, values.join("|"))).toEqual(values);
        expect(withVariantPrice(p, values).price).toBe(o.price);
      }
  });

  test("a ordem das cores não cria variação nova", () => {
    expect(coresLabel(["Roxo", "Azul", "Rosa"])).toBe("Azul + Rosa + Roxo");
    expect(p.variants?.length).toBe(3 + 6 + 10);
  });

  test("a foto da variação é a da primeira cor", () => {
    expect(withVariantPrice(p, [qtdLabel(2), "Rosa + Roxo"]).img).toBe("/produtos/bump-rosa.webp");
  });

  test("1 carrinho não aceita duas cores", () => {
    expect(parseVariant(p, `${qtdLabel(1)}|Azul + Rosa`)).toBeNull();
  });
});

describe("pós-compra", () => {
  const item = productLabel(p, [qtdLabel(3), "Azul + Rosa + Rosa"]);

  test("o carrinho extra sai na cor do 1º carrinho, com metade do preço de 1", () => {
    expect(corDoPedido(item)).toBe("Azul");
    const extra = boughtBundle(p, item);
    expect(extra.price).toBe(OFERTAS[0].price);
    expect(upsellPrice(extra)).toBe(OFERTAS[0].price / 2);
    expect(extraLabel(item)).toBe("Mais 1 carrinho BUMP BUDDY Azul (50% OFF)");
  });

  test("pedido sem cor reconhecida usa a primeira cor da loja", () => {
    expect(corDoPedido(undefined)).toBe(CORES[0].id);
  });
});
