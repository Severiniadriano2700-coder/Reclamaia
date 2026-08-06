import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Introduce un email válido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, "Introduce tu nombre completo"),
    email: z.string().email("Introduce un email válido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(8, "Mínimo 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export const magicLinkSchema = z.object({
  email: z.string().email("Introduce un email válido"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type MagicLinkInput = z.infer<typeof magicLinkSchema>
