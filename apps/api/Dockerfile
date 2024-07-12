FROM node:18-alpine AS base
ARG PNPM_VERSION=8.6.2
ENV PNPM_HOME=/usr/local/bin

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=@repo/api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=@repo/api

# # Build global
# WORKDIR /app/build/packages/global

# RUN pnpm build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=installer /app/apps/api/package.json .

# Automatically leverage output traces to reduce image size
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/dist dist/
COPY --from=installer --chown=nestjs:nodejs /app/node_modules node_modules/
COPY --from=installer --chown=nestjs:nodejs /app/packages packages/


CMD ["/bin/sh", "-c", "node dist/main.js"]