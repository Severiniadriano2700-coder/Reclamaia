import type { NextAuthConfig } from "next-auth"

/**
 * Edge-compatible subset of the auth config, used by middleware.
 * No adapter, no Node-only providers (Prisma/bcrypt/Resend) — those would
 * push the Edge middleware function past Vercel's 1MB size limit.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
    error: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role ?? "USER"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER"
      }
      return session
    },
  },
} satisfies NextAuthConfig
