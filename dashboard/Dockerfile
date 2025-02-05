FROM node:22.13.1-alpine

WORKDIR /dashboard

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . ./
RUN pnpm build
