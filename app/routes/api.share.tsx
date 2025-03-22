import { json, ActionFunctionArgs } from "@remix-run/node";
import { prisma } from "~/utils/db.server";
import { getUserId } from "./api.user";
import { v4 as uuidv4 } from "uuid"; // Il faudra installer ce package

export async function action({ request }: ActionFunctionArgs) {
    const userId = await getUserId(request);

    if (!userId) {
        return json({ success: false, message: "Il faut être connecté" }, { status: 401 });
    }

    const formData = await request.formData();
    const actionType = formData.get("_action");

    try {
        // Partager un menu et sa liste de courses
        if (actionType === "shareMenu") {
            const menuId = formData.get("menuId") ? parseInt(formData.get("menuId").toString()) : null;
            const shoppingListId = formData.get("shoppingListId") ? parseInt(formData.get("shoppingListId").toString()) : null;
            const sharedWithEmail = formData.get("email")?.toString();
            const includeShoppingList = formData.get("includeShoppingList") === "true";

            if (!menuId || !sharedWithEmail) {
                return json({
                    success: false,
                    message: "Menu ID et email requis"
                }, { status: 400 });
            }

            // Vérifier que le menu appartient à l'utilisateur
            const menu = await prisma.menu.findFirst({
                where: { id: menuId, userId }
            });

            if (!menu) {
                return json({
                    success: false,
                    message: "Menu non trouvé ou non autorisé"
                }, { status: 404 });
            }

            // Vérifier si la liste de courses existe et appartient à l'utilisateur
            let shoppingList = null;
            if (includeShoppingList) {
                if (shoppingListId) {
                    shoppingList = await prisma.shoppingList.findFirst({
                        where: { id: shoppingListId, userId }
                    });
                } else {
                    // Chercher une liste de courses de l'utilisateur
                    shoppingList = await prisma.shoppingList.findFirst({
                        where: { userId }
                    });
                }
            }

            // Vérifier si un partage existe déjà avec cet email
            const existingShare = await prisma.menuShare.findFirst({
                where: {
                    menuId,
                    sharedWithEmail: sharedWithEmail.toLowerCase(),
                    isAccepted: false
                }
            });

            if (existingShare) {
                // Mettre à jour le partage existant
                const updatedShare = await prisma.menuShare.update({
                    where: { id: existingShare.id },
                    data: {
                        shoppingListId: includeShoppingList && shoppingList ? shoppingList.id : null,
                        includeShoppingList,
                        token: uuidv4(), // Générer un nouveau token
                    }
                });

                // Ici, envoyer un e-mail avec le nouveau lien d'invitation
                // Pour l'instant, simulons juste un envoi d'email
                console.log(`[SIMULATION] Invitation mise à jour envoyée à ${sharedWithEmail} avec le token: ${updatedShare.token}`);

                return json({
                    success: true,
                    message: `Invitation mise à jour envoyée à ${sharedWithEmail}`
                });
            }

            // Chercher l'utilisateur destinataire
            const sharedWithUser = await prisma.user.findFirst({
                where: { email: sharedWithEmail.toLowerCase() }
            });

            // Créer un nouveau partage
            const share = await prisma.menuShare.create({
                data: {
                    menuId,
                    shoppingListId: includeShoppingList && shoppingList ? shoppingList.id : null,
                    sharedByUserId: userId,
                    sharedWithEmail: sharedWithEmail.toLowerCase(),
                    sharedWithUserId: sharedWithUser?.id,
                    token: uuidv4(),
                    isAccepted: false,
                    includeShoppingList
                }
            });

            // Envoyer un e-mail avec le lien d'invitation
            // Pour l'instant, simulons juste un envoi d'email
            console.log(`[SIMULATION] Invitation envoyée à ${sharedWithEmail} avec le token: ${share.token}`);

            return json({
                success: true,
                message: `Invitation envoyée à ${sharedWithEmail}`
            });
        }

        // Accepter une invitation
        if (actionType === "acceptShare") {
            const token = formData.get("token")?.toString();

            if (!token) {
                return json({
                    success: false,
                    message: "Token requis"
                }, { status: 400 });
            }

            // Trouver le partage correspondant au token
            const share = await prisma.menuShare.findFirst({
                where: { token }
            });

            if (!share) {
                return json({
                    success: false,
                    message: "Invitation non trouvée ou expirée"
                }, { status: 404 });
            }

            // Vérifier si l'email du partage correspond à l'utilisateur connecté
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user || user.email.toLowerCase() !== share.sharedWithEmail.toLowerCase()) {
                return json({
                    success: false,
                    message: "Vous n'êtes pas autorisé à accepter cette invitation"
                }, { status: 403 });
            }

            // Accepter le partage
            await prisma.menuShare.update({
                where: { id: share.id },
                data: {
                    isAccepted: true,
                    acceptedAt: new Date(),
                    sharedWithUserId: userId
                }
            });

            return json({
                success: true,
                message: "Invitation acceptée avec succès"
            });
        }

        // Rejeter/Supprimer un partage
        if (actionType === "deleteShare") {
            const shareId = formData.get("shareId") ? parseInt(formData.get("shareId").toString()) : null;

            if (!shareId) {
                return json({
                    success: false,
                    message: "ID de partage requis"
                }, { status: 400 });
            }

            // Vérifier que le partage existe et est lié à l'utilisateur
            const share = await prisma.menuShare.findFirst({
                where: {
                    id: shareId,
                    OR: [
                        { sharedByUserId: userId },
                        { sharedWithUserId: userId }
                    ]
                }
            });

            if (!share) {
                return json({
                    success: false,
                    message: "Partage non trouvé ou non autorisé"
                }, { status: 404 });
            }

            // Supprimer le partage
            await prisma.menuShare.delete({
                where: { id: shareId }
            });

            return json({
                success: true,
                message: "Partage supprimé avec succès"
            });
        }

        return json({
            success: false,
            message: "Action non reconnue"
        }, { status: 400 });

    } catch (error) {
        console.error("Erreur lors de la gestion des partages:", error);
        return json(
            { success: false, message: "Une erreur est survenue" },
            { status: 500 }
        );
    }
}

// Loader pour récupérer les menus partagés avec l'utilisateur
export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);

    if (!userId) {
        return json({ success: false, message: "Il faut être connecté" }, { status: 401 });
    }

    try {
        // Récupérer les menus partagés avec l'utilisateur
        const sharedWithMe = await prisma.menuShare.findMany({
            where: {
                OR: [
                    { sharedWithUserId: userId },
                    { sharedWithEmail: { equals: (await prisma.user.findUnique({ where: { id: userId } }))?.email } }
                ],
                isAccepted: true
            },
            include: {
                menu: true,
                shoppingList: true,
                sharedByUser: {
                    select: {
                        email: true
                    }
                }
            }
        });

        // Récupérer les menus que j'ai partagés
        const sharedByMe = await prisma.menuShare.findMany({
            where: {
                sharedByUserId: userId
            },
            include: {
                sharedWithUser: {
                    select: {
                        email: true
                    }
                }
            }
        });

        // Récupérer les invitations en attente pour l'utilisateur
        const pendingInvitations = await prisma.menuShare.findMany({
            where: {
                OR: [
                    { sharedWithUserId: userId },
                    { sharedWithEmail: { equals: (await prisma.user.findUnique({ where: { id: userId } }))?.email } }
                ],
                isAccepted: false
            },
            include: {
                menu: true,
                shoppingList: true,
                sharedByUser: {
                    select: {
                        email: true
                    }
                }
            }
        });

        return json({
            success: true,
            sharedWithMe,
            sharedByMe,
            pendingInvitations
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des partages:", error);
        return json(
            { success: false, message: "Une erreur est survenue" },
            { status: 500 }
        );
    }
}