# Production image (self-hosted path). Multi-stage; final image runs as
# non-root on the Next.js standalone output.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund && npx prisma generate

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S selv && adduser -S selv -G selv
COPY --from=builder --chown=selv:selv /app/.next/standalone ./
COPY --from=builder --chown=selv:selv /app/.next/static ./.next/static
COPY --from=builder --chown=selv:selv /app/public ./public
USER selv
EXPOSE 3000
CMD ["node", "server.js"]
