FROM node:22-alpine

WORKDIR /app

# Installation des dépendances système nécessaires pour Prisma
RUN apk add --no-cache openssl

# Copie des fichiers de dépendances
COPY package.json package-lock.json ./

# Copie du schéma Prisma
COPY ./prisma ./prisma/
COPY ./scripts/scraper/index.js ./

# Installation des dépendances Node.js
RUN npm ci

# Copie du reste du code source
COPY . .

# Construction de l'application Remix
RUN npm run build

# Ajouter après l'installation des dépendances
RUN npx prisma generate

# Exposition du port
EXPOSE 3000 5555

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]