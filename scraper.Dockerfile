FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Configuration Playwright avant l'installation
ENV PLAYWRIGHT_BROWSERS_TIMEOUT=180000
ENV PLAYWRIGHT_DOWNLOAD_HOST=https://playwright-eu.azureedge.net

# Installation des dépendances système
RUN apt-get update && \
    apt-get install -y cron && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Stratification intelligente des dépendances
COPY ./scripts/scraper/package*.json ./
RUN npm install --production --unsafe-perm && \
    npx playwright install --with-deps chromium

# Copie des éléments spécifiques au projet
COPY ./prisma ./prisma/
COPY ./scripts/scraper/index.js ./
COPY .env ./

# Génération Prisma (optimisation du cache)
RUN npx prisma generate

# Configuration Cron (méthode plus robuste)
RUN echo "0 2 * * 1 root cd /app && /usr/bin/node index.js >> /var/log/cron.log 2>&1" > /etc/cron.d/scraper-cron && \
    chmod 0644 /etc/cron.d/scraper-cron && \
    crontab /etc/cron.d/scraper-cron && \
    touch /var/log/cron.log && \
    chmod 0666 /var/log/cron.log

# Gestion des entrées/sorties
COPY ./scripts/scraper/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["/bin/bash", "./entrypoint.sh"]
