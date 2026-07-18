import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { renderSVG } from "uqr";
import type { ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// Rendered locally so member codes never leave the app; callers size via CSS.
export function qrUrl(value: string) {
  const svg = renderSVG(value, { border: 0, whiteColor: "transparent" });

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
