import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { createClerkClient } from "@clerk/backend";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  const clerk = createClerkClient({
    secretKey: process.env["CLERK_SECRET_KEY"] ?? "",
  });

  // Decorate request with userId (populated by verifyAuth)
  fastify.decorateRequest("userId", "");

  // Hook to verify Clerk JWT on every request
  fastify.addHook("preHandler", async (request: FastifyRequest, reply) => {
    // Skip auth for health check and webhook endpoints
    const publicPaths = ["/api/health", "/api/v1/plaid/webhooks", "/api/v1/auth/webhook"];
    if (publicPaths.some((p) => request.url.startsWith(p))) return;

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return reply.unauthorized("Missing authorization header");
    }

    const token = authHeader.slice(7);
    try {
      const payload = await clerk.verifyToken(token);
      request.userId = payload.sub;
    } catch {
      return reply.unauthorized("Invalid or expired token");
    }
  });
};

export { authPlugin };
// fp wraps the plugin so it is not encapsulated (decorations visible app-wide)
export default fp(authPlugin, { name: "auth" });
