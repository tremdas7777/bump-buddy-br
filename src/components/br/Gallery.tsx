import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Galeria do produto: foto grande com setas e contador, miniaturas embaixo. No celular, arrasta. */
export function Gallery({
  images,
  alt,
  chip,
  note,
  focus,
}: {
  images: readonly string[];
  alt: string;
  chip: string;
  note?: ReactNode;
  /** Foto que a galeria mostra quando ela muda (ex.: a da cor escolhida). Não mexe na primeira abertura. */
  focus?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const aberta = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setI(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Trocou a cor: a galeria vai até a foto dela.
  const alvo = images[focus ?? 0];
  useEffect(() => {
    if (!aberta.current) {
      aberta.current = true;
      return;
    }
    const el = ref.current;
    const n = focus ?? 0;
    el?.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
    setI(n);
  }, [alvo]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (n: number) => {
    const el = ref.current;
    if (!el) return;
    const next = (n + images.length) % images.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setI(next);
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-[var(--dark)] shadow-[0_30px_60px_-30px_rgba(16,28,59,0.55)]">
        <div
          ref={ref}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, n) => (
            <img
              key={src}
              src={src}
              alt={n === 0 ? alt : `${alt}: foto ${n + 1}`}
              width={1200}
              height={1200}
              loading={n === 0 ? "eager" : "lazy"}
              fetchPriority={n === 0 ? "high" : undefined}
              className="aspect-square w-full shrink-0 snap-center object-cover"
            />
          ))}
        </div>
        <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-[var(--dark)]/75 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
          {chip}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          aria-label="Foto anterior"
          onClick={() => go(i - 1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] bg-[var(--card-bg)] text-[var(--blue)] shadow-sm transition hover:border-[var(--blue)]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
        </button>
        <p className="text-[12px] font-bold text-[var(--ink)]">
          {i + 1} <span className="mx-1 text-[var(--slate)]">/</span>{" "}
          <span className="text-[var(--slate)]">{images.length}</span>
        </p>
        <button
          type="button"
          aria-label="Próxima foto"
          onClick={() => go(i + 1)}
          className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] bg-[var(--card-bg)] text-[var(--blue)] shadow-sm transition hover:border-[var(--blue)]"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>

      <div className="mt-4 hidden gap-2.5 md:flex">
        {images.map((src, n) => (
          <button
            key={src}
            type="button"
            aria-label={`Ver foto ${n + 1}`}
            onClick={() => go(n)}
            className={cn(
              "h-16 w-16 overflow-hidden rounded-lg border-2 transition",
              n === i ? "border-[var(--blue)]" : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      {note && <div className="mt-3 text-[11.5px] text-[var(--slate)]">{note}</div>}
    </div>
  );
}
