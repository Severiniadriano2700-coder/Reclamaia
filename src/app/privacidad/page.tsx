import type { Metadata } from "next"

import { StaticPageShell } from "@/components/marketing/static-page-shell"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Política de privacidad",
}

export default function PrivacidadPage() {
  return (
    <StaticPageShell title="Política de privacidad" updatedAt="5 de agosto de 2026">
      <p>
        En {siteConfig.name} tratamos tus datos personales conforme al Reglamento (UE) 2016/679 (RGPD) y
        la normativa española de protección de datos. Esta política explica qué datos recogemos, para qué
        los usamos y qué derechos tienes.
      </p>

      <h2>1. Datos que recogemos</h2>
      <ul>
        <li>Datos de cuenta: nombre, email y contraseña (cifrada).</li>
        <li>Datos de las reclamaciones que generas: descripción de los hechos, empresa implicada y resultado deseado.</li>
        <li>Datos de facturación, gestionados directamente por Stripe.</li>
        <li>Datos técnicos de uso (IP, navegador) con fines de seguridad y prevención de abuso.</li>
      </ul>

      <h2>2. Finalidad del tratamiento</h2>
      <p>
        Usamos tus datos para prestar el Servicio (generar y gestionar tus reclamaciones), gestionar tu
        suscripción, enviarte comunicaciones transaccionales y mejorar la calidad del producto.
      </p>

      <h2>3. Conservación</h2>
      <p>
        Conservamos tus datos mientras mantengas tu cuenta activa. Puedes solicitar la eliminación de tu
        cuenta y todos tus datos en cualquier momento desde tu perfil.
      </p>

      <h2>4. Terceros</h2>
      <p>
        Compartimos datos estrictamente necesarios con proveedores que nos ayudan a operar el Servicio:
        procesamiento de pagos (Stripe), envío de emails (Resend) y, si activas el envío de tu
        reclamación a un proveedor de IA externo, el contenido de la reclamación con ese proveedor
        (OpenAI o Anthropic, según configuración). No vendemos tus datos a terceros.
      </p>

      <h2>5. Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y
        portabilidad escribiendo a{" "}
        <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
      </p>
    </StaticPageShell>
  )
}
