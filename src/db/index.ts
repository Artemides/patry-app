import postgres from "postgres";
import * as schemas from "./schema";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";

declare global {
  var db: PostgresJsDatabase<typeof schemas> | undefined;
}

let db: PostgresJsDatabase<typeof schemas>;

if (process.env.NODE_ENV === "production") {
  db = drizzle(postgres(process.env.DB_URL!), { schema: schemas });
} else {
  if (!global.db) {
    global.db = drizzle(postgres(process.env.DB_URL!), { schema: schemas });
  }
  db = global.db;
}
export { db };
