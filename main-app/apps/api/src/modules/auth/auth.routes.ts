import type { FastifyPluginAsync } from "fastify";

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/v1/auth/me — returns current user profile
  fastify.get("/me", async (request) => {
    // TODO: fetch user from DB by request.userId
    return { userId: request.userId };
  });

  // POST /api/v1/auth/webhook — Clerk webhook (user.created, user.deleted)
  fastify.post("/webhook", async (_request, reply) => {
    // TODO: verify Clerk webhook signature and handle events
    return reply.status(200).send({ received: true });
  });
};
