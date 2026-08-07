"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  FilePlus2,
  History,
  LayoutTemplate,
  CreditCard,
  UserCog,
  Scale,
  LogOut,
  ShieldCheck,
  ChevronsUpDown,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const items = [
  { title: "Resumen", href: "/dashboard", icon: LayoutDashboard },
  { title: "Nueva reclamación", href: "/dashboard/nueva", icon: FilePlus2 },
  { title: "Historial", href: "/dashboard/historial", icon: History },
  { title: "Plantillas", href: "/dashboard/plantillas", icon: LayoutTemplate },
  { title: "Facturación", href: "/dashboard/facturacion", icon: CreditCard },
  { title: "Perfil", href: "/dashboard/perfil", icon: UserCog },
]

function initials(name?: string | null, email?: string | null) {
  if (name) return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
  return email?.[0]?.toUpperCase() ?? "U"
}

export function AppSidebar({
  user,
}: {
  user: { name?: string | null; email?: string | null; role?: string }
}) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 py-1.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gold text-gold-foreground">
            <Scale className="size-4" />
          </span>
          <span className="font-heading text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            Litiga IA
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user.role === "ADMIN" && (
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link href="/admin" />}>
                    <ShieldCheck />
                    <span>Administración</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<SidebarMenuButton size="lg" />}
              >
                <Avatar className="size-6 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-gold-muted text-xs text-gold">
                    {initials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium">{user.name ?? "Usuario"}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem render={<Link href="/dashboard/perfil" />}>
                  <UserCog />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/dashboard/facturacion" />}>
                  <CreditCard />
                  Facturación
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
