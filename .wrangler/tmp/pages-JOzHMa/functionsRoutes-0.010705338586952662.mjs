import { onRequest as __games_js_onRequest } from "/Users/zorawl/Documents/GitHub/primary-english-support/functions/games.js"
import { onRequest as ____path___js_onRequest } from "/Users/zorawl/Documents/GitHub/primary-english-support/functions/[[path]].js"

export const routes = [
    {
      routePath: "/games",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__games_js_onRequest],
    },
  {
      routePath: "/:path*",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [____path___js_onRequest],
    },
  ]