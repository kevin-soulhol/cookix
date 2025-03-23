#!/bin/bash
set -e

# Reconstruire et redémarrer les conteneurs
docker-compose down
docker-compose build
docker-compose up -d

# Exécuter les migrations de base de données
docker-compose exec -T app npx prisma migrate deploy

echo "Déploiement terminé avec succès!"

