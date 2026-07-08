# syntax=docker/dockerfile:1.7
FROM node:22.22.0-alpine AS base

ENV UV_THREADPOOL_SIZE=64
ENV NEXT_TELEMETRY_DISABLED=1

# ---- deps: instala dependências ----
FROM base AS dependences
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS build
WORKDIR /app

COPY --from=dependences /app/node_modules ./node_modules
COPY . .

RUN yarn build

FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0


COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]
