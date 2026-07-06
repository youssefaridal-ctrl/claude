import type { MetadataRoute } from "next";
import { appUrl } from "@/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Member app, auth, and API are never crawlable.
        disallow: ["/api/", "/today", "/practice", "/progress", "/commons", "/settings", "/admin", "/signin"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
