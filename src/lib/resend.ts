import { Resend } from "resend"

const apiKey = process.env.RESEND_API_KEY

export const resend = new Resend(apiKey ?? "re_placeholder")

export const isResendConfigured = Boolean(apiKey)

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "Litiga IA <no-reply@litiga-ia.com>"
