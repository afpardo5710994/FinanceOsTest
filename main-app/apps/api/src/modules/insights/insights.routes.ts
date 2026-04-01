import type { FastifyPluginAsync } from "fastify";

export const insightsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/v1/insights — active/unread insights for user
  fastify.get("/", async (request) => {
    // TODO: fetch insights from DB where user_id = request.userId and is_dismissed = false
    return { insights: [] };
  });

  // PATCH /api/v1/insights/:id/read — mark as read
  fastify.patch<{ Params: { id: string } }>("/:id/read", async (request) => {
    // TODO: set is_read = true
    return { success: true };
  });

  // PATCH /api/v1/insights/:id/dismiss — dismiss insight
  fastify.patch<{ Params: { id: string } }>("/:id/dismiss", async (request) => {
    // TODO: set is_dismissed = true
    return { success: true };
  });
};
