# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# Add labels for metadata
LABEL maintainer="AGM Technology"
LABEL name="agm-hub"
LABEL version="1.0"
LABEL description=""

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production 


# AGM API
ENV AGM_API_URL=${AGM_API_URL}

# NextAuth
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# agm-next-auth - OAuth2.0 Client Credentials
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

# firebase_adminsdk - Service Account Credentials
ENV FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
ENV FIREBASE_CLIENT_EMAIL=${FIREBASE_CLIENT_EMAIL}
ENV FIREBASE_PRIVATE_KEY=${FIREBASE_PRIVATE_KEY}

# agm-dashboard - Firebase App Config
ENV FIREBASE_CONFIG_API_KEY=${FIREBASE_CONFIG_API_KEY}
ENV FIREBASE_CONFIG_AUTH_DOMAIN=${FIREBASE_CONFIG_AUTH_DOMAIN}
ENV FIREBASE_CONFIG_PROJECT_ID=${FIREBASE_CONFIG_PROJECT_ID}
ENV FIREBASE_CONFIG_STORAGE_BUCKET=${FIREBASE_CONFIG_STORAGE_BUCKET}
ENV FIREBASE_CONFIG_MESSAGING_SENDER_ID=${FIREBASE_CONFIG_MESSAGING_SENDER_ID}
ENV FIREBASE_CONFIG_APP_ID=${FIREBASE_CONFIG_APP_ID}

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ARG PORT
EXPOSE ${PORT}
ENV PORT=${PORT}

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]