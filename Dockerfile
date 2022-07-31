FROM node:16.16-alpine3.16

WORKDIR /app

COPY package*.json .

COPY prisma ./prisma

RUN npm ci --legacy-peer-deps

COPY --chown=node:node . .

COPY --chown=node:node ./.env.example ./.env

EXPOSE ${PORT}

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]