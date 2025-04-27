// scripts/seasonality-scraper.js
import { PrismaClient } from '@prisma/client';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function normalizeIngredientNameForScraping(name) {
  if (!name) return '';
  return name
    .trim()
    .toLowerCase()
    // Gérer les cas spécifiques avant la suppression générale du 's'
    //.replace(/^(petit)s?\s+(pois)$/i, '$1 $2') // Conserver "petit pois"
    // Supprimer les articles définis et indéfinis
    .replace(/^(l'|les|des|du|de la|le|la|un|une)\s+/i, '')
    // Supprimer le 's' final sauf pour certains cas comme 'pois', 'cassis', 'ananas' etc.
    // C'est délicat, on peut faire une suppression simple et ajuster si nécessaire
    .replace(/\s+/g, ' ') // Normaliser les espaces
    .normalize('NFD') // Séparer les caractères et leurs accents
    .replace(/[\u0300-\u036f]/g, ''); // Supprimer les diacritiques (accents)
}

function loadInitialData(filePath) {
  try {
    const absolutePath = path.resolve(filePath); // Assure un chemin absolu
    console.log(`Chargement des données initiales depuis: ${absolutePath}`);
    if (!fs.existsSync(absolutePath)) {
      console.warn(`Le fichier JSON ${absolutePath} n'a pas été trouvé. Démarrage avec des données vides.`);
      return { fruits: {}, vegetables: {} };
    }
    const jsonData = fs.readFileSync(absolutePath, 'utf-8');
    const parsedData = JSON.parse(jsonData);

    // Initialiser la structure attendue si le JSON est valide mais vide ou incomplet
    const initialData = {
      fruits: parsedData.fruits || {},
      vegetables: parsedData.vegetables || {}
    };

    // Pré-remplir la structure complète pour chaque ingrédient du JSON
    const monthKeys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    for (const category of ['fruits', 'vegetables']) {
        for (const name in initialData[category]) {
            const itemData = initialData[category][name];
            const completeItem = {
                isFruit: category === 'fruits',
                isVegetable: category === 'vegetables',
                isPerennial: false, // Sera calculé plus tard
                pollinatorFriendly: false, // Sera ajouté par Greenpeace si trouvé
            };
            monthKeys.forEach(month => {
                completeItem[month] = itemData[month] === true; // Assurer un booléen
            });
            initialData[category][name] = completeItem;
        }
    }
    console.log(`Données initiales chargées: ${Object.keys(initialData.fruits).length} fruits, ${Object.keys(initialData.vegetables).length} légumes.`);
    return initialData;

  } catch (error) {
    console.error(`Erreur lors du chargement ou du parsing du fichier JSON (${filePath}):`, error);
    console.warn('Démarrage avec des données vides à cause de l\'erreur.');
    return { fruits: {}, vegetables: {} }; // Retourne une structure vide en cas d'erreur
  }
}

async function scrapeSeasonalityData() {
  console.log('Démarrage du scraping de saisonnalité...');

  // AJOUT: Charger les données initiales depuis le JSON
  const seasonalData = loadInitialData('./seasonality.json'); // Chemin relatif vers votre JSON
  //const seasonalData = loadInitialData('/scripts/scraper/seasonality.json'); // Chemin relatif vers votre JSON

  console.log('Lancement du navigateur pour scraper Greenpeace...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // URL du calendrier de saisonnalité de Greenpeace
    await page.goto('https://www.greenpeace.fr/guetteur/calendrier/');

    // Attendre que la page soit chargée
    await page.waitForSelector('li.month');

    // Correspondance des noms de mois en français -> anglais (déjà présente)
    const monthMap = {
      'janvier': 'january', 'fevrier': 'february', 'mars': 'march', 'avril': 'april',
      'mai': 'may', 'juin': 'june', 'juillet': 'july', 'aout': 'august',
      'septembre': 'september', 'octobre': 'october', 'novembre': 'november', 'decembre': 'december'
    };

    const months = await page.$$('li.month');

    for (let i = 0; i < months.length; i++) {
      const monthElement = months[i];
      const monthId = await monthElement.$eval('a.anchor', anchor => anchor.getAttribute('id'));
      const monthName = await monthElement.$eval('h2', h2 => h2.textContent.trim().toLowerCase());
      const monthKey = monthMap[monthId] || monthId;

      console.log(`Traitement du mois (Greenpeace): ${monthName} (${monthKey})`);

      const isOpen = await monthElement.evaluate(el => el.classList.contains('open'));
      if (!isOpen) {
        try {
          await monthElement.$eval('header.month-header', header => header.click());
          await page.waitForTimeout(600); // Un peu plus de temps
        } catch (e) {
           console.warn(`Impossible d'ouvrir le mois ${monthName}: ${e.message}`);
           continue; // Passer au mois suivant si l'ouverture échoue
        }
      }

      // --- Récupérer les légumes (Greenpeace) ---
      const vegetablesSelector = `#${monthId}-legumes + article ul li`;
      const vegetables = await page.$$(vegetablesSelector);

      for (const veg of vegetables) {
        let name;
        let isPollinatorFriendly = false;
        try {
            name = await veg.evaluate(el => el.textContent.trim()); // Obtenir le nom brut
            isPollinatorFriendly = await veg.evaluate(el => el.classList.contains('icon-abeille'));
        } catch (e) {
            console.warn(`Impossible de lire un légume pour ${monthName}: ${e.message}`);
            continue;
        }

        // MODIFIÉ: Normaliser le nom AVANT de l'utiliser comme clé
        const normalizedName = normalizeIngredientNameForScraping(name);
        if (!normalizedName) continue; // Ignorer si le nom est vide après normalisation

        // Initialiser l'entrée si elle n'existe PAS ENCORE (ni JSON ni Greenpeace)
        if (!seasonalData.vegetables[normalizedName]) {
          seasonalData.vegetables[normalizedName] = {
            isFruit: false, isVegetable: true, isPerennial: false,
            january: false, february: false, march: false, april: false, may: false, june: false,
            july: false, august: false, september: false, october: false, november: false, december: false,
            pollinatorFriendly: isPollinatorFriendly // Définir ici
          };
          // console.log(`  -> Nouveau légume (Greenpeace): ${normalizedName}`);
        } else {
          // Si l'entrée existe (du JSON), mettre à jour pollinatorFriendly si Greenpeace le dit
          if (isPollinatorFriendly) {
            seasonalData.vegetables[normalizedName].pollinatorFriendly = true;
          }
          // Assurer que isVegetable est true si trouvé ici
          seasonalData.vegetables[normalizedName].isVegetable = true;
          seasonalData.vegetables[normalizedName].isFruit = false; // Au cas où une source se contredirait
        }

        // Marquer ce légume comme disponible pour ce mois (CONFIRME ou AJOUTE le mois)
        seasonalData.vegetables[normalizedName][monthKey] = true;
      }

      // --- Récupérer les fruits (Greenpeace) ---
      const fruitsSelector = `#${monthId}-fruits + article ul li`;
      const fruits = await page.$$(fruitsSelector);

      for (const fruit of fruits) {
        let name;
        let isPollinatorFriendly = false;
         try {
            name = await fruit.evaluate(el => el.textContent.trim());
            isPollinatorFriendly = await fruit.evaluate(el => el.classList.contains('icon-abeille'));
        } catch (e) {
            console.warn(`Impossible de lire un fruit pour ${monthName}: ${e.message}`);
            continue;
        }

        // MODIFIÉ: Normaliser le nom AVANT de l'utiliser comme clé
        const normalizedName = normalizeIngredientNameForScraping(name);
         if (!normalizedName) continue;

        // Initialiser l'entrée si elle n'existe PAS ENCORE
        if (!seasonalData.fruits[normalizedName]) {
          seasonalData.fruits[normalizedName] = {
            isFruit: true, isVegetable: false, isPerennial: false,
            january: false, february: false, march: false, april: false, may: false, june: false,
            july: false, august: false, september: false, october: false, november: false, december: false,
            pollinatorFriendly: isPollinatorFriendly
          };
           // console.log(`  -> Nouveau fruit (Greenpeace): ${normalizedName}`);
        } else {
           // Si l'entrée existe (du JSON), mettre à jour pollinatorFriendly si Greenpeace le dit
          if (isPollinatorFriendly) {
            seasonalData.fruits[normalizedName].pollinatorFriendly = true;
          }
          // Assurer que isFruit est true
          seasonalData.fruits[normalizedName].isFruit = true;
          seasonalData.fruits[normalizedName].isVegetable = false;
        }

        // Marquer ce fruit comme disponible pour ce mois (CONFIRME ou AJOUTE le mois)
        seasonalData.fruits[normalizedName][monthKey] = true;
      }

      // Refermer le mois si on l'a ouvert
      if (!isOpen) {
        try {
           await monthElement.$eval('header.month-header', header => header.click());
           await page.waitForTimeout(300);
        } catch (e) {
            // Pas critique si la fermeture échoue
            // console.warn(`Impossible de refermer le mois ${monthName}: ${e.message}`);
        }
      }
    } // Fin de la boucle des mois Greenpeace

    console.log("Fusion des données JSON et Greenpeace terminée.");

    // --- Vérification Pérenne et Tri (après fusion) ---
    console.log('Calcul du statut pérenne et tri des données...');
    for (const category of ['fruits', 'vegetables']) {
      const sortedItems = {};
      const keys = Object.keys(seasonalData[category]).sort(); // Trier les clés

      for (const name of keys) {
        const data = seasonalData[category][name];
        // Calculer isPerennial basé sur les données finales fusionnées
        const monthsAvailable = Object.values(monthMap).filter(monthKey => data[monthKey]).length;
        if (monthsAvailable === 12) {
          data.isPerennial = true;
          // Si pérenne, s'assurer que c'est bien un fruit ou légume identifié
          // (Champignon de Paris est listé mais est un champignon, pas un légume au sens strict botanique)
          // On garde la classification basée sur les listes (fruit/légume)
        } else {
          data.isPerennial = false;
        }
         // Ne pas marquer pérenne si ce n'est ni fruit ni légume explicitement (normalement géré par isFruit/isVegetable)
         if (!data.isFruit && !data.isVegetable) {
            data.isPerennial = false; // Sécurité
         }

        sortedItems[name] = data; // Ajouter à l'objet trié
      }
      seasonalData[category] = sortedItems; // Remplacer par l'objet trié
    }
    // --- Fin Pérenne et Tri ---

    console.log(`Données finales prêtes pour la BDD: ${Object.keys(seasonalData.vegetables).length} légumes et ${Object.keys(seasonalData.fruits).length} fruits.`);

    // Mettre à jour la base de données
    await updateDatabase(seasonalData); // La fonction updateDatabase reste la même

    return seasonalData;

  } catch (error) {
    console.error('Erreur majeure lors du scraping Greenpeace ou du traitement:', error);
     if (browser && browser.isConnected()) {
         await browser.close();
    }
    throw error;
  } finally {
     if (browser && browser.isConnected()) {
        console.log('Fermeture du navigateur...');
        await browser.close();
    }
  }
}

async function updateDatabase(seasonalData) {
  console.log('Mise à jour de la base de données...');

  const allIngredients = await prisma.ingredient.findMany();
  console.log(`${allIngredients.length} ingrédients trouvés dans la base de données.`);

  let matched = 0;
  let created = 0;
  let updated = 0;
  const processedIngredientIds = new Set(); // Pour suivre les ingrédients traités

  // MODIFIÉ: S'assurer que cette normalisation est identique à celle utilisée pour le scraping
  function normalizeIngredientNameForDB(name) {
     if (!name) return '';
    return normalizeIngredientNameForScraping(name)
  }

  // Traiter les fruits et légumes des données fusionnées
  for (const category of ['fruits', 'vegetables']) {
    for (const [name, data] of Object.entries(seasonalData[category])) {
      const normalizedName = normalizeIngredientNameForDB(name); // Utiliser la version base de données

      // Recherche DANS la BDD. Il faut normaliser les noms de la BDD aussi pour comparer
      const matchingIngredients = allIngredients.filter(ingredient => {
        const dbIngredientNameNormalized = normalizeIngredientNameForDB(ingredient.name);
        // Comparaison directe après normalisation des deux côtés
        return dbIngredientNameNormalized === normalizedName ||
        dbIngredientNameNormalized === normalizedName + 's' ||
        dbIngredientNameNormalized === normalizedName + 'x';
      });

      if (matchingIngredients.length > 0) {
        // console.log(`Correspondance trouvée pour "${name}" [${normalizedName}] -> ${matchingIngredients.map(i => i.name).join(', ')}`);
        matched += matchingIngredients.length;

        for (const ingredient of matchingIngredients) {
          processedIngredientIds.add(ingredient.id); // Marquer comme traité
          try {
            const existingEntry = await prisma.ingredientSeason.findUnique({
              where: { ingredientId: ingredient.id }
            });

            const seasonDataPayload = {
              january: data.january, february: data.february, march: data.march,
              april: data.april, may: data.may, june: data.june,
              july: data.july, august: data.august, september: data.september,
              october: data.october, november: data.november, december: data.december,
              isFruit: data.isFruit,
              isVegetable: data.isVegetable,
              isPerennial: data.isPerennial,
              // Ne pas mettre à jour pollinatorFriendly ici, car non présent dans updateDatabase
              // Si vous voulez le stocker, ajoutez le champ au modèle IngredientSeason et ici.
              updatedAt: new Date()
            };

            if (existingEntry) {
              // Mettre à jour l'entrée existante
              await prisma.ingredientSeason.update({
                where: { id: existingEntry.id },
                data: seasonDataPayload
              });
              updated++;
            } else {
              // Créer une nouvelle entrée s'il n'y en avait pas
              await prisma.ingredientSeason.create({
                data: {
                  ingredientId: ingredient.id,
                  ...seasonDataPayload
                }
              });
              created++;
            }
          } catch (error) {
            // Gérer les erreurs potentielles (ex: contrainte unique violée si exécuté en parallèle?)
             if (error.code === 'P2002') { // Code Prisma pour violation de contrainte unique
                 console.warn(`Entrée saisonnière déjà existante pour ${ingredient.name} (ID: ${ingredient.id}), tentative de mise à jour échouée ou doublon traité.`);
             } else {
                console.error(`Erreur DB pour ${ingredient.name} [${normalizedName}]:`, error.message);
             }
          }
        }
      } else {
        // Optionnel: Logguer les ingrédients des sources qui ne sont pas dans la BDD
        // console.log(`Aucun ingrédient trouvé dans la BDD pour "${name}" [${normalizedName}]`);
      }
    }
  }

  // MODIFIÉ: Ne plus marquer les ingrédients restants comme pérennes par défaut.
  // Un ingrédient non trouvé dans les sources ADEME/Greenpeace n'est pas nécessairement pérenne.
  // Il est simplement "non saisonnier connu" par ces sources. Laisser son entrée seasonInfo vide.
  console.log('Fin du traitement des ingrédients saisonniers.');

  // Afficher un résumé plus détaillé
  console.log(`Mise à jour terminée:`);
  console.log(`  - ${matched} correspondances trouvées entre sources et BDD.`);
  console.log(`  - ${created} nouvelles entrées IngredientSeason créées.`);
  console.log(`  - ${updated} entrées IngredientSeason mises à jour.`);
  console.log(`  - ${processedIngredientIds.size} ingrédients uniques de la BDD ont reçu des données de saisonnalité.`);
  const remainingIngredients = allIngredients.length - processedIngredientIds.size;
  console.log(`  - ${remainingIngredients} ingrédients de la BDD n'ont pas été trouvés dans les sources et restent sans info saisonnière.`);

}

// Point d'entrée du script
scrapeSeasonalityData()
  .then(() => {
    console.log('Script de saisonnalité terminé avec succès.');
  })
  .catch(error => {
    console.error('Erreur lors du processus global de saisonnalité:', error);
    process.exitCode = 1; // Indique une erreur
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Connexion Prisma fermée.');
  });