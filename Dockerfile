FROM node:lts-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:lts-alpine AS production
WORKDIR /app
COPY --from=builder app/node_modules ./node_modules
COPY --from=builder app/dist ./dist
COPY --from=builder app/doc ./doc
COPY --from=builder app/package*.json ./
EXPOSE 4000
CMD [ "npm", "run", "start:prod"]
