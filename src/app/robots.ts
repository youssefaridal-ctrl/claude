import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { appUrl } from "@/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Member app, auth, and API are never crawlable.
        disallow: ["/api/", "/today", "/practice", "/progress", "/commons", "/settings", "/admin", "/signin", "/styleguide", "/preview"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
