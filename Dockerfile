FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production

RUN apk upgrade --no-cache

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .


FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules/npm \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.js ./server.js

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["node", "server.js"]