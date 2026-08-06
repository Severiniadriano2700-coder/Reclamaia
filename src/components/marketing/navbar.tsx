"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { Menu, Scale, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

const links = [
  { href: "#solucion", label: "Producto" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "FAQ" },
]

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const { scrollY } = useScroll()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])
  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 12))

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <div
        className={cn(
          "flex w-full max-w-5xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-300",
          scrolled
            ? "glass border-border shadow-lg shadow-black/5"
            : "border-transparent bg-transparent"
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gold text-gold-foreground">
            <Scale className="size-4" />
          </span>
          <span className="font-heading text-base font-semibold tracking-tight">ReclamaAI</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          )}
          <Button variant="ghost" nativeButton={false} render={<Link href="/login" />}>
            Iniciar sesión
          </Button>
          <Button className="glow-gold" nativeButton={false} render={<Link href="/register" />}>
            Empezar gratis
          </Button>
        </div>

        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú" />}
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Menú</SheetTitle>
            <div className="mt-10 flex flex-col gap-6 px-4">
              {links.map((link) => (
                <a key={link.href} href={link.href} className="text-base font-medium">
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <Button variant="outline" nativeButton={false} render={<Link href="/login" />}>
                  Iniciar sesión
                </Button>
                <Button nativeButton={false} render={<Link href="/register" />}>Empezar gratis</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  )
}
