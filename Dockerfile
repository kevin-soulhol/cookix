FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY ./prisma ./prisma/

RUN npm ci --production

COPY . .

RUN npm run build
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start"]