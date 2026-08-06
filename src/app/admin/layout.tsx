import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AdminSidebarLazy } from "@/components/admin/admin-sidebar-lazy"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  return (
    <SidebarProvider>
      <AdminSidebarLazy />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">Panel de administración</span>
        </header>
        <main id="main-content" className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
