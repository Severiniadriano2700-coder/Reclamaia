import type { Metadata } from "next"

import { StaticPageShell } from "@/components/marketing/static-page-shell"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Política de cookies",
}

export default function CookiesPage() {
  return (
    <StaticPageShell title="Política de cookies" updatedAt="5 de agosto de 2026">
      <p>
        Esta política explica qué cookies utiliza {siteConfig.name} y con qué finalidad, conforme a
        la normativa española y europea sobre cookies.
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Son pequeños archivos que se almacenan en tu navegador y permiten que el sitio recuerde
        información sobre tu visita, como tu sesión iniciada o tus preferencias de tema (claro u
        oscuro).
      </p>

      <h2>2. Cookies que utilizamos</h2>
      <ul>
        <li>
          <strong>Cookies técnicas necesarias</strong> — gestionan tu sesión de usuario autenticado
          y las protecciones de seguridad (CSRF). No pueden desactivarse porque el Servicio no
          funcionaría sin ellas.
        </li>
        <li>
          <strong>Cookies de preferencia</strong> — recuerdan el tema (claro/oscuro) y el estado del
          panel lateral en el dashboard.
        </li>
        <li>
          <strong>Cookies de terceros</strong> — si activas el pago con Stripe, Stripe puede
          establecer sus propias cookies para prevenir fraude durante el proceso de pago.
        </li>
      </ul>
      <p>No utilizamos cookies de publicidad ni de seguimiento con fines de marketing de terceros.</p>

      <h2>3. Cómo gestionar las cookies</h2>
      <p>
        Puedes eliminar o bloquear las cookies desde la configuración de tu navegador. Ten en cuenta
        que bloquear las cookies técnicas impedirá que puedas iniciar sesión en tu cuenta.
      </p>

      <h2>4. Contacto</h2>
      <p>
        Para cualquier duda sobre esta política, escríbenos a{" "}
        <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
      </p>
    </StaticPageShell>
  )
}
