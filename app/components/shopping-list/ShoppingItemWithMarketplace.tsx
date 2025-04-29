import IconVegeFruit from "../IconVegeFruit";
import { useRef, useState } from "react";
import { ShoppingItem } from "~/types/shopping-list.types";

interface ShoppingItemWithMarketplaceProps {
    item: ShoppingItem;
    onToggle: (applyToAll: boolean) => void;
    onRemove: (removeAllRelated: boolean) => void;
    onToggleMarketplace: (applyToAll: boolean) => void;
    showRecipeDetails?: boolean;
}


/**
 * Composant pour afficher un élément d'achat avec contrôles
 */
export const ShoppingItemWithMarketplace: React.FC<ShoppingItemWithMarketplaceProps> = ({
    item,
    onToggle,
    onRemove,
    onToggleMarketplace,
    showRecipeDetails = true
}: ShoppingItemWithMarketplaceProps) => {
    const [showRecipes, setShowRecipes] = useState(false);

    // États pour le slide
    const [slideOffset, setSlideOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const itemRef = useRef<HTMLLIElement>(null);
    const contentRef = useRef<HTMLDivElement>(null); // Référence pour le contenu qui glisse

    const SLIDE_THRESHOLD = 60; // Pixels à glisser pour déclencher l'action
    const MAX_SLIDE_VISUAL = 80; // Déplacement visuel maximum autorisé

    const targetMarketplaceInfo = !item.marketplace
        ? { // Devient Marché
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            bgColor: "bg-green-100",
            label: "Vers Marché"
        }
        : { // Devient Supermarché
            icon: (
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            bgColor: "bg-gray-200",
            label: "Vers Supermarché"
        };

    // --- Gestionnaires d'événements pour le slide ---

    const handleDragStart = (clientX: number) => {
        if (contentRef.current) {
            contentRef.current.style.transition = 'none'; // Désactiver la transition pendant le drag
        }
        setIsDragging(true);
        setStartX(clientX);
        setSlideOffset(0); // Réinitialiser le décalage au début
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging) return;

        const currentX = clientX;
        let deltaX = currentX - startX;

        // Autoriser uniquement le slide vers la droite
        deltaX = Math.max(0, deltaX);
        // Limiter le déplacement visuel
        deltaX = Math.min(deltaX, MAX_SLIDE_VISUAL);

        setSlideOffset(deltaX);
    };

    const handleDragEnd = () => {
        if (!isDragging) return;

        setIsDragging(false);

        // Réactiver la transition pour le retour
        if (contentRef.current) {
            contentRef.current.style.transition = 'transform 0.2s ease-out';
        }

        if (slideOffset >= SLIDE_THRESHOLD) {
            // Action déclenchée!
            console.log("Action toggle marketplace triggered!");
            onToggleMarketplace(true); // On assume que le slide affecte toujours tous les éléments liés
        }

        // Remettre l'élément à sa place (animé grâce à la transition)
        setSlideOffset(0);

        // Nettoyage potentiel (optionnel)
        setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.style.transition = ''; // Remettre la transition par défaut si besoin
            }
        }, 200); // après la fin de l'animation de retour
    };

    // --- Adapteurs pour les événements souris et tactiles ---

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        handleDragStart(e.clientX);
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        handleDragMove(e.clientX);
    };

    const onMouseUp = () => {
        handleDragEnd();
    };

    const onMouseLeave = () => {
        // Si l'utilisateur quitte l'élément en maintenant le clic, terminer le drag
        if (isDragging) {
            handleDragEnd();
        }
    };

    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        // Vérifier qu'il n'y a qu'un seul doigt pour éviter les gestes multi-touch
        if (e.touches.length === 1) {
            handleDragStart(e.touches[0].clientX);
        }
    };

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 1) {
            handleDragMove(e.touches[0].clientX);
        }
    };

    const onTouchEnd = () => {
        handleDragEnd();
    };

    const onTouchCancel = () => {
        // Gérer le cas où le système annule le toucher
        handleDragEnd();
    };

    return (
        <li
            ref={itemRef}
            data-testid={`shopping-item-${item.id}`}
            className={`
                shopping-item relative overflow-hidden 
                ${item.isChecked ? "bg-gray-50" : "bg-white"}
            `}
            onMouseLeave={() => {
                if (isDragging) handleDragEnd();
            }}
        >
            {/* Couche de fond pour l'action de slide */}
            <div
                className={`absolute inset-y-0 left-0 flex items-center px-4 ${targetMarketplaceInfo.bgColor} transition-opacity duration-100 ${isDragging && slideOffset > 10 ? 'opacity-100' : 'opacity-0'}`}
                data-testid={`shopping-item-content-${item.id}`}
                style={{ width: `${MAX_SLIDE_VISUAL}px` }} // La largeur de la zone qui apparaît
                aria-hidden="true"
            >
                <span className="flex items-center justify-center w-full h-full">
                    {targetMarketplaceInfo.icon}
                </span>
            </div>

            {/* Contenu principal qui glisse */}
            <div
                ref={contentRef}
                role="button"
                tabIndex={0}
                className={`drag-item relative z-10 flex items-center py-3 px-4 bg-inherit transition-transform duration-200 ease-out ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} border-l-4 ${item.marketplace ? 'border-green-500' : 'border-transparent'}`}
                data-testidingredient={`shopping-item-ingredient-${item.ingredient.id}`}
                style={{ transform: `translateX(${slideOffset}px)` }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave} // Important pour terminer le drag si on sort
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchCancel}
            >
                {/* Bouton de check */}
                <button
                    type="button"
                    // Empêcher le bouton de check de déclencher le drag
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={() => onToggle(true)} // Par défaut, on applique à tous les éléments similaires
                    className="checkbox-btn flex-shrink-0 mr-3 p-1 -ml-1"
                >
                    <span
                        className="w-5 h-5 rounded-full border flex items-center justify-center border-gray-300 bg-white" // Fond blanc pour visibilité
                        aria-hidden="true"
                    >
                        {item.isChecked && (
                            <svg
                                className="w-3 h-3 text-teal-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        )}
                    </span>
                </button>

                {/* Infos de l'item */}
                <div className="flex flex-col gap-x-4 flex-grow min-w-0 mr-2">
                    <div className="flex items-center">
                        <span className={`name font-medium text-gray-700 truncate flex-shrink-0 ${item.isChecked && "line-through text-gray-500"}`}>
                            {item.ingredient.name}
                        </span>
                    </div>

                    {(item.quantity || item.unit) && (
                        <span className="quantity text-xs text-gray-500 flex-shrink-0">
                            {item.quantity && <span>{item.quantity}</span>}
                            <span> {item.unit ? item.unit : 'unité.s'}</span>
                        </span>
                    )}

                    {/* Afficher les recettes associées si disponibles */}
                    {showRecipeDetails && item.recipeDetails && item.recipeDetails.length > 0 && (
                        <div>
                            <button
                                // Empêcher le bouton de déclencher le drag
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                onClick={() => setShowRecipes(!showRecipes)}
                                className="text-xs text-rose-500 mt-1 flex items-center"
                            >
                                <span>{showRecipes ? "Masquer" : "Voir"} les recettes ({item.recipeDetails.length})</span>
                                <svg
                                    className={`ml-1 w-3 h-3 transition-transform ${showRecipes ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showRecipes && (
                                <div className="mt-1 pl-2 border-l-2 border-rose-200">
                                    {item.recipeDetails.map((recipe, idx) => (
                                        <div key={idx} className="text-xs text-gray-500">
                                            • {recipe.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <IconVegeFruit ingredient={item.ingredient.seasonInfo} noCheck={true} />

                {/* === BOUTON SUPPRIMER === */}
                <div className={`flex-shrink-0 transition-opacity duration-150`}>
                    <button
                        type="button"
                        data-testid={`delete-button-${item.id}`}
                        onClick={() => onRemove(true)} // Par défaut, on supprime tous les éléments similaires
                        className={`text-gray-400 p-1 hover:text-red-500`}
                        aria-label="Supprimer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
                {/* === FIN BOUTON SUPPRIMER === */}
            </div>
        </li>
    );
};