import { z } from "zod"

export const sendChatMessageSchema = z.object({
  message: z.string().min(1, "Escribe un mensaje").max(2000, "Mensaje demasiado largo"),
  claimId: z.string().min(1).optional(),
})

export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>
