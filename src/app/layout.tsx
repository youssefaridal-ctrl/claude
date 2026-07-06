import type { ReactNode } from "react";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import "@/styles/globals.css";

/**
 * Type stack (design/04 §2): licensed faces (Söhne/Tiempos) swap in via
 * next/font/local in production; these are the specified open fallbacks,
 * self-hosted by next/font — zero layout shift, no third-party requests.
 */
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata = buildMetadata({});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          الانتقال إلى المحتوى
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
