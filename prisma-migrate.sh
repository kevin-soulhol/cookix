#!/bin/bash
set -e

# Définir le type d'action (généralement "dev", "reset" ou "deploy")
ACTION=${1:-dev}
NAME=${2:-""}

echo "Running Prisma migration: $ACTION"

# Pour le développement (création d'une nouvelle migration)
if [ "$ACTION" = "dev" ]; then
  npx prisma migrate dev${NAME:+ --name $NAME}
# Pour réinitialiser la base de données
elif [ "$ACTION" = "reset" ]; then
  npx prisma migrate reset --force
# Pour déployer en production
elif [ "$ACTION" = "deploy" ]; then
  npx prisma migrate deploy
else
  echo "Unknown action: $ACTION"
  echo "Usage: ./prisma-migrate.sh [dev|reset|deploy] [migration-name]"
  exit 1
fi

# Générer le client Prisma après la migration
echo "Generating Prisma client..."
npx prisma generate