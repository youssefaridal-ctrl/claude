# SELV verify skill

## Build
```bash
cd /home/user/claude
npm run build        # Next.js 15 App Router build (must pass clean)
```

## Launch dev server
```bash
PORT=3099 npm run dev > /tmp/dev-server.log 2>&1 &
sleep 10
curl -s http://localhost:3099/ -o /dev/null -w "%{http_code}"   # expect 200
```

## Run verification
Tests live in scratchpad; playwright installed at `node_modules/playwright` (version 1.61.1).
Chromium binary: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (symlink at `/opt/pw-browsers/chromium`).

```bash
NODE_PATH=/home/user/claude/node_modules \
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
npx playwright test --config <path-to-pw.config.ts>
```

### pw.config.ts (key bits)
```ts
import { defineConfig } from "playwright/test";  // NOT "@playwright/test"
export default defineConfig({
  projects: [{
    name: "chromium",
    use: {
      headless: true,
      launchOptions: {
        executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      },
      baseURL: "http://localhost:3099",
    },
  }],
});
```

## Gotchas
- `import from "playwright/test"` — `@playwright/test` is the CLI entry but resolves modules differently from /tmp; use `NODE_PATH` so the scratchpad config can find it.
- Framer Motion sets `opacity:0` on animated elements in SSR HTML. Call `page.waitForLoadState("networkidle")` before `toBeVisible()`, or elements will fail visibility checks.
- Auth redirects: Next.js dev server reports port 3000 as origin (NEXT_PUBLIC_APP_URL), so auth gate tests should use `request` fixture with `maxRedirects: 0` rather than browser navigation.
- Health API returns 503 when DB is unavailable (expected in CI). Test shape, not exact status code.
- `.env` needed for startup: copy `.env.example` and set `AUTH_SECRET` and `JOURNAL_MASTER_KEY` (hex, 64 chars).
- CSP must include `'unsafe-inline'` in `script-src` — Next.js App Router uses inline scripts for RSC streaming and theme init.
