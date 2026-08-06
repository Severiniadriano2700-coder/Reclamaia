import { resend, isResendConfigured, EMAIL_FROM } from "@/lib/resend"
import { siteConfig } from "@/lib/site"
import { welcomeEmail, claimCopyEmail, contactMessageEmail } from "@/lib/email-templates"

export async function sendWelcomeEmail(to: string, name: string) {
  if (!isResendConfigured) return
  const { subject, html } = welcomeEmail(name)
  await resend.emails.send({ from: EMAIL_FROM, to, subject, html })
}

export async function sendClaimEmail(params: {
  to: string
  claimTitle: string
  companyName: string
  content: string
}) {
  if (!isResendConfigured) {
    throw new Error("El envío de emails no está configurado en este entorno.")
  }
  const { subject, html } = claimCopyEmail(params)
  await resend.emails.send({ from: EMAIL_FROM, to: params.to, subject, html })
}

export async function sendContactMessage(params: { name: string; email: string; message: string }) {
  if (!isResendConfigured) {
    throw new Error("El formulario de contacto no está configurado en este entorno.")
  }
  const { subject, html } = contactMessageEmail(params)
  await resend.emails.send({
    from: EMAIL_FROM,
    to: siteConfig.supportEmail,
    replyTo: params.email,
    subject,
    html,
  })
}
