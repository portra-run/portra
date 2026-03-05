import { Elysia, t } from "elysia"
import {
  APP_GROUP,
  APP_PLURAL,
  APP_VERSION,
  type AppCRD,
  customApi,
  DEFAULT_NAMESPACE
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
  .post(
    "/",
    async ({
      body: { name, namespace, image, replicas, containerPort, domains }
    }) => {
      try {
        const targetNamespace = namespace || DEFAULT_NAMESPACE

        const appResource: AppCRD = {
          apiVersion: `${APP_GROUP}/${APP_VERSION}`,
          kind: "App",
          metadata: {
            name,
            namespace: targetNamespace
          },
          spec: {
            image,
            replicas: replicas ?? 1,
            containerPort,
            domains
          }
        }

        const response = await customApi.createNamespacedCustomObject({
          group: APP_GROUP,
          version: APP_VERSION,
          namespace: targetNamespace,
          plural: APP_PLURAL,
          body: appResource
        })

        return response as AppCRD
      } catch (error: unknown) {
        const k8sError = error as {
          code?: number
          status?: number
          body?: unknown
        }
        const code = k8sError.code ?? k8sError.status

        if (code === 409) {
          throw new Error(
            `App ${name} already exists in namespace ${namespace || DEFAULT_NAMESPACE}`
          )
        }

        console.error(`Failed to create app ${name}:`, error)
        throw new Error(`Failed to create app ${name}`)
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        namespace: t.Optional(t.String()),
        image: t.String({ minLength: 1 }),
        replicas: t.Optional(t.Number({ minimum: 1 })),
        containerPort: t.Optional(t.Number({ minimum: 1, maximum: 65535 })),
        domains: t.Optional(t.Array(t.String()))
      })
    }
  )
  .get(
    "/:name",
    async ({ params: { name }, query: { namespace } }) => {
      try {
        const targetNamespace = (namespace as string) || DEFAULT_NAMESPACE

        const response = await customApi.getNamespacedCustomObject({
          group: APP_GROUP,
          version: APP_VERSION,
          namespace: targetNamespace,
          plural: APP_PLURAL,
          name
        })

        return response as AppCRD
      } catch (error: unknown) {
        const k8sError = error as {
          code?: number
          status?: number
          body?: unknown
        }
        const code = k8sError.code ?? k8sError.status

        if (code === 404) {
          throw new Error(
            `App ${name} not found in namespace ${namespace || DEFAULT_NAMESPACE}`
          )
        }

        console.error(`Failed to get app ${name}:`, error)
        throw new Error(`Failed to fetch details for app ${name}`)
      }
    },
    {
      params: t.Object({
        name: t.String()
      }),
      query: t.Object({
        namespace: t.Optional(t.String())
      })
    }
  )
