import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** UTC date-only value for habit/challenge day keys, stable across timezones. */
export function toDateOnly(date: Date, timezone = "UTC"): Date {
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return new Date(`${formatted}T00:00:00.000Z`);
}
