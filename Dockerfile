FROM node:22-alpine

WORKDIR /app

# Installation des dépendances système nécessaires pour Prisma
RUN apk add --no-cache openssl

# Copie des fichiers de dépendances
COPY package.json package-lock.json ./

# Installation de toutes les dépendances, y compris les devDependencies
RUN npm ci

# Vérification que Remix est correctement installé
RUN npx --no-install remix --version || npm install --save-dev @remix-run/dev

# Copie du schéma Prisma
COPY ./prisma ./prisma/

# Génération du client Prisma
RUN npx prisma generate

# Copie du reste du code source
COPY . .

# Construction de l'application
RUN npm run build

EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "start"]