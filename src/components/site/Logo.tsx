import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Logo da loja (imagem da marca em public/marca/logo.webp, 640×306). */
export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <img
      src="/marca/logo.webp"
      alt={brand.name}
      width={640}
      height={306}
      className={cn(
        "block w-auto select-none",
        size === "sm" && "h-10",
        size === "md" && "h-12 md:h-[58px]",
        size === "lg" && "h-16 md:h-20",
        className,
      )}
    />
  );
}
