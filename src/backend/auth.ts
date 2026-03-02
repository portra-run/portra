import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import db from "./database"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    requireEmailVerification: false
  },
  experimental: {
    joins: true
  }
})
