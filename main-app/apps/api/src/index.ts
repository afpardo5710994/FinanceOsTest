import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";

import { authPlugin } from "./plugins/auth.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { plaidRoutes } from "./modules/aggregation/plaid.routes.js";
import { accountsRoutes } from "./modules/ledger/accounts.routes.js";
import { transactionsRoutes } from "./modules/ledger/transactions.routes.js";
import { insightsRoutes } from "./modules/insights/insights.routes.js";

const PORT = Number(process.env["PORT"] ?? 3001);
const HOST = process.env["HOST"] ?? "0.0.0.0";

async function buildServer() {
  const app = Fastify({
    logger: {
      level: process.env["NODE_ENV"] === "production" ? "warn" : "info",
    },
  });

  // Plugins
  await app.register(cors, {
    origin: process.env["FRONTEND_URL"] ?? "http://localhost:3000",
    credentials: true,
  });

  await app.register(rateLimit, {
    max: 500,
    timeWindow: "1 minute",
  });

  await app.register(sensible);
  await app.register(authPlugin);

  // Routes
  await app.register(authRoutes, { prefix: "/api/v1/auth" });
  await app.register(plaidRoutes, { prefix: "/api/v1/plaid" });
  await app.register(accountsRoutes, { prefix: "/api/v1/accounts" });
  await app.register(transactionsRoutes, { prefix: "/api/v1/transactions" });
  await app.register(insightsRoutes, { prefix: "/api/v1/insights" });

  // Health check
  app.get("/api/health", async () => ({ status: "ok", timestamp: new Date().toISOString() }));

  return app;
}

async function main() {
  const app = await buildServer();
  try {
    await app.listen({ port: PORT, host: HOST });
    console.warn(`API server running at http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
