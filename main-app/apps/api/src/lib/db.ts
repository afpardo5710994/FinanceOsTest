import { createDbClient } from "@financeos/db";

if (!process.env["DATABASE_URL"]) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const db = createDbClient(process.env["DATABASE_URL"]);
