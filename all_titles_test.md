# Liste des tests E2E pour l'application Cookix

## Homepage (Page d'accueil)
- Chargement de la page d'accueil
- Recherche sans résultats
- Recherche avec résultats
- Filtrage par catégorie
- Filtrage par type de repas
- Filtrage par temps de préparation
- Affichage des résultats en mode aléatoire
- Pagination des résultats de recherche
- Tri des recettes par différents critères
- Ouverture des filtres avancés
- Réinitialisation des filtres

## Recipe Detail (Page de détail d'une recette)
- Affichage des détails d'une recette
- Navigation entre les onglets (ingrédients, instructions, description)
- Ajout d'une recette aux favoris
- Suppression d'une recette des favoris
- Ajout d'une recette au menu hebdomadaire
- Affichage des informations de préparation (temps, difficulté, portions)
- Vérification des étapes de préparation
- Vérification de la liste d'ingrédients
- Fermeture du modal de la recette
- Accès au site source de la recette

## Menu (Gestion du menu hebdomadaire)
- Chargement de la page du menu
- Vérification du menu vide
- Affichage des recettes dans le menu
- Suppression d'une recette du menu
- Recherche dans les recettes du menu
- Partage du menu avec un autre utilisateur
- Acceptation d'une invitation de partage de menu
- Refus d'une invitation de partage
- Vérification des menus partagés
- Accès à la liste de courses depuis le menu

## Shopping List (Liste de courses)
- Chargement de la page de liste de courses
- Vérification de la liste vide
- Affichage des articles dans la liste
- Cochage d'un article
- Décochage d'un article
- Suppression d'un article
- Ajout manuel d'un article
- Changement de catégorie d'un article (marché/supermarché)
- Suppression des articles cochés
- Partage de la liste de courses

## Authentication (Authentification)
- Accès à la page de connexion
- Connexion avec identifiants valides
- Connexion avec identifiants invalides
- Création d'un nouveau compte
- Tentative de création d'un compte avec email existant
- Déconnexion
- Accès aux pages protégées sans authentification
- Redirection après connexion réussie
- Réinitialisation de mot de passe

## User Profile (Profil utilisateur)
- Affichage du profil utilisateur
- Modification des informations de profil
- Modification du mot de passe
- Tentative de modification avec mot de passe incorrect
- Affichage des statistiques d'utilisation
- Suppression du compte

## Favorite Recipes (Recettes favorites)
- Affichage de la liste des favoris
- Liste des favoris vide
- Suppression d'une recette des favoris
- Ajout d'une recette aux favoris depuis la liste

## Shared Contents (Contenu partagé)
- Affichage des éléments partagés
- Acceptation d'une invitation de partage
- Refus d'une invitation de partage
- Partage d'un menu avec un utilisateur
- Partage d'une liste de courses
- Suppression d'un partage
- Vérification des invitations en attente

## Mobile Responsiveness (Adaptation mobile)
- Affichage de la barre de navigation mobile
- Navigation entre les sections principales sur mobile
- Fermeture/ouverture du menu sur mobile
- Affichage correct des listes de recettes sur petit écran
- Adaptation du filtrage sur mobile
- Adaptation de la page de recette sur mobile

## Error handling (Gestion des erreurs)
- Accès à une page inexistante (404)
- Accès à une recette inexistante
- Problème de connexion à la base de données
- Erreur lors de l'ajout d'un article à la liste de courses
- Récupération après une erreur réseau