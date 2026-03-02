import Elysia from "elysia"
import { appsModule } from "./modules/apps"

const app = new Elysia({ prefix: "/api" })
  .use(appsModule)
  .get("/hello", () => "Hello World!")

export type App = typeof app

export default app
