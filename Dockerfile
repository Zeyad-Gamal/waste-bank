FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN apk upgrade --no-cache

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN rm -f package.json package-lock.json

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["node", "server.js"]