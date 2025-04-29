/**
 * Composant pour la barre de progression à deux couleurs
 */
interface ProgressBarProps {
    marketplaceCount: number;
    otherCount: number;
    checkedMarketplaceCount: number;
    checkedOtherCount: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    marketplaceCount,
    otherCount,
    checkedMarketplaceCount,
    checkedOtherCount
}: ProgressBarProps) => {

    const totalMarketplaceCount = marketplaceCount + checkedMarketplaceCount;
    const totalOtherCount = otherCount + checkedOtherCount;

    const marketplacePercentage = Math.round((checkedMarketplaceCount * 100 / totalMarketplaceCount)) || 0
    const otherplacePercentage = Math.round((checkedOtherCount * 100 / totalOtherCount)) || 0

    // Calculer les pourcentages de progression pour chaque catégorie


    return (
        <div className="fixed bottom-[77px] left-0 right-0 z-40">
            <div className="w-full h-3 flex">
                {/* Partie marché */}
                <div className="relative h-full w-[50%] full overflow-hidden" >
                    <div className="absolute inset-0 bg-gray-200">
                        <div
                            className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                            style={{ width: `${marketplacePercentage}%` }}
                        />
                    </div>
                </div>

                {/* PAutre partie */}
                <div className="relative h-full w-[50%] full overflow-hidden" >
                    <div className="absolute inset-0 bg-gray-200">
                        <div
                            className="h-full bg-indigo-500 transition-all duration-300 ease-in-out"
                            style={{ width: `${otherplacePercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};