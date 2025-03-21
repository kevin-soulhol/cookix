import { Link } from "@remix-run/react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 lg:col-span-2">
            <h2 className="text-rose-500 text-2xl font-bold mb-4">Cookix</h2>
            <p className="text-gray-300 mb-4 max-w-md">
              Votre assistant culinaire pour Monsieur Cuisine Smart. Découvrez de nouvelles recettes, planifiez vos repas et simplifiez vos courses.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/recettes" className="text-gray-300 hover:text-white transition-colors">Recettes</Link></li>
              <li><Link to="/menu" className="text-gray-300 hover:text-white transition-colors">Menu hebdomadaire</Link></li>
              <li><Link to="/courses" className="text-gray-300 hover:text-white transition-colors">Liste de courses</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <ul className="space-y-2">
              <li><Link to="/a-propos" className="text-gray-300 hover:text-white transition-colors">À propos de Cookix</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/mentions-legales" className="text-gray-300 hover:text-white transition-colors">Mentions légales</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Cookix - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}