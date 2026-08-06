import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().min(2, "Introduce tu nombre").max(120),
  email: z.string().email("Introduce un email válido"),
  message: z.string().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)").max(2000),
})

export type ContactInput = z.infer<typeof contactSchema>
