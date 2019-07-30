#
# Builder image
#
FROM node:12 as builder
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY src ./src
COPY tsconfig.build.json tsconfig.json nest-cli.json ./

ENV NODE_ENV production
RUN npm run build

#
# Final image
#
FROM node:12
WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY config ./config

ENV NODE_ENV production
ENV PORT 80
CMD npm run start:prod
