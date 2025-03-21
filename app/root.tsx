import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";
import { getUserId } from "~/routes/api.user";
import { prisma } from "~/utils/db.server";

import tailwindStyles from "./tailwind.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];


// Chargement de l'état d'authentification dans la racine de l'application
export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);

  if (!userId) {
    return json({ isAuthenticated: false, user: null });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
      },
    });

    return json({
      isAuthenticated: Boolean(user),
      user,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des informations utilisateur:", error);
    return json({ isAuthenticated: false, user: null });
  }
}

export default function App() {
  const { isAuthenticated, user } = useLoaderData<typeof loader>();

  return (
    <html lang="fr" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet context={{ isAuthenticated, user }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
