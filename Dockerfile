FROM --platform=$BUILDPLATFORM node:24-alpine AS build
WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn install --immutable

COPY . .
RUN NODE_ENV=production yarn build

# 本番環境
FROM caddy:2.10.0-alpine
EXPOSE 80
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /usr/share/caddy
