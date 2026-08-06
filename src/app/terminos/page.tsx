import type { Metadata } from "next"

import { StaticPageShell } from "@/components/marketing/static-page-shell"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Términos y condiciones",
}

export default function TerminosPage() {
  return (
    <StaticPageShell title="Términos y condiciones" updatedAt="5 de agosto de 2026">
      <p>
        Estos términos regulan el acceso y uso de {siteConfig.name} (en adelante, &ldquo;el Servicio&rdquo;),
        operado con el fin de ayudar a los usuarios a generar reclamaciones extrajudiciales mediante
        inteligencia artificial. Al crear una cuenta o utilizar el Servicio, aceptas estos términos.
      </p>

      <h2>1. Naturaleza del servicio</h2>
      <p>
        {siteConfig.name} genera plantillas de reclamación mediante modelos de inteligencia artificial a
        partir de la información que el usuario proporciona. El Servicio <strong>no constituye
        asesoramiento legal</strong> ni sustituye a un profesional del derecho. Los documentos generados
        deben revisarse antes de su envío y el usuario es responsable de la veracidad de los datos
        aportados.
      </p>

      <h2>2. Cuenta de usuario</h2>
      <p>
        Eres responsable de mantener la confidencialidad de tus credenciales y de toda la actividad
        realizada desde tu cuenta. Debes notificarnos cualquier uso no autorizado tan pronto como tengas
        constancia de él.
      </p>

      <h2>3. Planes y facturación</h2>
      <p>
        Algunos planes son de pago y se facturan de forma recurrente a través de Stripe. Puedes cancelar
        tu suscripción en cualquier momento desde el panel de facturación; el acceso se mantiene hasta el
        final del periodo ya pagado. No se realizan reembolsos por periodos parcialmente utilizados salvo
        que la ley aplicable exija lo contrario.
      </p>

      <h2>4. Uso aceptable</h2>
      <p>
        No debes utilizar el Servicio para generar contenido difamatorio, fraudulento o que incumpla la
        normativa aplicable, ni para automatizar reclamaciones masivas sin base real.
      </p>

      <h2>5. Limitación de responsabilidad</h2>
      <p>
        El Servicio se presta &ldquo;tal cual&rdquo;. En la medida permitida por la ley, no garantizamos que las
        reclamaciones generadas obtengan una respuesta o resolución favorable por parte de terceros.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Para cualquier consulta sobre estos términos, escríbenos a{" "}
        <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
      </p>
    </StaticPageShell>
  )
}
