#
# Builder image
#
FROM node:12 as builder
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY pages ./pages
COPY next-env.d.ts tsconfig.json ./

ENV NODE_ENV production
RUN npm run build

#
# Final image
#
FROM node:12
WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

ENV NODE_ENV production
ENV PORT 80
CMD npm run start -- -p $PORT
