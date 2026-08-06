import type { Metadata } from "next"

import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { ContactForm } from "@/components/marketing/contact-form"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contacto",
}

export default function ContactoPage() {
  return (
    <div>
      <Navbar />
      <main id="main-content" className="mx-auto max-w-lg px-6 pb-24 pt-40">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Contacto</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          ¿Tienes una duda, una sugerencia o algún problema con tu cuenta? Escríbenos y te
          responderemos lo antes posible. También puedes escribir directamente a{" "}
          <a href={`mailto:${siteConfig.supportEmail}`} className="text-gold hover:underline">
            {siteConfig.supportEmail}
          </a>
          .
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
