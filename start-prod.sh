#!/bin/sh

# Attendre que la base de données soit prête
echo "Waiting for database to be ready..."
npx wait-on tcp:db:3306 -t 30000

# Exécuter les migrations Prisma
echo "Running database migrations..."
npx prisma migrate deploy

# Démarrer l'application avec Express
echo "Starting application in production mode..."
node server.js