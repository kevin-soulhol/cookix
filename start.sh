#!/bin/sh

# Attendre que la base de données soit prête
echo "Waiting for database to be ready..."
npx wait-on tcp:db:3306 -t 30000

# Exécuter les migrations et seeds Prisma
echo "Setting up database..."
npm run db:setup

# Démarrer l'application
echo "Starting application..."
npm run dev