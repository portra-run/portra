import Elysia from "elysia"

const app = new Elysia({ prefix: "/api" }).get("/hello", () => "Hello World!")

export type App = typeof app

export default app
