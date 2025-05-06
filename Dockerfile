FROM node:24-slim AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install pnpm -g
RUN pnpm install

COPY . ./

RUN pnpm build

FROM nginx:stable-alpine

EXPOSE 80

COPY --from=builder /app/dist /usr/share/nginx/html
