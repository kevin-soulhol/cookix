import { Page } from "@playwright/test";

export async function scrollPageToBottom(page : Page, scrollDelay = 300, maxScrollTime = 90000) {
    // Définit une durée maximale pour éviter un défilement infini
    return await page.evaluate(async (delay) => {
      return new Promise((resolve) => {
  
        const startTime = Date.now();
        let lastScrollY = 0;
        let unchangedScrollCount = 0;
        
        const scrollInterval = setInterval(() => {
          // Scroll vers le bas
          window.scrollBy(0, 500);
          
          // Vérifier si nous avons atteint le bas
          const currentScrollY = window.scrollY;
          
          // Si la position de scroll n'a pas changé après plusieurs tentatives, 
          // ou si la durée maximale est dépassée, on considère qu'on a atteint le bas
          if (currentScrollY === lastScrollY) {
            unchangedScrollCount++;
            if (unchangedScrollCount >= 3) { // 3 tentatives sans changement
              clearInterval(scrollInterval);
              console.log("Fin de scroll: position inchangée après plusieurs tentatives");
              resolve();
            }
          } else {
            // Réinitialiser si le scroll a changé
            unchangedScrollCount = 0;
            lastScrollY = currentScrollY;
          }
          
          // Vérifier si le temps maximum est écoulé
          if (Date.now() - startTime > maxScrollTime) {
            clearInterval(scrollInterval);
            console.log("Fin de scroll: temps maximum écoulé");
            resolve();
          }
  
        }, delay);
      });
    }, scrollDelay);
  }