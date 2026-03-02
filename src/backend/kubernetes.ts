import * as k8s from "@kubernetes/client-node"

const kc = new k8s.KubeConfig()
kc.loadFromDefault()

export const k8sApi = kc.makeApiClient(k8s.CoreV1Api)
export const customApi = kc.makeApiClient(k8s.CustomObjectsApi)

export const APP_GROUP = "core.portra.run"
export const APP_VERSION = "v1"
export const APP_PLURAL = "apps"

export interface AppCRD {
  apiVersion: string
  kind: string
  metadata: k8s.V1ObjectMeta
  spec: {
    image: string
    containerPort?: number
    domains?: string[]
    tls?: boolean
    env?: Array<{ name: string; value: string }>
    replicas?: number
    resources?: k8s.V1ResourceRequirements
  }
  status?: {
    conditions?: Array<{
      type: string
      status: string
      reason?: string
      message?: string
      lastTransitionTime?: string
    }>
  }
}
