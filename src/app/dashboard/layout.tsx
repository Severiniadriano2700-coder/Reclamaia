import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebarLazy } from "@/components/dashboard/app-sidebar-lazy"
import { ChatWidget } from "@/components/dashboard/chat-widget"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <SidebarProvider>
      <AppSidebarLazy user={session.user} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">Panel de control</span>
        </header>
        <main id="main-content" className="flex-1 p-6">{children}</main>
      </SidebarInset>
      <ChatWidget />
    </SidebarProvider>
  )
}
