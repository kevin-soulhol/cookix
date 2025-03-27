// Ajouter en haut du fichier server.js
import { createRequestHandler } from "@remix-run/express";
import express from "express";
import * as build from "./build/index.js";
import compression from "compression"; // Ajoutez cette dépendance

const app = express();

// Activer la compression gzip
app.use(compression());

// Définir des timeouts raisonnables
app.use((req, res, next) => {
  res.setTimeout(30000); // 30 secondes
  next();
});

app.use(express.static("public", {
  maxAge: '1d' // Mise en cache côté client pendant 1 jour
}));

// Définissez le gestionnaire Remix
app.all(
  "*",
  createRequestHandler({
    build,
    mode: process.env.NODE_ENV
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});