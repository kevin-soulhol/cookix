// server.js
import { createRequestHandler } from "@remix-run/express";
import express from "express";
import * as build from "./build/index.js";

const app = express();
app.use(express.static("public"));

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