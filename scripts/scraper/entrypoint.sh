#!/bin/bash
set -e

# Limiter les ressources du processus
ulimit -n 1024
ulimit -u 50

# Démarrer le service cron
service cron start

# Vérifier l'état du service cron
status=$?
if [ $status -ne 0 ]; then
  echo "Échec du démarrage de cron: $status"
  exit 1
fi

# Exécuter immédiatement le script au démarrage (optionnel, à commenter si non souhaité)
echo "Running initial scrape on startup..."
#node /app/index.js

# Pour garder le conteneur actif sans consommer trop de ressources
# (au lieu d'une boucle active qui consommerait du CPU)
echo "Scraper configuré. Service cron démarré et exécution programmée."
echo "Conteneur prêt et en attente des tâches programmées."

# Plutôt que de faire tourner une boucle active, nous utilisons un tail sur le fichier de log
# Cette approche permet de surveiller les logs tout en utilisant très peu de ressources
exec tail -f /var/log/cron.log
