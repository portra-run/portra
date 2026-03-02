import { Elysia, t } from "elysia"
import {
  APP_GROUP,
  APP_PLURAL,
  APP_VERSION,
  type AppCRD,
  customApi
} from "../../kubernetes"

export const appsModule = new Elysia({ prefix: "/apps" })
  .get("/", async () => {
    try {
      const response = await customApi.listClusterCustomObject({
        group: APP_GROUP,
        version: APP_VERSION,
        plural: APP_PLURAL
      })

      return (response as { items: AppCRD[] }).items
    } catch (error) {
      console.error("Failed to list apps:", error)
      throw new Error("Failed to list applications from Kubernetes")
    }
  })
  .get(
    "/:name",
    async ({ params: { name } }) => {
      try {
        const response = await customApi.getClusterCustomObject({
          group: APP_GROUP,
          version: APP_VERSION,
          plural: APP_PLURAL,
          name
        })

        return response as AppCRD
      } catch (error: unknown) {
        const k8sError = error as { status?: number };
        if (k8sError.status === 404) {
          throw new Error(`App ${name} not found`);
        }
        console.error(`Failed to get app ${name}:`, error);
        throw new Error(`Failed to fetch details for app ${name}`);
      }

    },
    {
      params: t.Object({
        name: t.String()
      })
    }
  )
