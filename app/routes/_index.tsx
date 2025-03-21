import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { useState } from "react";
import Layout from "~/components/Layout";
import BoxRecipe, { RecipeType } from "~/components/BoxRecipe";

export async function loader({ request }: LoaderFunctionArgs) {
  try {

    const apiUrl = new URL(`${request.url.split('/').slice(0, 3).join('/')}/api/recipes`);

    apiUrl.searchParams.append("random", "true");
    apiUrl.searchParams.append("limit", "3");

    // Appeler l'API recipes
    const response = await fetch(apiUrl.toString());
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Erreur lors du chargement des recettes");
    }

    return json({
      randomRecipes: data.recipes,
      totalRecipes: data.pagination.total
    });

  } catch (error) {
    console.error("Erreur lors du chargement des recettes:", error);
    return json({
      randomRecipes: [],
      totalRecipes: 0,
      error: "Impossible de charger les recettes."
    });
  }
}

export const meta: MetaFunction = () => {
  return [
    { title: "Cookix - Vos recettes Monsieur Cuisine Smart" },
    { name: "description", content: "Application de gestion de recettes pour Monsieur Cuisine Smart" },
  ];
};


export default function Index() {
  const { isAuthenticated } = useOutletContext<any>() || { isAuthenticated: false };
  const { randomRecipes, totalRecipes, error } = useLoaderData<typeof loader>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-500 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-3xl mx-auto">
            Découvrez des recettes pour votre Monsieur Cuisine Smart
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Explorez notre collection de {totalRecipes} recettes, créez vos menus et générez automatiquement vos listes de courses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/recettes"
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
            >
              Explorer les recettes
            </Link>
            {isAuthenticated && (
              <Link
                to="/menu"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
              >
                Mon menu
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Recettes à découvrir</h2>

          {error && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {randomRecipes?.map((recipe: RecipeType, k: number) => (
              <BoxRecipe recipe={recipe} key={k} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/recettes"
              className="inline-flex justify-center items-center px-6 py-3 border border-rose-500 text-base font-medium rounded-md text-rose-500 bg-white hover:bg-rose-50 transition-colors"
            >
              Voir toutes les recettes
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Fonctionnalités</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="text-rose-500 mx-auto mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Filtrage avancé</h3>
              <p className="text-gray-600">
                Trouvez facilement des recettes par ingrédients, temps de préparation ou niveau de difficulté.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="text-rose-500 mx-auto mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Menu hebdomadaire</h3>
              <p className="text-gray-600">
                Planifiez vos repas de la semaine et organisez-vous facilement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="text-rose-500 mx-auto mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Liste de courses</h3>
              <p className="text-gray-600">
                Générez automatiquement votre liste de courses basée sur votre menu de la semaine.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}