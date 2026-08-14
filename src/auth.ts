import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Apple from "next-auth/providers/apple"
import Resend from "next-auth/providers/resend"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { db } from "@/lib/db"
import { loginSchema } from "@/lib/validations/auth"
import { resend, EMAIL_FROM } from "@/lib/resend"
import { magicLinkEmail } from "@/lib/email-templates"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url }) => {
        const { subject, html } = magicLinkEmail(url)
        await resend.emails.send({ from: EMAIL_FROM, to: identifier, subject, html })
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user?.passwordHash) return null

        const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
})
