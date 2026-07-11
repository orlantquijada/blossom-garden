import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function qrUrl(value: string, size = 180) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
}
