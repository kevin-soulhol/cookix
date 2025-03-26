FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Installation de cron
RUN apt-get update && apt-get install -y cron

WORKDIR /app

# Copie des fichiers de dépendances uniquement
COPY ./scripts/scraper/package.json ./scripts/scraper/package-lock.json ./

# Installation des dépendances
RUN npm install

# Configurer le répertoire de cache pour les navigateurs Playwright
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Copie du schéma Prisma
COPY ./prisma ./prisma/
COPY ./scripts/scraper/index.js ./
COPY .env ./

# Installation des navigateurs nécessaires
RUN if [ ! -d "/root/.cache/ms-playwright/chromium" ]; then \
    npx playwright install chromium; \
    fi

# Régénération du client Prisma avec les bons binaryTargets
RUN npx prisma generate

# Création du fichier crontab
RUN echo "0 2 * * 1 cd /app && node index.js >> /var/log/cron.log 2>&1" > /etc/cron.d/scraper-cron
RUN chmod 0644 /etc/cron.d/scraper-cron
RUN crontab /etc/cron.d/scraper-cron

# Créer le fichier de log
RUN touch /var/log/cron.log
RUN chmod 0666 /var/log/cron.log

# Copie du script d'entrée
COPY ./scripts/scraper/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

# Le point d'entrée lance cron et maintient le conteneur actif
ENTRYPOINT ["./entrypoint.sh"]