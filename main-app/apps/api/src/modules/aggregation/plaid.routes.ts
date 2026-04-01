import type { FastifyPluginAsync } from "fastify";

export const plaidRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /api/v1/plaid/link-token — creates Plaid Link token for frontend SDK
  fastify.post("/link-token", async (request) => {
    // TODO: call plaidService.createLinkToken(request.userId)
    return { linkToken: "TODO", expiration: new Date().toISOString() };
  });

  // POST /api/v1/plaid/exchange-token — exchanges public_token for access_token
  fastify.post<{ Body: { publicToken: string; institutionId: string; institutionName: string } }>(
    "/exchange-token",
    async (request) => {
      // TODO: call plaidService.exchangeToken(request.userId, request.body)
      return { success: true };
    },
  );

  // GET /api/v1/plaid/items — list all connected institutions
  fastify.get("/items", async (request) => {
    // TODO: fetch plaid_items from DB by request.userId
    return { items: [] };
  });

  // DELETE /api/v1/plaid/items/:id — disconnect an institution
  fastify.delete<{ Params: { id: string } }>("/items/:id", async (request) => {
    // TODO: call plaidService.removeItem(request.userId, request.params.id)
    return { success: true };
  });

  // POST /api/v1/plaid/items/:id/sync — on-demand sync
  fastify.post<{ Params: { id: string } }>("/items/:id/sync", async (request) => {
    // TODO: enqueue sync job for request.params.id
    return { queued: true };
  });

  // POST /api/v1/plaid/webhooks — Plaid webhook receiver (no auth)
  fastify.post("/webhooks", async (_request, reply) => {
    // TODO: verify Plaid-Verification header signature and handle webhook events
    return reply.status(200).send({ received: true });
  });
};
