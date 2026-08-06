import { z } from "zod"

import { claimCategoryValues } from "./claim"

export const analyzeClaimSchema = z.object({
  category: z.enum(claimCategoryValues),
  companyName: z.string().min(2).max(120),
  incidentDate: z.string().optional(),
  description: z.string().min(10).max(4000),
  desiredOutcome: z.string().min(5).max(1000),
  firstName: z.string().max(80).optional(),
  lastName: z.string().max(80).optional(),
  dni: z.string().max(20).optional(),
  address: z.string().max(200).optional(),
  referenceNumber: z.string().max(80).optional(),
  claimedAmount: z.string().max(40).optional(),
  generatedContent: z.string().min(1),
})

export type AnalyzeClaimInput = z.infer<typeof analyzeClaimSchema>
