"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import type { AppCRD } from "@/backend/kubernetes"
import { CreateAppDialog } from "@/components/create-app-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

export default function AppsPage() {
  const [apps, setApps] = useState<AppCRD[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApps = useCallback(() => {
    setLoading(true)
    fetch("/api/apps")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch apps")
        return res.json()
      })
      .then((data) => {
        setApps(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchApps()
  }, [fetchApps])

  if (loading && apps.length === 0) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Applications</h1>
        <Card>
          <CardContent className="p-0">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Applications</h1>
        <CreateAppDialog onAppCreated={fetchApps} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Apps</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Namespace</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Replicas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No applications found.
                  </TableCell>
                </TableRow>
              ) : (
                apps.map((app) => (
                  <TableRow
                    key={`${app.metadata.namespace}-${app.metadata.name}`}
                  >
                    <TableCell className="font-medium">
                      <Link
                        href={`/apps/${app.metadata.name}?namespace=${app.metadata.namespace}`}
                        className="hover:underline"
                      >
                        {app.metadata.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{app.metadata.namespace}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs max-w-[200px] truncate">
                      {app.spec.image}
                    </TableCell>
                    <TableCell>{app.spec.replicas ?? 1}</TableCell>
                    <TableCell>
                      {(() => {
                        const available = app.status?.conditions?.find(
                          (c) => c.type === "Available"
                        )
                        const progressing = app.status?.conditions?.find(
                          (c) => c.type === "Progressing"
                        )
                        const degraded = app.status?.conditions?.find(
                          (c) => c.type === "Degraded"
                        )

                        if (available?.status === "True") {
                          return (
                            <Badge
                              variant="default"
                              className="bg-green-500 hover:bg-green-600"
                            >
                              Running
                            </Badge>
                          )
                        }
                        if (progressing?.status === "True") {
                          return (
                            <Badge
                              variant="secondary"
                              className="bg-blue-500 text-white hover:bg-blue-600"
                            >
                              Progressing
                            </Badge>
                          )
                        }
                        if (degraded?.status === "True") {
                          return <Badge variant="destructive">Degraded</Badge>
                        }
                        return <Badge variant="secondary">Unknown</Badge>
                      })()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/apps/${app.metadata.name}?namespace=${app.metadata.namespace}`}
                        >
                          Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
