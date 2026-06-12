FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev && npm cache clean --force

FROM node:20-alpine AS runner

ENV NODE_ENV=production
ENV PORT=5000
ENV API_LOG_DIR=/app/logs

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node package.json server.js ./
COPY --chown=node:node clients ./clients
COPY --chown=node:node services ./services
COPY --chown=node:node utils ./utils

RUN mkdir -p /app/logs && chown -R node:node /app

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 5000) + '/health').then((res) => process.exit(res.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
