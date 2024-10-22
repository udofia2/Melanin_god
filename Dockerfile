FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY prisma ./prisma

RUN npx prisma generate

RUN npm run build

#FROM node:18-alpine

#WORKDIR /app

#COPY --from=builder /app/dist ./dist

#COPY --from=builder /app/node_modules ./node_modules

#COPY package*.json ./

#COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
