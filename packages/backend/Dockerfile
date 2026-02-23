# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY tsconfig.json drizzle.config.ts ./
COPY src ./src
COPY drizzle ./drizzle
COPY faq.md ./

RUN npm run build

# Run stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV DB_PATH=/app/data/db.sqlite

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/faq.md ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/drizzle.config.ts ./
RUN npm install drizzle-kit --save

RUN mkdir -p /app/data

EXPOSE 8080 4983

CMD ["node", "dist/server.js"]
