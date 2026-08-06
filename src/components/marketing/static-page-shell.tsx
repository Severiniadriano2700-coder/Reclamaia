import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"

export function StaticPageShell({
  title,
  updatedAt,
  children,
}: {
  title: string
  updatedAt?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar />
      <main id="main-content" className="mx-auto max-w-3xl px-6 pb-24 pt-40">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {updatedAt && <p className="mt-2 text-sm text-muted-foreground">Última actualización: {updatedAt}</p>}
        <div className="prose prose-sm dark:prose-invert mt-10 max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-a:text-gold">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
