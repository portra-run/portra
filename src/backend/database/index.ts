import { Database } from "bun:sqlite"
import { drizzle } from "drizzle-orm/bun-sqlite"
import * as authSchema from "./auth-schema"

const database = new Database("data/db.sqlite")

const db = drizzle(database, {
  schema: {
    ...authSchema
  }
})

export default db
