import { Check, Gamepad2, Heart, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";
import { Display, Eyebrow, LimeLink } from "@/components/br/ui";
import { brand } from "@/lib/brand";
import { FREE_SHIPPING_LABEL } from "@/lib/bundles";
import { CORES, FICHA } from "@/lib/bump";
import { cn } from "@/lib/utils";

const shadow = "shadow-[0_30px_60px_-34px_rgba(0,0,0,0.75)]";

const GLOW: Record<string, string> = {
  Azul: "rgba(60,140,255,0.55)",
  Rosa: "rgba(255,70,180,0.5)",
  Roxo: "rgba(160,90,255,0.55)",
};

/** Os três carrinhos juntos sobre a galáxia: azul na frente, rosa e roxo atrás. */
export function Trio({ className }: { className?: string }) {
  const [azul, rosa, roxo] = CORES;
  return (
    <div
      className={cn("relative mx-auto aspect-[10/8] w-full max-w-[640px]", className)}
      aria-hidden
    >
      <svg viewBox="0 0 600 480" className="pointer-events-none absolute inset-0 h-full w-full">
        <ellipse
          cx="300"
          cy="300"
          rx="285"
          ry="92"
          fill="none"
          stroke="#c1ff3b"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          transform="rotate(-9 300 300)"
        />
        <ellipse
          cx="300"
          cy="300"
          rx="250"
          ry="70"
          fill="none"
          stroke="#6c9bff"
          strokeOpacity="0.25"
          strokeWidth="1"
          transform="rotate(-9 300 300)"
        />
        <circle cx="52" cy="330" r="5" fill="#c1ff3b" />
        <circle cx="560" cy="250" r="3.5" fill="#ffffff" fillOpacity="0.8" />
      </svg>
      <span
        className="car-glow left-[4%] top-[52%] h-[16%] w-[40%]"
        style={{ background: GLOW.Rosa }}
      />
      <span
        className="car-glow right-[2%] top-[46%] h-[16%] w-[40%]"
        style={{ background: GLOW.Roxo }}
      />
      <span
        className="car-glow left-[22%] top-[80%] h-[14%] w-[58%]"
        style={{ background: GLOW.Azul }}
      />
      <img
        src={rosa.recorte}
        alt=""
        width={1000}
        height={746}
        className="car-float car-float-slow absolute left-0 top-[18%] w-[46%]"
      />
      <img
        src={roxo.recorte}
        alt=""
        width={1000}
        height={746}
        className="car-float car-float-slow absolute right-0 top-[10%] w-[44%]"
      />
      <img
        src={azul.recorte}
        alt=""
        width={1000}
        height={772}
        className="car-float absolute bottom-0 left-[17%] w-[68%]"
      />
    </div>
  );
}

export function ParqueEmCasa() {
  return (
    <section className="container-edge grid items-center gap-10 py-16 md:grid-cols-[1.05fr_1fr] md:gap-16 md:py-24">
      <div className="relative">
        <img
          src="/fotos/crianca-dirigindo.webp"
          alt="Menino rindo enquanto pilota o carrinho bate-bate azul na sala, com uma menina no carrinho rosa ao fundo"
          width={603}
          height={540}
          loading="lazy"
          className={`aspect-[10/9] w-full rounded-2xl object-cover ${shadow}`}
        />
        <span className="absolute left-4 top-4 -rotate-3 bg-[var(--lime)] px-3 py-2 font-display text-[19px] font-extrabold uppercase leading-[0.95] text-[var(--on-lime)] shadow-md md:text-[22px]">
          <span className="block font-sans text-[10px] font-bold tracking-[0.12em]">
            Na sala de casa
          </span>
          Diversão de parque
        </span>
      </div>
      <div>
        <Eyebrow>Diversão de parque, todo dia</Eyebrow>
        <Display top="O parque" em="dentro de casa" className="mt-4 text-[52px] md:text-[76px]" />
        <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-[var(--slate)]">
          Aquela alegria do bate-bate do parque não precisa esperar as férias. A criança senta,
          pilota e gira — e a sala vira pista.
        </p>
        <ul className="mt-8 space-y-5">
          {[
            [Zap, "Gasta energia longe das telas", "Brincadeira de se mexer, rir e repetir."],
            [Users, "Junta irmãos e primos", "Com dois carrinhos, a batidinha fica ainda melhor."],
            [
              Gamepad2,
              "Fácil desde a primeira volta",
              "Dois joysticks e pronto: frente, ré e giro.",
            ],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof Zap;
            return (
              <li key={t as string} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--tint-blue)] ring-1 ring-[var(--line)]">
                  <I className="h-5 w-5 text-[var(--blue)]" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-[14.5px] font-bold text-[var(--ink)]">{t as string}</p>
                  <p className="mt-0.5 text-[13px] text-[var(--slate)]">{d as string}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Foto de um recurso do carrinho, no formato 4:3. */
function RecursoFoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(70%_70%_at_50%_70%,rgba(60,110,255,0.4),#070b22)]">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

export function Recursos() {
  const itens = [
    {
      t: "Joystick fácil",
      d: "Dois joysticks ao lado do banco: frente, ré, curva e giro.",
      foto: (
        <RecursoFoto
          src="/fotos/joystick.webp"
          alt="Mãos de criança nos dois joysticks do carrinho"
        />
      ),
    },
    {
      t: "Giro 360°",
      d: "Gira no próprio lugar, igualzinho ao bate-bate do parque.",
      foto: (
        <RecursoFoto src="/fotos/giro-360.webp" alt="Criança girando no carrinho bate-bate azul" />
      ),
    },
    {
      t: "Luzes de LED",
      d: "A base acende em volta do carrinho e deixa cada volta mais legal.",
      foto: (
        <RecursoFoto
          src="/produtos/detalhe-led.webp"
          alt="Base do carrinho com as luzes de LED acesas"
        />
      ),
    },
    {
      t: "Cinto e para-choque",
      d: "Cinto de segurança no banco e borda emborrachada em volta.",
      foto: (
        <RecursoFoto
          src="/produtos/detalhe-cinto.webp"
          alt="Fivela do cinto de segurança do carrinho"
        />
      ),
    },
  ];
  return (
    <section id="recursos" className="band-sky scroll-mt-28 border-y border-[var(--line)]">
      <div className="container-edge py-16 md:py-24">
        <div className="md:flex md:items-end md:justify-between md:gap-10">
          <div>
            <Eyebrow>Feito para pilotos pequenos</Eyebrow>
            <Display top="Gira, bate" em="e acende" className="mt-4 text-[52px] md:text-[76px]" />
          </div>
          <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-[var(--slate)] md:mt-0 md:text-right">
            Tudo o que faz o bate-bate ser o brinquedo favorito do parque, do tamanho da criança.
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {itens.map((x) => (
            <li key={x.t} className="card-soft overflow-hidden">
              {x.foto}
              <div className="p-4 md:p-5">
                <p className="font-display text-[22px] font-extrabold uppercase leading-none text-[var(--ink)] md:text-[26px]">
                  {x.t}
                </p>
                <p className="mt-2 text-[12.5px] leading-snug text-[var(--slate)] md:text-[13px]">
                  {x.d}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ComoFunciona() {
  const passos = [
    {
      t: "Carregue",
      d: "Coloque a bateria para carregar antes da primeira volta, como mostra o manual.",
    },
    {
      t: "Aperte o cinto",
      d: "A criança senta no banco acolchoado e prende o cinto de segurança.",
    },
    { t: "Pilote", d: "Com os dois joysticks ela anda para frente, para trás e gira 360°." },
  ];
  return (
    <section id="como-funciona" className="container-edge scroll-mt-28 py-16 md:py-24">
      <Eyebrow>Fácil de começar</Eyebrow>
      <Display
        top="Carregou, sentou,"
        em="saiu girando"
        className="mt-4 text-[52px] md:text-[76px]"
      />
      <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
        {passos.map((p, n) => (
          <li
            key={p.t}
            className="card-soft relative overflow-hidden !bg-[linear-gradient(160deg,var(--card-bg),var(--tint-blue))] p-6 after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-[linear-gradient(90deg,#5f92ff,var(--lime))]"
          >
            <p className="font-display text-[56px] font-extrabold leading-none text-[var(--blue)]">
              0{n + 1}
            </p>
            <p className="mt-5 font-display text-[28px] font-extrabold uppercase text-[var(--ink)]">
              {p.t}
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--slate)]">{p.d}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-[12px] text-[var(--slate)]">
        Para piso liso, dentro de casa ou no quintal cimentado. Brinque sempre com um adulto por
        perto.
      </p>
    </section>
  );
}

const FRASE_COR: Record<string, string> = {
  Azul: "Azul espacial, com astronauta e planetas.",
  Rosa: "Rosa vibrante, com o mesmo tema de galáxia.",
  Roxo: "Roxo galáxia, cheio de estrelas.",
};

export function Cores() {
  return (
    <section
      id="cores"
      className="relative scroll-mt-28 overflow-hidden border-y border-[var(--line)]"
    >
      <div className="container-edge py-16 md:py-24">
        <div className="text-center">
          <Eyebrow className="justify-center">Azul, rosa ou roxo</Eyebrow>
          <Display
            top="Uma cor para"
            em="cada piloto"
            className="mx-auto mt-4 text-[52px] md:text-[76px]"
          />
          <p className="mx-auto mt-4 max-w-md text-[14.5px] text-[var(--slate)]">
            Levando 2 ou 3, você escolhe a cor de cada carrinho. Perfeito para irmãos e primos.
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-3 gap-3 sm:mt-12 sm:gap-5">
          {CORES.map((c) => (
            <li key={c.id} className="text-center">
              <div className="relative mx-auto max-w-[340px]">
                <span
                  className="car-glow inset-x-[12%] bottom-[2%] h-[22%]"
                  style={{ background: GLOW[c.id] }}
                />
                <img
                  src={c.recorte}
                  alt={`Carrinho bate-bate ${c.id.toLowerCase()}`}
                  width={1000}
                  height={760}
                  loading="lazy"
                  className="car-float relative w-full"
                  style={{ animationDelay: `${CORES.indexOf(c) * -1.8}s` }}
                />
              </div>
              <p className="mt-3 flex items-center justify-center gap-1.5 font-display text-[20px] font-extrabold uppercase text-[var(--ink)] sm:mt-5 sm:gap-2 sm:text-[30px]">
                <span
                  className="h-3 w-3 rounded-full ring-2 ring-white/30"
                  style={{ background: c.hex }}
                />
                {c.id}
              </p>
              <p className="mt-1 hidden text-[13px] text-[var(--slate)] sm:block">
                {FRASE_COR[c.id]}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex justify-center">
          <LimeLink to="/produto" hash="escolha" className="w-full max-w-[320px]">
            Escolher as cores
          </LimeLink>
        </div>
      </div>
    </section>
  );
}

export function Medidas() {
  const linhas: [string, string][] = [
    ["Idade", FICHA.idade],
    ["Peso máximo", FICHA.pesoMax],
    ["Largura", FICHA.largura],
    ["Altura", FICHA.altura],
    ["Energia", "Bateria recarregável"],
    ["Comandos", "2 joysticks"],
    ["Movimentos", "Frente, ré, curva e giro 360°"],
    ["Segurança", "Cinto e para-choque emborrachado"],
    ["Luzes", "LED na base"],
    ["Cores", CORES.map((c) => c.id).join(", ")],
  ];
  return (
    <section id="medidas" className="band-sky scroll-mt-28 border-y border-[var(--line)]">
      <div className="container-edge grid items-center gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-24">
        <img
          src="/produtos/info-medidas.webp"
          alt={`Carrinho azul com as medidas: ${FICHA.largura} de largura e ${FICHA.altura} de altura`}
          width={1200}
          height={1200}
          loading="lazy"
          className={`aspect-square w-full rounded-2xl object-cover ${shadow}`}
        />
        <div>
          <Eyebrow>Ficha técnica</Eyebrow>
          <Display top="Do tamanho" em="certinho" className="mt-4 text-[52px] md:text-[72px]" />
          <p className="mt-4 text-[14.5px] text-[var(--slate)]">
            Compacto para a sala, firme para as batidinhas.
          </p>
          <dl className="mt-7 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {linhas.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 py-3">
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--slate)]">
                  {k}
                </dt>
                <dd className="text-right text-[14px] font-semibold text-[var(--ink)]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function Seguranca() {
  return (
    <section className="container-edge grid items-center gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-24">
      <div className="md:order-2">
        <img
          src="/produtos/info-seguranca.webp"
          alt="Detalhes do carrinho: cinto de segurança, assento macio, rodinhas e para-choque"
          width={1200}
          height={1200}
          loading="lazy"
          className={`aspect-square w-full rounded-2xl object-cover ${shadow}`}
        />
      </div>
      <div>
        <Eyebrow>Pensado nos detalhes</Eyebrow>
        <Display top="Seguro" em="e confortável" className="mt-4 text-[52px] md:text-[72px]" />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            ["/produtos/detalhe-cinto.webp", "Cinto de segurança", "Prende a criança no banco."],
            ["/produtos/detalhe-assento.webp", "Assento macio", "Encosto acolchoado."],
            ["/produtos/detalhe-parachoque.webp", "Para-choque", "Borda emborrachada em volta."],
            ["/produtos/detalhe-rodas.webp", "Rodinhas", "Deslizam pelo piso liso."],
          ].map(([img, t, d]) => (
            <li key={t} className="card-soft flex items-center gap-3 p-3">
              <img
                src={img}
                alt=""
                loading="lazy"
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-[var(--lime)]"
              />
              <span>
                <span className="block text-[14px] font-bold text-[var(--ink)]">{t}</span>
                <span className="block text-[12px] text-[var(--slate)]">{d}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex items-start gap-2 text-[12.5px] leading-relaxed text-[var(--slate)]">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--blue)]" />
          Para {FICHA.idade}, até {FICHA.pesoMax}. Use em piso liso, longe de escadas, piscina e
          rua, sempre com um adulto olhando.
        </p>
      </div>
    </section>
  );
}

export function Presente() {
  return (
    <section className="band-sky border-y border-[var(--line)]">
      <div className="container-edge grid items-center gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-24">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src="/fotos/crianca-dirigindo-b.webp"
            alt="Menino feliz no carrinho bate-bate azul em casa"
            width={487}
            height={558}
            loading="lazy"
            className={`aspect-[4/5] w-full object-cover ${shadow}`}
          />
          <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-md bg-[var(--dark)]/80 px-3 py-2 text-[9.5px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
            <Heart className="h-3.5 w-3.5 fill-[var(--lime)] text-[var(--lime)]" />
            Natal · Aniversário · Dia das Crianças
          </span>
        </div>
        <div>
          <Eyebrow>O presente que eles não esperam</Eyebrow>
          <Display
            top="A cara deles"
            em="ao abrir a caixa"
            className="mt-4 text-[52px] md:text-[72px]"
          />
          <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-[var(--slate)]">
            Um presente de verdade: grande, colorido e para brincar todo dia, não só no dia da
            festa.
          </p>
          <ul className="mt-6 space-y-3 text-[13.5px] text-[var(--ink)]">
            {[
              "Embrulho de presente com cartão no checkout",
              FREE_SHIPPING_LABEL,
              `Garantia de ${brand.garantiaDias} dias`,
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--lime)] text-[var(--on-lime)]">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <LimeLink to="/produto" hash="escolha" className="mt-8 w-full max-w-[330px]">
            Escolher o presente
          </LimeLink>
          <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-[var(--slate)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--blue)]" /> Para crianças de {FICHA.idade}.
          </p>
        </div>
      </div>
    </section>
  );
}
