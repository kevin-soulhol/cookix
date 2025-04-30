/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { useSwipeable } from 'react-swipeable';
// Import des types Prisma
import type { Recipe, RecipeStep, RecipeIngredient, Ingredient } from "@prisma/client";
import IconVegeFruit from "./IconVegeFruit";

// Type étendu pour les recettes avec des relations et des propriétés additionnelles
type RecipeWithRelations = Recipe & {
    ingredients?: IngredientWithSeason[];
    steps?: RecipeStep[];
    isFavorite?: boolean;
    isInMenu?: boolean;
};

interface RecipeModalProps {
    recipeId: number;
    basicRecipe: RecipeWithRelations;
    isOpen: boolean;
    onClose: () => void;
    isAuthenticated?: boolean;
}

export type IngredientWithSeason = RecipeIngredient & {
    ingredient: Ingredient;
    isInSeason: boolean;
    isPermanent: boolean;
    isFruit: boolean;
    isVegetable: boolean;
};

type TabType = 'ingredients' | 'instructions' | 'description';


// Composant pour l'onglet Ingrédients
const IngredientsTab = ({ ingredients }: { ingredients?: IngredientWithSeason[] }) => (
    <div className="ingredients-tab">
        <h2 className="text-xl font-semibold mb-4">Ingrédients</h2>
        {ingredients && ingredients.length > 0 ? (
            <ul className="space-y-2">
                {ingredients.map((item, index) => (
                    <li key={index} className="flex items-center p-2 border-b border-gray-100 last:border-0">
                        {/* Indicateur de saisonnalité */}
                        <IconVegeFruit ingredient={item} noCheck={false} />

                        <span>
                            {item.quantity && <span className="font-medium">{item.quantity} </span>}
                            {item.unit && <span>{item.unit} de </span>}
                            {item.ingredient.name}
                        </span>
                    </li>
                ))}
            </ul>
        ) : (
            // eslint-disable-next-line react/no-unescaped-entities
            <p className="text-gray-500 italic">Aucun ingrédient n'est spécifié pour cette recette.</p>
        )}
    </div>
);

// Composant pour l'onglet Instructions
const InstructionsTab = ({
    steps,
    completedSteps,
    currentStep,
    onStepClick,
}: {
    steps?: RecipeStep[],
    completedSteps: number[],
    currentStep: number | null,
    onStepClick: (step: number) => void,
    onNextStep: () => void,
    onPrevStep: () => void
}) => {

    // Fonction pour remplacer les attributs src dans le HTML
    const processHtml = (html: string): string => {
        // Remplacer d'abord les icônes (comme dans votre code original)
        let processedHtml = html.replace(
            /<i class="ico icon-rotate_cw_2"><\/i>/g,
            `<svg xmlns="http://www.w3.org/2000/svg" class="inline-block pb-[3px] w-[18px] h-[18px]" viewBox="0 0 512 512"><path d="M48.5 224L40 224c-13.3 0-24-10.7-24-24L16 72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8L48.5 224z"/></svg>`
        );

        // Utiliser une expression régulière pour trouver les balises img avec data-lazy-src
        // et remplacer leur attribut src par la valeur de data-lazy-src
        processedHtml = processedHtml.replace(
            /<img\s+([^>]*)\s*src="[^"]*"\s+([^>]*)\s*data-lazy-src="([^"]*)"\s*([^>]*)>/g,
            '<img $1 $2 src="$3" $4>'
        );

        return processedHtml;
    };

    return (
        <div className="instructions-tab pb-16">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            {steps && steps.length > 0 ? (
                <div className="space-y-2">
                    <div className="mb-4 text-gray-500 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Progression :</span>
                            <span>{completedSteps.length}/{steps.length} étapes terminées</span>
                        </div>
                    </div>
                    <ol className="space-y-2">
                        {steps.map((step) => {
                            const isCompleted = completedSteps.includes(step.stepNumber);
                            const isActive = currentStep === step.stepNumber;

                            return (
                                <li
                                    id={`recipe-step-${step.stepNumber}`}
                                    key={step.id}
                                    className={`flex p-3 rounded-lg transition-colors cursor-pointer ${isActive ? 'bg-rose-50 border-l-4 border-rose-500' :
                                        isCompleted ? 'bg-gray-50' : ''
                                        }`}
                                    onClick={() => onStepClick(step.stepNumber)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            onStepClick(step.stepNumber);
                                        }
                                    }}
                                    tabIndex={0}
                                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                                    role="button"
                                    aria-pressed={isActive}
                                >
                                    <div className="flex items-start">
                                        <span className={`flex-shrink-0 w-8 h-8 ${isCompleted ? 'bg-gray-200 text-gray-500' :
                                            isActive ? 'bg-rose-100 text-rose-600' :
                                                'bg-gray-100 text-gray-600'
                                            } rounded-full flex items-center justify-center font-bold mr-4 transition-colors`}>
                                            {isCompleted ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                step.stepNumber
                                            )}
                                        </span>
                                        <div className="pt-1 flex-1">
                                            <div
                                                className={`${isCompleted ? 'text-gray-400 opacity-70' : 'text-gray-700'} transition-colors`}
                                                dangerouslySetInnerHTML={{
                                                    __html: processHtml(step.instruction)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            ) : (
                // eslint-disable-next-line react/no-unescaped-entities
                <p className="text-gray-500 italic">Aucune instruction n'est spécifiée pour cette recette.</p>
            )}
        </div>
    );
};

// Composant pour l'onglet Description
const DescriptionTab = ({ description }: { description?: string }) => (
    <div className="description-tab">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        {description ? (
            <div
                className="description-text text-m mb-3"
                dangerouslySetInnerHTML={{ __html: description }}
            />
        ) : (
            // eslint-disable-next-line react/no-unescaped-entities
            <p className="text-gray-500 italic">Aucune description n'est spécifiée pour cette recette.</p>
        )}
    </div>
);

interface RecipeApiResponse {
    success: boolean;
    recipe: RecipeWithRelations;
    message?: string;
}


export default function RecipeModal({ recipeId, basicRecipe, isOpen, onClose, isAuthenticated = false }: RecipeModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [selectedTab, setSelectedTab] = useState<TabType>('ingredients');
    const tabs: TabType[] = ['ingredients', 'instructions', 'description'];
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [currentStep, setCurrentStep] = useState<number | null>(null);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
    const [swipeProgress, setSwipeProgress] = useState(0); // De 0 à 100 pour l'avancement du swipe

    // Fetchers pour les différentes actions
    const recipeDetailsFetcher = useFetcher<RecipeApiResponse>();
    const favoriteFetcher = useFetcher();
    const menuFetcher = useFetcher();

    // États dérivés avec memoization implicite
    const recipe = recipeDetailsFetcher.data?.recipe || basicRecipe;
    const isLoading = recipeDetailsFetcher.state === "loading";
    const inFavorites = Boolean(recipe?.isFavorite);
    const isAdded = Boolean(recipe?.isInMenu);

    // Chargement des détails de la recette
    useEffect(() => {
        if (isOpen && recipeId) {
            recipeDetailsFetcher.load(`/api/recipes?id=${recipeId}`);
        }
    }, [isOpen, recipeId]);

    // Gestion des événements clavier et clic extérieur
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        // Événements
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "hidden"; // Empêcher le défilement

        // Nettoyage
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "auto";
        };
    }, [isOpen, onClose]);

    // Configuration du handler de swipe
    const progressWipeForValidate = 20; // Pourcentage nécessaire pour changer d'onglet

    const swipeHandlers = useSwipeable({
        onSwipeStart: () => {
            setIsAnimating(true);
        },
        onSwiping: (event) => {
            const width = modalRef.current?.clientWidth || 300;
            // Calculer le pourcentage de déplacement relatif à la largeur de l'écran
            const progress = Math.min(Math.abs(event.deltaX) / width * 100, 100);

            setSwipeProgress(progress);
            setSwipeDirection(event.dir === 'Left' ? 'left' : 'right');
        },
        onSwipedLeft: () => {
            if (currentTabIndex < tabs.length - 1 && swipeProgress >= progressWipeForValidate) {
                setSelectedTab(tabs[currentTabIndex + 1]);
            }
            resetSwipeState();
        },
        onSwipedRight: () => {
            if (currentTabIndex > 0 && swipeProgress >= progressWipeForValidate) {
                setSelectedTab(tabs[currentTabIndex - 1]);
            }
            resetSwipeState();
        },
        onSwiped: () => {
            // Si le swipe n'est pas suffisant, revenir à l'onglet initial
            resetSwipeState();
        },
        delta: 10,
        //preventDefaultTouchmoveEvent: true,
        trackTouch: true,
        trackMouse: false,
    });

    const resetSwipeState = () => {
        setIsAnimating(false);
        setSwipeProgress(0);
        setSwipeDirection(null);
    };

    useEffect(() => {
        setCurrentTabIndex(tabs.indexOf(selectedTab))
    }, [selectedTab, tabs])

    // Handlers pour les actions utilisateur
    const handleAddToMenu = () => {
        if (!isAdded) {
            menuFetcher.submit(
                { recipeId: recipeId.toString() },
                { method: "post", action: "/api/menu" }
            );
        } else {
            menuFetcher.submit(
                { recipeId: recipeId.toString() },
                { method: "delete", action: "/api/menu" }
            );
        }

    };

    const handleToggleFavorite = () => {
        favoriteFetcher.submit(
            { recipeId: recipeId.toString(), action: inFavorites ? "remove" : "add" },
            { method: "post", action: "/api/favorites" }
        );
    };

    // Ajoutez ces fonctions dans votre composant RecipeModal
    const navigateToNextStep = () => {
        if (!recipe.steps || recipe.steps.length === 0) return;

        // Si une étape est active, la marquer comme complétée avant de passer à la suivante
        if (currentStep) {
            setCompletedSteps(prev => {
                if (!prev.includes(currentStep)) {
                    return [...prev, currentStep];
                }
                return prev;
            });
        }

        // Trouver l'étape suivante
        const currentIndex = currentStep ? recipe.steps.findIndex(step => step.stepNumber === currentStep) : -1;
        const nextIndex = currentIndex + 1;

        // S'il existe une étape suivante, la définir comme étape actuelle
        if (nextIndex < recipe.steps.length) {
            const nextStepNumber = recipe.steps[nextIndex].stepNumber;
            setCurrentStep(nextStepNumber);

            // Faire défiler vers cette étape
            const stepElement = document.getElementById(`recipe-step-${nextStepNumber}`);
            if (stepElement) {
                stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    const handleStepClick = (stepNumber: number) => {
        // Si on clique sur une étape déjà complétée, la décocher
        if (completedSteps.includes(stepNumber)) {
            setCompletedSteps(prev => prev.filter(step => step !== stepNumber));
            // La définir comme étape active si elle n'est pas déjà active
            if (currentStep !== stepNumber) {
                setCurrentStep(stepNumber);
            }
            return;
        }

        // Si on clique sur une étape différente de l'étape actuelle
        if (currentStep && currentStep !== stepNumber) {
            // Si on clique sur une étape après l'étape actuelle, marquer l'étape actuelle comme complétée
            const currentIndex = recipe.steps?.findIndex(step => step.stepNumber === currentStep) ?? -1;
            const clickedIndex = recipe.steps?.findIndex(step => step.stepNumber === stepNumber) ?? -1;

            if (clickedIndex > currentIndex) {
                // Si on avance, marquer l'étape actuelle comme complétée
                setCompletedSteps(prev => {
                    if (!prev.includes(currentStep)) {
                        return [...prev, currentStep];
                    }
                    return prev;
                });
            }
        }

        // Définir la nouvelle étape actuelle
        setCurrentStep(stepNumber);
    };

    const navigateToPrevStep = () => {
        if (!recipe.steps || recipe.steps.length === 0) return;

        // Trouver l'étape précédente
        const currentIndex = currentStep ? recipe.steps.findIndex(step => step.stepNumber === currentStep) : recipe.steps.length;
        const prevIndex = currentIndex - 1;

        // S'il existe une étape précédente, la définir comme étape actuelle
        if (prevIndex >= 0) {
            const prevStepNumber = recipe.steps[prevIndex].stepNumber;
            setCurrentStep(prevStepNumber);

            // Faire défiler vers cette étape
            const stepElement = document.getElementById(`recipe-step-${prevStepNumber}`);
            if (stepElement) {
                stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    // Retour anticipé si modal fermé ou pas de recette
    if (!isOpen || !recipe) return null;

    return (
        <div className="recipe-modal fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center">
            <div
                className="bg-white w-full h-full md:h-screen max-h-screen rounded-none shadow-xl overflow-hidden flex flex-col"
                ref={modalRef}
            >
                {/* En-tête avec image et informations */}
                <RecipeHeader
                    recipe={recipe}
                    onClose={onClose}
                    isAuthenticated={isAuthenticated}
                    inFavorites={inFavorites}
                    isAdded={isAdded}
                    handleToggleFavorite={handleToggleFavorite}
                    handleAddToMenu={handleAddToMenu}
                    favoriteFetcher={favoriteFetcher}
                    menuFetcher={menuFetcher}
                />

                {/* Métadonnées de la recette */}
                <RecipeMetadata recipe={recipe} />

                {/* Onglets de navigation */}
                <div className="flex-1 overflow-hidden overflow-y-auto flex flex-col">
                    <TabNavigation
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                    />

                    {/* Contenu des onglets avec support du swipe et animation */}
                    <div className={`flex-1 overflow-hidden`} {...swipeHandlers}>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <div
                                className="h-full flex transition-transform duration-300 ease-out"
                                style={{
                                    width: `${tabs.length * 100}%`,
                                    transform: isAnimating && swipeProgress > 0
                                        ? `translateX(calc(-${currentTabIndex * 100 / tabs.length}% + ${swipeDirection === 'left' ? '-' : ''
                                        }${swipeProgress / tabs.length}%))`
                                        : `translateX(-${currentTabIndex * 100 / tabs.length}%)`
                                }}
                            >
                                {/* Onglet Ingrédients */}
                                <div className="flex-grow w-full overflow-y-auto">
                                    <div className="p-6">
                                        <IngredientsTab ingredients={recipe.ingredients} />
                                    </div>
                                </div>

                                {/* Onglet Instructions */}
                                <div className="flex-grow w-full overflow-y-auto">
                                    <div className="p-6">
                                        <InstructionsTab
                                            steps={recipe.steps}
                                            completedSteps={completedSteps}
                                            currentStep={currentStep}
                                            onStepClick={handleStepClick}
                                            onNextStep={navigateToNextStep}
                                            onPrevStep={navigateToPrevStep}
                                        />
                                    </div>
                                </div>

                                {/* Onglet Description */}
                                <div className="flex-grow w-full overflow-y-auto">
                                    <div className="p-6">
                                        <DescriptionTab description={recipe?.description || undefined} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lien source */}
                {recipe.sourceUrl && <RecipeSource url={recipe.sourceUrl} />}
            </div>
        </div>
    );
}

// Types pour les composants auxiliaires
interface RecipeHeaderProps {
    recipe: RecipeWithRelations;
    onClose: () => void;
    isAuthenticated: boolean;
    inFavorites: boolean;
    isAdded: boolean;
    handleToggleFavorite: () => void;
    handleAddToMenu: () => void;
    favoriteFetcher: ReturnType<typeof useFetcher>;
    menuFetcher: ReturnType<typeof useFetcher>;
}

interface FavoriteButtonProps {
    inFavorites: boolean;
    onClick: () => void;
    isSubmitting: boolean;
}

interface MenuButtonProps {
    isAdded: boolean;
    onClick: () => void;
    isSubmitting: boolean;
}

interface RecipeMetadataProps {
    recipe: RecipeWithRelations;
}

interface MetadataItemProps {
    icon: React.ReactNode;
    label: React.ReactNode;
    classe: string;
}

interface TabNavigationProps {
    selectedTab: TabType;
    setSelectedTab: (tab: TabType) => void;
}

interface TabButtonProps {
    isSelected: boolean;
    onClick: () => void;
    label: string;
}

interface RecipeSourceProps {
    url: string;
}

// Composant d'en-tête de recette
const RecipeHeader = ({
    recipe,
    onClose,
    isAuthenticated,
    inFavorites,
    isAdded,
    handleToggleFavorite,
    handleAddToMenu,
    favoriteFetcher,
    menuFetcher
}: RecipeHeaderProps): JSX.Element => (
    <div className="relative">
        {recipe.imageUrl ? (
            <div
                className="h-48 sm:h-64 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${recipe.imageUrl})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
            </div>
        ) : (
            <div className="h-48 sm:h-64 w-full bg-gray-200 flex items-center justify-center">
                <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
        )}

        {/* Titre */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            <h1 className="text-2xl font-bold mb-2 text-shadow">{recipe.title}</h1>
        </div>

        {/* Bouton de fermeture */}
        <button
            onClick={onClose}
            className="close-modale absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
            aria-label="Fermer"
        >
            <svg
                className="w-5 h-5 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        {/* Actions (favoris et menu) */}
        {isAuthenticated && (
            <>
                <FavoriteButton
                    inFavorites={inFavorites}
                    onClick={handleToggleFavorite}
                    isSubmitting={favoriteFetcher.state !== "idle"}
                />
                <MenuButton
                    isAdded={isAdded}
                    onClick={handleAddToMenu}
                    isSubmitting={menuFetcher.state !== "idle"}
                />
            </>
        )}
    </div>
);

// Bouton Favoris
const FavoriteButton = ({ inFavorites, onClick, isSubmitting }: FavoriteButtonProps): JSX.Element => (
    <button
        onClick={onClick}
        disabled={isSubmitting}
        className="favorite-button absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
        aria-label={inFavorites ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
        {isSubmitting ? (
            <svg className="w-5 h-5 animate-spin text-rose-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : (
            <svg
                className={`w-5 h-5 ${inFavorites ? 'text-rose-500 fill-current' : 'text-gray-500'}`}
                fill={inFavorites ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        )}
    </button>
);

// Bouton Menu
const MenuButton = ({ isAdded, onClick, isSubmitting }: MenuButtonProps): JSX.Element => (
    <button
        onClick={onClick}
        disabled={isSubmitting}
        className={`menu-button absolute top-4 left-16 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all ${isAdded ? 'border border-green-400 text-green-600' : 'text-gray-700'
            }`}
        aria-label={isAdded ? "Déjà dans le menu" : "Ajouter au menu"}
    >
        {isSubmitting ? (
            <svg className="w-5 h-5 animate-spin text-rose-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : isAdded ? (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l2 2 4-4"></path>
            </svg>
        ) : (
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
        )}
    </button>
);

// Métadonnées de la recette
const RecipeMetadata = ({ recipe }: RecipeMetadataProps): JSX.Element => {
    // Calculer si la recette entière est de saison
    const hasSeasonalInfo = recipe.ingredients && recipe.ingredients.some(i => i.isFruit || i.isVegetable);
    const allInSeason = hasSeasonalInfo && recipe.ingredients?.every(i => i.isInSeason || i.isPermanent);

    return (
        <div className="metadata-container border-b border-gray-200 px-2 py-2">
            <div className="flex flex-wrap justify-around text-xs">
                {recipe.preparationTime && (
                    <MetadataItem
                        classe="preparationTime"
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        label={`${recipe.preparationTime} min`}
                    />
                )}

                {recipe.cookingTime && (
                    <MetadataItem
                        classe="cookingTime"
                        icon={<>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                        </>}
                        label={recipe.cookingTime.toString()}
                    />
                )}

                {recipe.difficulty && (
                    <MetadataItem
                        classe="difficulty"
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />}
                        label={recipe.difficulty}
                    />
                )}

                {recipe.servings && (
                    <MetadataItem
                        classe="servings"
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
                        label={<>
                            <span className="font-medium">{recipe.servings}</span>
                            <span className="text-gray-500 ml-1">portion{recipe.servings > 1 ? 's' : ''}</span>
                        </>}
                    />
                )}

                {hasSeasonalInfo && (
                    <div className="px-2 py-1 flex items-center">
                        {allInSeason ? (
                            <span className="de-saison-tag inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                Recette de saison
                            </span>
                        ) : (
                            <span className="hors-saison-tag inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Hors saison
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
};

// Item métadonnée réutilisable
const MetadataItem = ({ icon, label, classe }: MetadataItemProps): JSX.Element => (
    <div className={`${classe} px-2 py-1 flex items-center`}>
        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {icon}
        </svg>
        <span>
            <span className="metadata-label font-medium">{label}</span>
        </span>
    </div>
);

// Navigation par onglets
const TabNavigation = ({ selectedTab, setSelectedTab }: TabNavigationProps): JSX.Element => (
    <div className="border-b border-gray-200">
        <nav className="flex justify-between items-center">
            <div className="flex">
                <TabButton
                    isSelected={selectedTab === 'ingredients'}
                    onClick={() => setSelectedTab('ingredients')}
                    label="Ingrédients"
                />
                <TabButton
                    isSelected={selectedTab === 'instructions'}
                    onClick={() => setSelectedTab('instructions')}
                    label="Instructions"
                />
                <TabButton
                    isSelected={selectedTab === 'description'}
                    onClick={() => setSelectedTab('description')}
                    label="Description"
                />
            </div>
        </nav>
    </div>
);

// Bouton d'onglet
const TabButton = ({ isSelected, onClick, label }: TabButtonProps): JSX.Element => (
    <button
        onClick={onClick}
        className={`${label.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')}
            py-4 px-4 font-medium text-sm focus:outline-none ${isSelected
                ? 'border-b-2 border-rose-500 text-rose-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
    >
        {label}
    </button>
);

// Indicateur de chargement
const LoadingSpinner = (): JSX.Element => (
    <div className="flex justify-center items-center h-40">
        <svg className="animate-spin h-10 w-10 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

// Lien vers la source
const RecipeSource = ({ url }: RecipeSourceProps): JSX.Element => (
    <div className="px-6 py-2 text-xs text-center text-gray-500 border-t">
        Voir la recette sur
        <a href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-500 hover:underline"
            onClick={(e) => e.stopPropagation()}
        >
            {' ' + new URL(url).hostname}
        </a>
    </div >
);