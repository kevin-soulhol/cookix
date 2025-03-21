# Projet Cookix - Récapitulatif

## Objectif du projet
Cookix est une application web de gestion de recettes de cuisine avec un focus sur les recettes pour le Monsieur Cuisine Smart. L'application permet aux utilisateurs de découvrir, sauvegarder et organiser des recettes, créer des menus hebdomadaires et générer automatiquement des listes de courses.

## Fonctionnalités principales
- Consultation d'une base de données de recettes Monsieur Cuisine Smart
- Système de favoris pour sauvegarder des recettes
- Planificateur de menu hebdomadaire
- Génération automatique de listes de courses basées sur les menus hebdomadaires
- Web scraping automatisé (une fois par semaine) pour récupérer des recettes de sites culinaires
- Partage de la liste de courses

## Architecture technique
Le projet est structuré selon une architecture moderne:
- **Frontend/Backend**: Remix (framework full-stack JavaScript/TypeScript)
- **Base de données**: MariaDB
- **ORM**: Prisma pour la gestion des modèles de données
- **Conteneurisation**: Docker et Docker Compose
- **Web Scraping**: Playwright pour extraire des recettes automatiquement

## Structure du projet
```
cookix/
├── app/                      # Code source principal Remix
│   ├── components/           # Composants UI réutilisables
│   ├── models/               # Modèles de données et logique métier
│   ├── routes/               # Routes et pages de l'application
│   ├── services/             # Services (auth, etc.)
│   ├── styles/               # Feuilles de style
│   ├── entry.client.tsx      # Point d'entrée côté client
│   └── entry.server.tsx      # Point d'entrée côté serveur
├── prisma/                   # Configuration Prisma
│   ├── schema.prisma         # Schéma de base de données
│   └── migrations/           # Migrations de base de données
├── scripts/                  # Scripts utilitaires
│   └── scraper/              # Code du scraper de recettes
│       ├── index.js          # Script principal de scraping
│       ├── package.json      # Dépendances du scraper
│       └── prisma/           # Configuration Prisma pour le scraper
├── public/                   # Fichiers statiques
├── Dockerfile                # Configuration Docker pour l'app principale
├── scraper.Dockerfile        # Configuration Docker pour le scraper
├── docker-compose.yml        # Orchestration des services
└── .env                      # Variables d'environnement
```

## Modèles de données (Prisma Schema)
- **Recipe**: Informations de base sur les recettes (titre, description, temps de préparation, etc.)
- **Ingredient**: Base de données d'ingrédients
- **RecipeIngredient**: Association entre recettes et ingrédients avec quantités
- **RecipeStep**: Étapes de préparation des recettes
- **Favorite**: Recettes favorites des utilisateurs
- **Menu**: Planification de menus hebdomadaires
- **MenuItem**: Éléments individuels d'un menu
- **ShoppingList**: Listes de courses générées
- **ShoppingItem**: Éléments individuels d'une liste de courses

## Configuration Docker
- **app**: Service principal exécutant l'application Remix sur Node.js 22
- **db**: Service de base de données MariaDB
- **scraper**: Service de web scraping utilisant Playwright

## Web Scraping
Le scraper est configuré pour extraire des recettes de sites culinaires comme Cookomix. Il récupère:
- Titres et descriptions des recettes
- Temps de préparation et de cuisson
- Nombre de portions
- Niveau de difficulté
- Notes des recettes
- Images
- Ingrédients avec quantités et unités
- Étapes de préparation

Le scraper est conçu pour naviguer à travers les catégories de recettes et extraire un nombre limité de recettes par catégorie (pour le développement et les tests).

## Développement et déploiement
- Environnement de développement entièrement dockerisé
- Volumes Docker pour le développement en temps réel
- Migrations Prisma pour la gestion du schéma de base de données
- Configuration optimisée pour le rechargement à chaud pendant le développement

Cette application vise à fournir une expérience utilisateur fluide pour les amateurs de cuisine, en particulier ceux qui utilisent le Thermomix, en simplifiant la découverte de recettes et la planification des repas.