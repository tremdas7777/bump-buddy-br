import { createFileRoute } from "@tanstack/react-router";
import { Gamepad2, RotateCw, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import {
  Display,
  Eyebrow,
  FaqList,
  FinalCta,
  LimeLink,
  TextLink,
  Ticker,
} from "@/components/br/ui";
import {
  ComoFunciona,
  Cores,
  ParqueEmCasa,
  Presente,
  Recursos,
  Trio,
} from "@/components/br/BumpSections";
import { brand } from "@/lib/brand";
import { brl, FREE_SHIPPING_LABEL, FREE_SHIPPING_PHRASE, getBundle } from "@/lib/bundles";
import { FAQ_HOME, FICHA, KIT_HANDLE } from "@/lib/bump";
import { seo, storeJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      path: "/",
      title: `Carrinho Bate-Bate Elétrico Infantil com Giro 360° | ${brand.name}`,
      description: `O parque de diversões dentro de casa: carrinho bate-bate elétrico para crianças de ${FICHA.idade}, com joystick, giro 360° e luzes de LED. Azul, rosa ou roxo, com ${FREE_SHIPPING_PHRASE}.`,
      imageAlt: `${brand.name}: carrinho bate-bate elétrico infantil nas cores azul, rosa e roxo`,
      jsonLd: storeJsonLd(),
    }),
  component: Home,
});

const VANTAGENS = [
  { n: "01", Icon: RotateCw, title: "Gira 360° no lugar.", text: "A volta mais pedida do parque." },
  { n: "02", Icon: Gamepad2, title: "Pilota sozinho.", text: "Dois joysticks, zero complicação." },
  {
    n: "03",
    Icon: Sparkles,
    title: "Acende a cada volta.",
    text: "LED na base, astronauta no painel.",
  },
];

function Hero({ from }: { from: number }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(48rem_26rem_at_75%_60%,rgba(60,110,255,0.28),transparent_70%)]" />
      <div className="container-edge relative grid items-center gap-4 pb-12 pt-6 md:min-h-[640px] md:grid-cols-[1fr_1.1fr] md:gap-10 md:py-16">
        <div className="order-2 max-w-[560px] reveal md:order-1">
          <Eyebrow dot>Carrinho bate-bate elétrico infantil</Eyebrow>
          <Display
            as="h1"
            top={
              <>
                <span className="sr-only">Carrinho bate-bate elétrico infantil: </span>O parque
                <br />
                de diversões
              </>
            }
            em="dentro de casa"
            className="mt-4 text-[54px] sm:text-[72px] md:text-[86px]"
          />
          <p className="mt-6 max-w-[360px] text-[15px] leading-relaxed text-[var(--slate)]">
            Joystick, giro 360° e luzes de LED para crianças de {FICHA.idade}. A sala vira pista.
          </p>
          <LimeLink to="/produto" className="mt-8 w-full max-w-[340px]">
            Escolher meu Bump Buddy
          </LimeLink>
          <p className="mt-3 text-[12px] text-[var(--slate)]">
            A partir de {brl(from)} <span className="mx-1.5 text-[var(--blue)]">•</span>{" "}
            {FREE_SHIPPING_LABEL}
          </p>
        </div>
        <div className="order-1 md:order-2">
          <Trio />
        </div>
      </div>
    </section>
  );
}

function PorQue() {
  return (
    <section className="container-edge py-16 md:py-24">
      <div className="md:flex md:items-end md:justify-between md:gap-10">
        <div>
          <Eyebrow>Por que as crianças amam</Eyebrow>
          <Display
            top="Menos “tô entediado.”"
            em="Mais “mais uma volta!”"
            className="mt-4 text-[48px] md:text-[72px]"
          />
        </div>
        <p className="mt-5 text-[14.5px] leading-relaxed text-[var(--slate)] md:mt-0 md:text-right">
          Brincadeira de se mexer.
          <br />E de dar risada junto.
        </p>
      </div>
      <ul className="mt-10 grid gap-3 md:grid-cols-3 md:gap-5">
        {VANTAGENS.map(({ n, Icon, title, text }, i) => (
          <li
            key={n}
            className={`card-soft relative flex items-center gap-5 overflow-hidden px-6 py-6 ${
              i === 1
                ? "!bg-[linear-gradient(135deg,var(--card-bg),var(--tint-lime))]"
                : "!bg-[linear-gradient(135deg,var(--card-bg),var(--tint-blue))]"
            }`}
          >
            <Icon className="h-6 w-6 shrink-0 text-[var(--blue)]" strokeWidth={1.8} />
            <div>
              <p className="text-[15px] font-bold text-[var(--ink)]">{title}</p>
              <p className="mt-1 text-[12.5px] text-[var(--slate)]">{text}</p>
            </div>
            <span className="pointer-events-none absolute -bottom-3 right-4 font-display text-[72px] font-extrabold leading-none text-[var(--blue)]/[0.07]">
              {n}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Numeros() {
  return (
    <section className="container-edge grid items-center gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-24">
      <div className="md:order-2">
        <div className="relative overflow-hidden rounded-2xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.75)]">
          <img
            src="/produtos/info-recursos.webp"
            alt="Criança girando no carrinho bate-bate azul, com os recursos: joystick, giro 360°, luzes e segurança"
            width={1200}
            height={1200}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </div>
      </div>
      <div>
        <Eyebrow>Conheça o Bump Buddy</Eyebrow>
        <Display
          top="Pequeno no tamanho."
          em="Gigante na diversão."
          className="mt-4 text-[48px] md:text-[68px]"
        />
        <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-[var(--slate)]">
          {FICHA.largura} de largura, cabe na sala e aguenta até {FICHA.pesoMax}. Cinto de
          segurança, assento macio e para-choque emborrachado.
        </p>
        <dl className="mt-8 flex gap-10">
          {[
            ["3–8", "Anos"],
            ["360°", "Giro"],
            [FICHA.pesoMax.replace(" ", ""), "Peso máximo"],
          ].map(([v, l]) => (
            <div key={l}>
              <dt className="font-display text-[44px] font-extrabold leading-none text-[var(--blue)]">
                {v}
              </dt>
              <dd className="mt-1 text-[11.5px] text-[var(--slate)]">{l}</dd>
            </div>
          ))}
        </dl>
        <TextLink to="/produto" hash="medidas" className="mt-9 w-full max-w-[260px]">
          Ver a ficha técnica
        </TextLink>
      </div>
    </section>
  );
}

function Perguntas() {
  return (
    <section className="container-edge grid gap-10 pb-6 pt-16 md:grid-cols-[1fr_1.4fr] md:gap-16 md:py-24">
      <div>
        <Eyebrow>Respostas rápidas. Depois, diversão.</Eyebrow>
        <Display top="Antes da" em="primeira volta." className="mt-4 text-[52px] md:text-[72px]" />
        <TextLink to="/faq" className="mt-8 w-full max-w-[260px]">
          Todas as dúvidas
        </TextLink>
      </div>
      <FaqList items={FAQ_HOME} />
    </section>
  );
}

function Home() {
  const produto = getBundle(KIT_HANDLE);
  return (
    <SiteLayout>
      <Hero from={produto.price} />
      <Ticker
        items={[
          FICHA.idade,
          "Giro 360°",
          "Luzes de LED",
          "Azul · Rosa · Roxo",
          FREE_SHIPPING_LABEL,
        ]}
      />
      <PorQue />
      <ParqueEmCasa />
      <Recursos />
      <Cores />
      <Numeros />
      <ComoFunciona />
      <Presente />
      <Perguntas />
      <FinalCta
        eyebrow="Um carrinho. Um monte de voltas."
        top="A próxima volta"
        em="é em casa"
        cta="Escolher meu Bump Buddy"
        note={`${FREE_SHIPPING_LABEL} · Garantia de ${brand.garantiaDias} dias`}
      />
    </SiteLayout>
  );
}
