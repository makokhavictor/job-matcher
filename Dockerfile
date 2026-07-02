# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_BACKEND_API_URL
ARG NEXT_PUBLIC_BACKEND_API_KEY
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_BASE_PATH
ENV NEXT_PUBLIC_BACKEND_API_URL $NEXT_PUBLIC_BACKEND_API_URL
ENV NEXT_PUBLIC_BACKEND_API_KEY $NEXT_PUBLIC_BACKEND_API_KEY
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID $NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_BASE_PATH $NEXT_PUBLIC_BASE_PATH
ENV NEXT_TELEMETRY_DISABLED 1

# Install pnpm
RUN npm install -g pnpm

RUN pnpm build

# Final production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Remove wget/curl/apk so a shell obtained inside the container can't
# pull down payloads. Do this before copying app files so the layer is cached.
RUN apk del --no-cache wget curl 2>/dev/null; \
    rm -rf /sbin/apk /etc/apk /usr/bin/wget /usr/bin/curl

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy only what's needed (standalone output — no pnpm/node_modules needed at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
