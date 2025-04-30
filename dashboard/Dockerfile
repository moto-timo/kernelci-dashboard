FROM node:22.15.0-alpine

WORKDIR /dashboard

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . ./
RUN pnpm build
