FROM node:22-alpine AS base

# Installer les dépendances nécessaires pour Prisma
RUN apk add --no-cache openssl

# Configuration de l'environnement de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./
COPY start.sh ./
RUN chmod +x start.sh

# Installer les dépendances
FROM base AS deps
RUN npm ci

# Builder l'application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Configuration de l'image finale
FROM base AS runner
ENV NODE_ENV=production

# Copier les fichiers construits et les dépendances
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/prisma-migrate.sh ./
RUN chmod +x ./prisma-migrate.sh

# Copie du build d'entrée
COPY --from=builder /app/start.sh ./
RUN chmod +x ./start.sh

# Configuration des ports et commandes
EXPOSE 3000 5555

# Commande pour exécuter l'application
ENTRYPOINT ["./start.sh"]