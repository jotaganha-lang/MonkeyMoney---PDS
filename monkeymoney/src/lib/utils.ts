import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currency(value: number, code = "EUR") {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: code,
  }).format(value);
}
