"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { AppCRD } from "@/backend/kubernetes"
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

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Applications</h1>
        <Card>
          <CardContent className="p-0">
            <Skeleton className="h-100 w-full" />
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
        <Button asChild>
          <Link href="/apps/new">New App</Link>
        </Button>
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
                <TableHead>Image</TableHead>
                <TableHead>Replicas</TableHead>
                <TableHead>Domains</TableHead>
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
                  <TableRow key={app.metadata.name}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/apps/${app.metadata.name}`}
                        className="hover:underline"
                      >
                        {app.metadata.name}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {app.spec.image}
                    </TableCell>
                    <TableCell>{app.spec.replicas ?? 1}</TableCell>
                    <TableCell>
                      {app.spec.domains?.map((d) => (
                        <div key={d} className="text-xs">
                          {d}
                        </div>
                      )) || "-"}
                    </TableCell>
                    <TableCell>
                      {app.status?.conditions?.find(
                        (c) => c.type === "Available"
                      )?.status === "True" ? (
                        <Badge
                          variant="default"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Running
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Unknown</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/apps/${app.metadata.name}`}>Details</Link>
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
