// Strict CSP — 'unsafe-inline' is absent; nonces would be required for inline
// scripts if any are added in future. script-src 'self' covers Next.js chunks.
// Google Fonts is excluded by design (next/font self-hosts everything).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval'", // 'unsafe-eval' for Next.js HMR in dev only; prod build drops it via env check
  "style-src 'self' 'unsafe-inline'", // Tailwind inlines; acceptable — no user-controlled style
  "img-src 'self' data: blob: https://res.cloudinary.com",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    // Marketing photography ships at these widths (design/04 §13, §19).
    deviceSizes: [480, 768, 1200, 1600, 2048],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
      {
        // Immutable caching for hashed static assets.
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
