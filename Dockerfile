# ÉTAPE 1: Base - Utiliser une image Debian-based (Bookworm) qui est compatible avec Playwright
# Alpine n'est PAS compatible avec les navigateurs comme Chromium.
FROM node:22-bookworm-slim AS base

# Mettre à jour les paquets système pour obtenir les derniers patchs de sécurité
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# Définir l'environnement de travail
WORKDIR /app

# Définir une variable d'environnement pour que Playwright sache où trouver les navigateurs
# C'est une bonne pratique pour éviter les soucis de permissions dans des répertoires système.
ENV PLAYWRIGHT_BROWSERS_PATH=/app/pw-browsers

# --- ÉTAPE 2: Installation des Dépendances NPM et Playwright ---
FROM base AS deps

# Copier les fichiers de définition des dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances NPM
RUN npm ci

# Installer les dépendances système de Playwright ET le navigateur Chromium
# On cible uniquement Chromium pour garder l'image la plus légère possible.
RUN npx playwright install --with-deps chromium

# --- ÉTAPE 3: Build de l'Application Remix ---
FROM deps AS builder

COPY . .

# Générer le client Prisma (si nécessaire avant le build)
RUN npx prisma generate

# Construire l'application Remix
RUN npm run build

# --- ÉTAPE 4: Image Finale de Production ---
FROM builder AS runner

# Les fichiers sont déjà copiés de l'étape `builder`
# Assurons-nous simplement que les permissions sont bonnes
RUN chmod +x ./prisma-migrate.sh
RUN chmod +x ./start.sh

# Définir les ports
EXPOSE 3000

# Commande d'entrée
ENTRYPOINT ["./start.sh"]