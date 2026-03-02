"use client"

import Link from "next/link"
import { use, useEffect, useState } from "react"
import type { AppCRD } from "@/backend/kubernetes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AppDetailsPage({
  params
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = use(params)
  const [app, setApp] = useState<AppCRD | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/apps/${name}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch app details")
        return res.json()
      })
      .then((data) => {
        setApp(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [name])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-50" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-50 md:col-span-2" />
          <Skeleton className="h-50" />
        </div>
      </div>
    )
  }

  if (error || !app) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error || "App not found"}</p>
        <Button asChild className="mt-4">
          <Link href="/apps">Back to Apps</Link>
        </Button>
      </div>
    )
  }

  const isAvailable =
    app.status?.conditions?.find((c) => c.type === "Available")?.status ===
    "True"

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{app.metadata.name}</h1>
          {isAvailable ? (
            <Badge
              variant="default"
              className="bg-green-500 hover:bg-green-600"
            >
              Running
            </Badge>
          ) : (
            <Badge variant="destructive">Degraded / Unknown</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/apps">Back</Link>
          </Button>
          <Button>Edit Configuration</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Application specification from Kubernetes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Image
                </p>
                <p className="font-mono text-sm break-all">{app.spec.image}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Container Port
                </p>
                <p>{app.spec.containerPort ?? 80}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Replicas
                </p>
                <p>{app.spec.replicas ?? 1}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  TLS Enabled
                </p>
                <p>{app.spec.tls ? "Yes" : "No"}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Domains
              </p>
              <div className="flex flex-wrap gap-2">
                {app.spec.domains?.map((d) => (
                  <Badge key={d} variant="outline" className="font-mono">
                    {d}
                  </Badge>
                )) || (
                  <p className="text-sm text-muted-foreground">
                    No domains configured
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Environment Variables
              </p>
              <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-1">
                {app.spec.env?.map((e) => (
                  <div key={e.name} className="flex gap-2">
                    <span className="text-blue-500">{e.name}:</span>
                    <span>{e.value}</span>
                  </div>
                )) || (
                  <p className="text-muted-foreground">
                    No environment variables
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Current operational state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {app.status?.conditions?.map((c) => (
              <div key={c.type} className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{c.type}</span>
                  <Badge
                    variant={c.status === "True" ? "default" : "secondary"}
                  >
                    {c.status}
                  </Badge>
                </div>
                {c.message && (
                  <p className="text-xs text-muted-foreground">{c.message}</p>
                )}
                <Separator className="mt-2" />
              </div>
            )) || (
              <p className="text-sm text-muted-foreground">
                No status conditions available
              </p>
            )}

            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Last updated: {app.metadata.creationTimestamp?.toString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="yaml">YAML</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="mt-4">
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Event streaming coming soon.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Log streaming coming soon.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="yaml" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <pre className="p-4 bg-zinc-950 text-zinc-50 rounded-md overflow-x-auto text-xs">
                {JSON.stringify(app, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
