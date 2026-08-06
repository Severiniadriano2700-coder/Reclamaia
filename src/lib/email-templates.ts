import { siteConfig } from "@/lib/site"

function shell(preview: string, bodyHtml: string) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${siteConfig.name}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0b0b0a;font-family:-apple-system,BlinkMacSystemFont,'Inter',Arial,sans-serif;">
    <span style="display:none;font-size:1px;color:#0b0b0a;">${preview}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0b0a;padding:40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#121211;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 0 32px;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="display:inline-block;width:28px;height:28px;border-radius:8px;background:#d4b06a;text-align:center;line-height:28px;color:#141208;font-weight:700;font-size:14px;">R</span>
                  <span style="color:#fafaf9;font-size:16px;font-weight:600;letter-spacing:-0.01em;">${siteConfig.name}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px 32px;color:#e6e5e2;font-size:14px;line-height:1.7;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);color:#7c7b76;font-size:12px;">
                ${siteConfig.name} · Reclamaciones legales generadas con IA. Este documento es una plantilla de ayuda y no constituye asesoramiento legal.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function goldButton(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background-color:#d4b06a;color:#141208;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;margin-top:16px;">${label}</a>`
}

export function magicLinkEmail(url: string) {
  return {
    subject: `Tu enlace de acceso a ${siteConfig.name}`,
    html: shell(
      "Tu enlace de acceso seguro",
      `<h1 style="color:#fafaf9;font-size:20px;margin:0 0 8px 0;">Accede a tu cuenta</h1>
       <p>Haz clic en el siguiente botón para iniciar sesión de forma segura. El enlace caduca en 24 horas.</p>
       ${goldButton(url, "Iniciar sesión")}
       <p style="margin-top:24px;color:#7c7b76;">Si no solicitaste este acceso, puedes ignorar este email.</p>`
    ),
  }
}

export function welcomeEmail(name: string) {
  return {
    subject: `Bienvenido/a a ${siteConfig.name}`,
    html: shell(
      "Tu cuenta está lista",
      `<h1 style="color:#fafaf9;font-size:20px;margin:0 0 8px 0;">Hola ${name},</h1>
       <p>Tu cuenta en ${siteConfig.name} ya está lista. Ya puedes generar tu primera reclamación profesional en menos de dos minutos.</p>
       ${goldButton(`${siteConfig.url}/dashboard`, "Ir al panel")}`
    ),
  }
}

export function contactMessageEmail(params: { name: string; email: string; message: string }) {
  const safeMessage = escapeHtml(params.message).split("\n").join("<br/>")

  return {
    subject: `Nuevo mensaje de contacto de ${params.name}`,
    html: shell(
      `Mensaje de contacto de ${params.name}`,
      `<h1 style="color:#fafaf9;font-size:20px;margin:0 0 8px 0;">Nuevo mensaje de contacto</h1>
       <p><strong>Nombre:</strong> ${escapeHtml(params.name)}<br/>
       <strong>Email:</strong> ${escapeHtml(params.email)}</p>
       <div style="margin-top:16px;padding:16px;background:#0b0b0a;border:1px solid rgba(255,255,255,0.08);border-radius:12px;font-size:13px;">
         ${safeMessage}
       </div>`
    ),
  }
}

export function claimCopyEmail(params: { claimTitle: string; companyName: string; content: string }) {
  const contentHtml = params.content
    .split("\n")
    .map((line) => `<p style="margin:0 0 12px 0;">${line || "&nbsp;"}</p>`)
    .join("")

  return {
    subject: `Tu reclamación: ${params.claimTitle}`,
    html: shell(
      `Reclamación para ${params.companyName}`,
      `<h1 style="color:#fafaf9;font-size:20px;margin:0 0 8px 0;">${params.claimTitle}</h1>
       <p>Aquí tienes una copia de tu reclamación generada con ${siteConfig.name}.</p>
       <div style="margin-top:16px;padding:16px;background:#0b0b0a;border:1px solid rgba(255,255,255,0.08);border-radius:12px;font-size:13px;">
         ${contentHtml}
       </div>`
    ),
  }
}
