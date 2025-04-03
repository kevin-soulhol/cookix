FROM mcr.microsoft.com/playwright:v1.40.0-focal
# Réduire la taille de l'image et l'utilisation des ressources
RUN apt-get update && \
    apt-get install -y --no-install-recommends cron && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copie des fichiers de dépendances uniquement
COPY ./scripts/scraper/package.json ./scripts/scraper/package-lock.json ./

# Installation des dépendances en incluant playwright 
RUN npm install && \
    npm cache clean --force

# Configurer le répertoire de cache pour les navigateurs Playwright
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
# Réduire l'utilisation de mémoire par Playwright
ENV NODE_OPTIONS="--max-old-space-size=128"

# Copie du schéma Prisma
COPY ./prisma ./prisma/
COPY ./scripts/scraper/index.js ./
COPY .env ./

# Installation seulement de Chromium avec la commande node_modules
RUN if [ ! -d "/ms-playwright/chromium" ]; then \
    npx playwright install chromium; \
    fi

# Régénération du client Prisma avec les bons binaryTargets
RUN npx prisma generate

# Exécuter à 2h du matin tous les dimanches
RUN echo "0 2 * * * cd /app && node index.js >> /var/log/cron.log 2>&1" > /etc/cron.d/scraper-cron
RUN chmod 0644 /etc/cron.d/scraper-cron
RUN crontab /etc/cron.d/scraper-cron

# Créer le fichier de log
RUN touch /var/log/cron.log
RUN chmod 0666 /var/log/cron.log

# Script d'entrée pour le scraper
COPY ./scripts/scraper/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

# Le point d'entrée lance cron et maintient le conteneur actif
ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]