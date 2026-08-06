import type { Metadata } from "next"
import Link from "next/link"

import { StaticPageShell } from "@/components/marketing/static-page-shell"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Sobre nosotros",
}

export default function SobreNosotrosPage() {
  return (
    <StaticPageShell title="Sobre nosotros">
      <p>
        {siteConfig.name} nace de una idea simple: nadie debería renunciar a una reclamación
        legítima solo porque no sabe cómo redactarla. Cada año, millones de personas se resignan
        ante vuelos cancelados, comisiones bancarias injustas o seguros que no responden, no porque
        no tengan razón, sino porque enfrentarse a un formulario en blanco resulta desalentador.
      </p>

      <p>
        Combinamos inteligencia artificial entrenada en derecho de consumo con una experiencia de
        usuario cuidada al detalle para que redactar una reclamación formal tome minutos, no horas.
        No sustituimos a un abogado en litigios complejos, pero resolvemos el primer y más
        importante paso: poner tu caso por escrito, de forma clara, firme y bien fundamentada.
      </p>

      <h2>Lo que nos importa</h2>
      <ul>
        <li>
          <strong>Claridad sobre jerga.</strong> Un documento legal no tiene que ser incomprensible
          para ser efectivo.
        </li>
        <li>
          <strong>Privacidad por defecto.</strong> Tus datos y tus reclamaciones son tuyos; nunca los
          vendemos.
        </li>
        <li>
          <strong>Honestidad sobre lo que la IA puede y no puede hacer.</strong> Te lo decimos claro
          cuando tu caso necesita un abogado de verdad.
        </li>
      </ul>

      <p>
        ¿Quieres saber más o proponernos algo? Escríbenos desde la página de{" "}
        <Link href="/contacto">contacto</Link>.
      </p>
    </StaticPageShell>
  )
}
