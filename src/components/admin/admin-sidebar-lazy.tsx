"use client"

import dynamic from "next/dynamic"

export const AdminSidebarLazy = dynamic(() => import("./admin-sidebar").then((m) => m.AdminSidebar), {
  ssr: false,
})
