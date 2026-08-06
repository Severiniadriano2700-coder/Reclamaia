import Link from "next/link"
import { Scale } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="grid-fade pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -left-40 top-1/3 size-[520px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "var(--gold)" }}
        />
        <Link href="/" className="relative z-10 flex items-center gap-2 text-primary-foreground">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gold text-gold-foreground">
            <Scale className="size-5" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">ReclamaAI</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="text-2xl font-medium leading-relaxed text-primary-foreground text-balance">
            &ldquo;En dos minutos tenía una reclamación mejor redactada que la que me hizo mi gestoría.&rdquo;
          </p>
          <p className="mt-4 text-sm text-primary-foreground/60">
            Miles de reclamaciones generadas frente a aerolíneas, bancos y aseguradoras.
          </p>
        </div>
      </div>

      <main id="main-content" className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gold text-gold-foreground">
              <Scale className="size-4" />
            </span>
            <span className="font-heading text-base font-semibold tracking-tight">ReclamaAI</span>
          </Link>
          {children}
        </div>
      </main>
    </div>
  )
}
