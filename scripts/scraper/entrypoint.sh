#!/bin/bash

# Démarrer le service cron
service cron start

# Afficher le statut de cron pour vérifier qu'il est bien lancé
service cron status

echo "Cron service started. Scheduled task will run every Monday at 2:00 AM."
echo "Current cron jobs configured:"
crontab -l

# Exécuter immédiatement le script au démarrage (optionnel, à commenter si non souhaité)
echo "Running initial scrape on startup..."
node /app/index.js

# Garder le conteneur en vie en surveillant les logs
echo "Container running, monitoring logs..."
tail -f /var/log/cron.log