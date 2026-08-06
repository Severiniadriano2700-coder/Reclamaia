"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Search, Star, Trash2, FileText } from "lucide-react"
import { toast } from "sonner"

import { categoryLabel } from "@/lib/validations/claim"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"

type Claim = {
  id: string
  title: string
  category: string
  status: string
  isFavorite: boolean
  createdAt: string
  companyNameRaw: string | null
}

const STATUS_FILTERS = [
  { value: "all", label: "Todos los estados" },
  { value: "GENERATED", label: "Generada" },
  { value: "EDITED", label: "Editada" },
  { value: "SENT", label: "Enviada" },
  { value: "RESOLVED", label: "Resuelta" },
  { value: "REJECTED", label: "Rechazada" },
]

export function ClaimsTable() {
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState("all")
  const [favoritesOnly, setFavoritesOnly] = React.useState(false)
  const queryClient = useQueryClient()

  const params = new URLSearchParams()
  if (search) params.set("q", search)
  if (status !== "all") params.set("status", status)
  if (favoritesOnly) params.set("favorite", "true")

  const { data, isLoading } = useQuery<{ claims: Claim[] }>({
    queryKey: ["claims", search, status, favoritesOnly],
    queryFn: async () => {
      const res = await fetch(`/api/claims?${params.toString()}`)
      if (!res.ok) throw new Error("No se pudieron cargar las reclamaciones")
      return res.json()
    },
  })

  async function toggleFavorite(claim: Claim) {
    await fetch(`/api/claims/${claim.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !claim.isFavorite }),
    })
    queryClient.invalidateQueries({ queryKey: ["claims"] })
  }

  async function deleteClaim(id: string) {
    const res = await fetch(`/api/claims/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("No se pudo eliminar la reclamación")
      return
    }
    toast.success("Reclamación eliminada")
    queryClient.invalidateQueries({ queryKey: ["claims"] })
  }

  const claims = data?.claims ?? []

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título o empresa…"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue>
              {(value: string) => STATUS_FILTERS.find((s) => s.value === value)?.label ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={favoritesOnly ? "default" : "outline"}
          className="gap-1.5"
          onClick={() => setFavoritesOnly((v) => !v)}
        >
          <Star className={cn("size-3.5", favoritesOnly && "fill-current")} />
          Favoritas
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : claims.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <FileText className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No se encontraron reclamaciones.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {claims.map((claim) => (
              <li key={claim.id} className="flex items-center gap-3 px-5 py-4">
                <button
                  onClick={() => toggleFavorite(claim)}
                  aria-label="Marcar como favorita"
                  className="shrink-0 text-muted-foreground hover:text-gold"
                >
                  <Star className={cn("size-4", claim.isFavorite && "fill-gold text-gold")} />
                </button>

                <Link href={`/dashboard/reclamaciones/${claim.id}`} className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{claim.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {categoryLabel(claim.category)} · {new Date(claim.createdAt).toLocaleDateString("es-ES")}
                  </p>
                </Link>

                <StatusBadge status={claim.status} />

                <AlertDialog>
                  <AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Eliminar" />}>
                    <Trash2 className="size-3.5 text-muted-foreground" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar esta reclamación?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El documento se eliminará permanentemente de tu historial.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteClaim(claim.id)}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
