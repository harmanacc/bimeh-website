import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const timestamps = {
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
};
