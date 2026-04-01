import type { FastifyPluginAsync } from "fastify";

export const accountsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/v1/accounts — list all accounts grouped by type
  fastify.get("/", async (request) => {
    // TODO: fetch accounts from DB by request.userId, group by type
    return { accounts: { depository: [], investment: [], credit: [], loan: [] } };
  });

  // GET /api/v1/accounts/summary — net worth, liquid total, investment total, debt
  fastify.get("/summary", async (request) => {
    // TODO: calculate summary from current account balances
    return { netWorth: 0, liquidTotal: 0, investmentTotal: 0, debtTotal: 0 };
  });

  // GET /api/v1/accounts/:id — single account detail
  fastify.get<{ Params: { id: string } }>("/:id", async (request) => {
    // TODO: fetch account + recent balance history
    return { account: null };
  });

  // PATCH /api/v1/accounts/:id — update display settings
  fastify.patch<{ Params: { id: string }; Body: { isHidden?: boolean; displayOrder?: number } }>(
    "/:id",
    async (request) => {
      // TODO: update account display settings
      return { success: true };
    },
  );
};
