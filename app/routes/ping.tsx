import { json } from "@remix-run/node";

// Gère les requêtes GET
export function loader() {
  return json({ status: "ok", timestamp: new Date().toISOString() });
}

// Gère les requêtes POST
export function action() {
  return json({ status: "ok", timestamp: new Date().toISOString(), method: "POST" });
}

// Pas de composant de rendu nécessaire pour une route API
export default function Ping() {
  return null;
}