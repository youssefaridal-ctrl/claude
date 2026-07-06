// Next.js App Router requires 'unsafe-inline' for its inline hydration scripts
// (streaming RSC payloads, __NEXT_DATA__, next-themes init). Without it, React
// won't hydrate and animations / interactive features will not work.
// connect-src includes ws: for dev HMR; prod builds only need 'self'.
const isDev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com",
  "font-src 'self'",
  isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
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
