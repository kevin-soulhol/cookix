# Stage de build
FROM node:22-alpine AS builder

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci

# Copie des sources et build
COPY . .
RUN npm run build
RUN npm install -g prisma
RUN npm install -g @prisma/client
RUN npx prisma generate

# Stage de production
FROM node:22-alpine AS runner

WORKDIR /app

# Installation des dépendances de production + dotenv
COPY package*.json ./
RUN npm ci --production && npm install dotenv

# Copie des fichiers nécessaires depuis le stage de build
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/start.sh ./start.sh

RUN mkdir -p /app/uploads
RUN chmod 777 /app/uploads

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Commande de démarrage mise à jour pour exécuter les migrations
RUN chmod +x ./start.sh
CMD ["./start.sh"] 