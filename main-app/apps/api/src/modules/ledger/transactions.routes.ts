import type { FastifyPluginAsync } from "fastify";

export const transactionsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/v1/transactions — paginated + filterable
  fastify.get<{
    Querystring: {
      accountId?: string;
      categoryId?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
      page?: number;
      limit?: number;
    };
  }>("/", async (request) => {
    // TODO: query transactions with filters and pagination
    return { data: [], total: 0, page: 1, limit: 50, hasMore: false };
  });

  // GET /api/v1/transactions/recurring — detected recurring transactions
  fastify.get("/recurring", async (request) => {
    // TODO: return transactions where is_recurring = true
    return { recurring: [] };
  });

  // GET /api/v1/transactions/:id — single transaction detail
  fastify.get<{ Params: { id: string } }>("/:id", async (request) => {
    // TODO: fetch single transaction
    return { transaction: null };
  });

  // PATCH /api/v1/transactions/:id — recategorize, tag, exclude, add note
  fastify.patch<{
    Params: { id: string };
    Body: {
      userCategoryId?: string;
      tags?: string[];
      notes?: string;
      isExcluded?: boolean;
    };
  }>("/:id", async (request) => {
    // TODO: update transaction fields + write to audit_log
    return { success: true };
  });
};
