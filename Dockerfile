# ─────────────────────────────────────────────────────────────
# NextGen IT Hub — Multi-stage Production Dockerfile
# Follows OWASP Container Security Standards & CIS Benchmarks
# ─────────────────────────────────────────────────────────────

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY package*.json .npmrc* ./
COPY prisma ./prisma/
RUN npm ci --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

# Stage 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Security hardening: upgrade OS packages to latest patched versions and purge unused package managers
RUN apk update && apk upgrade --no-cache && \
    rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/bin/npm \
           /usr/local/bin/npx \
           /usr/local/lib/node_modules/corepack \
           /usr/local/bin/corepack \
           /opt/yarn* \
           /usr/local/bin/yarn* \
           /var/cache/apk/* /tmp/*

# Least-privilege non-root system user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
