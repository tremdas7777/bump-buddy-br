import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Check, ShieldCheck, Truck, Undo2 } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Gallery } from "@/components/br/Gallery";
import { Display, Eyebrow, FaqList, FinalCta, Ticker } from "@/components/br/ui";
import {
  ComoFunciona,
  Cores,
  Medidas,
  ParqueEmCasa,
  Presente,
  Recursos,
  Seguranca,
} from "@/components/br/BumpSections";
import { usePayInfo } from "@/hooks/usePayInfo";
import { brand } from "@/lib/brand";
import { metaTrack } from "@/lib/meta-pixel";
import { trackCheckoutClick } from "@/lib/analytics";
import { markCartCheckout } from "@/lib/cart";
import { bundleIdFromSearch, planSearchSchema } from "@/lib/plan-search";
import {
  brl,
  bundleShippingLabel,
  discountPct,
  encodeVariant,
  findVariant,
  FREE_SHIPPING_LABEL,
  getBundle,
  installment,
  productLabel,
  withVariantPrice,
  type Bundle,
} from "@/lib/bundles";
import {
  CORES,
  coresDe,
  coresLabel,
  corInfo,
  FAQ_KIT,
  FICHA,
  OFERTAS,
  QTD_PADRAO,
  qtdLabel,
  SELO_OFERTA,
  type Cor,
} from "@/lib/bump";
import { productJsonLd, productPath, seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

const CAPA = "/produtos/capa-parque.webp";

export const Route = createFileRoute("/produto")({
  validateSearch: planSearchSchema,
  loaderDeps: ({ search }) => ({ plano: search.plano }),
  // Só repassa o id: o catálogo é carregado na raiz (pode vir do banco).
  loader: ({ deps }) => ({ plano: deps.plano ?? null }),
  head: ({ loaderData }) => {
    const p = getBundle(bundleIdFromSearch({ plano: loaderData?.plano ?? undefined }));
    return seo({
      path: productPath(p),
      title: `Carrinho Bate-Bate Elétrico Infantil com Giro 360° | ${brand.name}`,
      description: `Bump Buddy: carrinho bate-bate elétrico para crianças de ${FICHA.idade}, com joystick, giro 360°, luzes de LED, cinto e para-choque. Azul, rosa ou roxo, a partir de ${brl(p.price)}. ${FREE_SHIPPING_LABEL}.`,
      image: p.img,
      imageAlt: p.name,
      type: "product",
      jsonLd: productJsonLd(p),
    });
  },
  component: Page,
});

/** Quantidade e cores vindas da URL (`variante=2 carrinhos|Azul + Rosa`), quando válidas. */
function inicial(raw: string | undefined): { qtd: number; cores: Cor[] } {
  const [q, c] = (raw ?? "").split("|");
  const qtd = Number.parseInt(q ?? "", 10);
  const cores = coresDe(c ?? "").filter((x) => CORES.some((k) => k.id === x));
  if (OFERTAS.some((o) => o.qtd === qtd) && cores.length === qtd)
    return { qtd, cores: [...cores, ...Array<Cor>(3 - qtd).fill(CORES[0].id)] };
  return { qtd: QTD_PADRAO, cores: [CORES[0].id, CORES[1].id, CORES[2].id] };
}

function QtdCard({
  qtd,
  priced,
  on,
  onPick,
}: {
  qtd: number;
  priced: Bundle;
  on: boolean;
  onPick: () => void;
}) {
  const off = discountPct(priced);
  const economia = priced.compareAtPrice ? priced.compareAtPrice - priced.price : 0;
  const selo = SELO_OFERTA[qtd];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onPick}
      className={cn(
        "relative flex w-full items-center gap-3 rounded-2xl border-2 bg-[var(--card-bg)] px-4 py-4 text-left backdrop-blur transition md:gap-4 md:px-5",
        on
          ? "border-[var(--blue)] shadow-[0_18px_40px_-22px_rgba(193,255,59,0.45)]"
          : "border-[var(--line)] hover:border-[var(--blue)]/40",
      )}
    >
      {selo && (
        <span className="absolute -top-3 right-4 rotate-2 rounded-md bg-[var(--blue)] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[var(--on-blue)] shadow-md">
          ✦ {selo}
        </span>
      )}
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
          on ? "border-[var(--blue)]" : "border-[var(--input)]",
        )}
      >
        {on && <span className="h-2.5 w-2.5 rounded-full bg-[var(--blue)]" />}
      </span>
      <span className="flex w-[56px] shrink-0 -space-x-6 md:w-[74px]">
        {Array.from({ length: qtd }, (_, k) => (
          <img
            key={k}
            src={CORES[k % CORES.length]!.recorte}
            alt=""
            className="h-7 w-9 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] md:h-9 md:w-11"
          />
        ))}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] font-bold text-[var(--ink)]">{qtdLabel(qtd)}</span>
          {off > 0 && (
            <span className="rounded bg-[var(--lime)] px-1.5 py-0.5 text-[9.5px] font-extrabold text-[var(--on-lime)]">
              −{off}% OFF
            </span>
          )}
        </span>
        {economia > 0 ? (
          <span className="mt-0.5 block text-[11px] font-semibold text-[var(--save)]">
            Você economiza {brl(economia)}
          </span>
        ) : (
          <span className="mt-0.5 block text-[11.5px] text-[var(--slate)]">
            Escolha a cor no passo 2
          </span>
        )}
      </span>
      <span className="shrink-0 text-right">
        {priced.compareAtPrice && (
          <span className="block text-[11px] text-[var(--slate)] line-through">
            {brl(priced.compareAtPrice)}
          </span>
        )}
        <span className="block font-display text-[24px] font-extrabold leading-none text-[var(--ink)] md:text-[26px]">
          {brl(priced.price)}
        </span>
        {qtd > 1 && (
          <span className="mt-1 block text-[10.5px] text-[var(--slate)]">
            {brl(Math.round((priced.price / qtd) * 100) / 100)} / carrinho
          </span>
        )}
      </span>
    </button>
  );
}

function CorPicker({
  label,
  value,
  onPick,
}: {
  label: string;
  value: Cor;
  onPick: (c: Cor) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--slate)]">
        {label}: <span className="text-[var(--ink)]">{value}</span>
      </p>
      <div role="radiogroup" aria-label={label} className="grid grid-cols-3 gap-2.5">
        {CORES.map((c) => {
          const on = c.id === value;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={`${label}: ${c.id}`}
              onClick={() => onPick(c.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border-2 px-2 pb-2 pt-2.5 transition",
                on
                  ? "border-[var(--blue)] bg-[var(--tint-lime)]"
                  : "border-[var(--line)] bg-[var(--card-bg)] hover:border-[var(--blue)]/40",
              )}
            >
              <img
                src={c.recorte}
                alt=""
                className="h-11 w-full object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,0.5)]"
              />
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--ink)]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.hex }} />
                {c.id}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Passo({ n, children }: { n: number; children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[15px] font-bold text-[var(--ink)]">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--lime)] text-[12px] font-extrabold text-[var(--on-lime)]">
        {n}
      </span>
      {children}
    </p>
  );
}

function Page() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const pay = usePayInfo();
  const p = getBundle(bundleIdFromSearch(search));
  const [{ qtd, cores }, setEscolha] = useState(() => inicial(search.variante));

  const escolhidas = cores.slice(0, qtd);
  const values = [qtdLabel(qtd), coresLabel(escolhidas)];
  const valida = !!findVariant(p, values);
  const priced = valida ? withVariantPrice(p, values) : p;
  const pricedQtd = (n: number) => {
    const v = p.variants?.find((x) => x.values[0] === qtdLabel(n));
    return v ? withVariantPrice(p, v.values) : p;
  };

  // 1ª foto: a criança brincando (vende melhor); 2ª: o carrinho na cor escolhida.
  const fotoCor = corInfo(escolhidas[0] ?? CORES[0].id).img;
  const images = [
    CAPA,
    fotoCor,
    ...p.images.filter((i) => i !== fotoCor && i !== CAPA && i !== "/fotos/crianca-dirigindo.webp"),
  ];

  useEffect(() => {
    metaTrack("ViewContent", { value: priced.price, contentName: p.name });
  }, [p.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const setCor = (i: number, c: Cor) =>
    setEscolha((s) => ({ ...s, cores: s.cores.map((x, k) => (k === i ? c : x)) }));

  const buy = () => {
    if (!valida) return;
    markCartCheckout(false);
    trackCheckoutClick({
      source: "product_page",
      bundleId: p.id,
      bundleName: productLabel(p, values).slice(0, 80),
      value: priced.price,
    });
    navigate({ to: "/checkout", search: { plano: p.id, variante: encodeVariant(values) } });
  };

  const pixPrice = pay.pixOff ? Math.round(priced.price * (1 - pay.pixOff) * 100) / 100 : 0;

  return (
    <SiteLayout>
      <section>
        <div className="container-edge grid gap-8 py-6 md:grid-cols-[1fr_1fr] md:gap-12 md:py-10 lg:gap-16">
          <div className="md:sticky md:top-[calc(var(--site-chrome-h,7rem)+1.5rem)] md:self-start">
            <Gallery
              images={images}
              focus={1}
              alt={p.name}
              chip="Azul · Rosa · Roxo"
              note={
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    {CORES.map((c) => (
                      <span
                        key={c.id}
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: c.hex }}
                      />
                    ))}
                  </span>
                  Disponível em azul, rosa e roxo
                </span>
              }
            />
          </div>

          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[var(--slate)]">
              {brand.name}
            </p>
            <Display
              as="h1"
              top="Carrinho bate-bate"
              em="elétrico infantil"
              className="mt-2 text-[44px] md:text-[60px]"
            />
            <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-[var(--slate)]">
              O parque de diversões dentro de casa: a criança pilota com joystick, gira 360° e se
              diverte com as luzes.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {[FICHA.idade, "Giro 360°", `Até ${FICHA.pesoMax}`, "Bateria recarregável"].map(
                (t) => (
                  <li
                    key={t}
                    className="rounded-md border border-[var(--line)] bg-[var(--card-bg)] px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink)]"
                  >
                    {t}
                  </li>
                ),
              )}
            </ul>

            <div id="escolha" className="mt-7 scroll-mt-32">
              <div className="mb-3 flex items-end justify-between gap-3">
                <Passo n={1}>Quantos carrinhos?</Passo>
                <p className="text-[11px] text-[var(--slate)]">Um para cada criança</p>
              </div>
              <div role="radiogroup" aria-label="Quantidade de carrinhos" className="space-y-3.5">
                {OFERTAS.map((o) => (
                  <QtdCard
                    key={o.qtd}
                    qtd={o.qtd}
                    priced={pricedQtd(o.qtd)}
                    on={o.qtd === qtd}
                    onPick={() => setEscolha((s) => ({ ...s, qtd: o.qtd }))}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3">
                <Passo n={2}>
                  {qtd === 1 ? "Escolha a cor" : "Escolha a cor de cada carrinho"}
                </Passo>
              </div>
              <div className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--card-bg)] p-4 backdrop-blur">
                {escolhidas.map((c, i) => (
                  <CorPicker
                    key={i}
                    label={qtd === 1 ? "Cor" : `Carrinho ${i + 1}`}
                    value={c}
                    onPick={(nova) => setCor(i, nova)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-[var(--lime-deep)]/40 bg-[linear-gradient(135deg,var(--tint-lime),var(--card-bg))] px-4 py-3 text-[13px] text-[var(--ink)]">
                <span>
                  <b>{qtdLabel(qtd)}</b> · {coresLabel(escolhidas).toLowerCase()}
                </span>
                <b className="shrink-0 font-display text-[22px] font-extrabold leading-none">
                  {brl(priced.price)}
                </b>
              </p>
              <button
                type="button"
                onClick={buy}
                disabled={!valida}
                className="btn-buy h-[70px] w-full text-[18px] disabled:opacity-60 md:text-[19px]"
              >
                Comprar agora
              </button>
              {(pixPrice > 0 || pay.card) && (
                <p className="mt-2.5 text-center text-[12px] text-[var(--slate)]">
                  {pixPrice > 0 && (
                    <>
                      <b className="text-[var(--ink)]">{brl(pixPrice)}</b> no Pix (
                      {Math.round(pay.pixOff * 100)}% OFF)
                    </>
                  )}
                  {pixPrice > 0 && pay.card && " ou "}
                  {pay.card && (
                    <>
                      {pay.installments}x de {installment(priced.price, pay.installments)} no cartão
                    </>
                  )}
                </p>
              )}
              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[12px] text-[var(--ink)]">
                <Check className="h-3.5 w-3.5 text-[var(--lime)]" strokeWidth={3} />
                {bundleShippingLabel(priced)}
              </p>
              <p className="mt-2 text-center text-[11.5px] text-[var(--slate)]">
                Prazo médio de entrega: {brand.prazoEntrega} · Código de rastreio no envio
              </p>
            </div>

            <ul className="mt-6 grid grid-cols-3 gap-3 border-t border-[var(--line)] pt-5 text-[10.5px] leading-tight text-[var(--slate)]">
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--blue)]" strokeWidth={1.6} />
                Pagamento seguro
              </li>
              <li className="flex items-center gap-2">
                <Truck className="h-5 w-5 shrink-0 text-[var(--blue)]" strokeWidth={1.6} />
                {FREE_SHIPPING_LABEL}
              </li>
              <li className="flex items-center gap-2">
                <Undo2 className="h-5 w-5 shrink-0 text-[var(--blue)]" strokeWidth={1.6} />
                Garantia de {brand.garantiaDias} dias
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Ticker
        big
        items={[
          "Giro 360°",
          "Joystick fácil",
          "Luzes de LED",
          "Cinto de segurança",
          "Azul · Rosa · Roxo",
        ]}
      />
      <ParqueEmCasa />
      <Recursos />
      <ComoFunciona />
      <Cores />
      <Medidas />
      <Seguranca />
      <Presente />

      <section
        id="perguntas"
        className="container-edge grid scroll-mt-28 gap-10 py-16 md:grid-cols-[1fr_1.4fr] md:gap-16 md:py-24"
      >
        <div>
          <Eyebrow>Antes da primeira volta</Eyebrow>
          <Display
            top="Suas dúvidas"
            em="respondidas"
            className="mt-4 text-[52px] md:text-[72px]"
          />
          <p className="mt-5 text-[13.5px] text-[var(--slate)]">Precisa de outra ajuda?</p>
          <Link
            to="/contato"
            className="mt-1 inline-block border-b border-[var(--blue)] text-[13.5px] font-semibold text-[var(--blue)]"
          >
            Fale com a gente ↗
          </Link>
        </div>
        <FaqList items={FAQ_KIT} />
      </section>

      <FinalCta
        eyebrow="Diversão de parque, todo dia"
        top="A próxima volta"
        em="é em casa"
        cta="Escolher meu Bump Buddy"
        note={`${FREE_SHIPPING_LABEL} · Garantia de ${brand.garantiaDias} dias`}
      />
    </SiteLayout>
  );
}
