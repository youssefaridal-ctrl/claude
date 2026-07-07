import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SELV — Inner Architecture",
    short_name: "SELV",
    description:
      "Confidence is not a feeling. It's an architecture. Daily practice for rewriting your inner dialogue.",
    start_url: "/today",
    display: "standalone",
    background_color: "#0E0D0B",
    theme_color: "#0E0D0B",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
