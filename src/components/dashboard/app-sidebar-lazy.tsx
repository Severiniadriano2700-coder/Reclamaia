"use client"

import dynamic from "next/dynamic"

export const AppSidebarLazy = dynamic(() => import("./app-sidebar").then((m) => m.AppSidebar), {
  ssr: false,
})
