export interface ClaimGenerationInput {
  category: string
  companyName: string
  incidentDate?: string
  description: string
  desiredOutcome: string
  firstName?: string
  lastName?: string
  dni?: string
  address?: string
  referenceNumber?: string
  claimedAmount?: string
  /** Gaps flagged by a previous quality analysis, to be addressed on regeneration. */
  improvementNotes?: string[]
}

export interface ClaimAnalysis {
  score: number
  strengths: string[]
  improvements: string[]
}

export interface ClaimAnalysisInput extends ClaimGenerationInput {
  generatedContent: string
}

export interface ChatTurn {
  role: "user" | "assistant"
  content: string
}

export interface ClaimSummary {
  title: string
  category: string
  status: string
  companyName: string | null
  createdAt: string
}

export interface ChatCompletionInput {
  messages: ChatTurn[]
  claims: ClaimSummary[]
}

export interface AiGenerationProvider {
  readonly id: "openai" | "anthropic" | "mock"
  readonly model: string
  generate(input: ClaimGenerationInput): AsyncIterable<string>
  analyze(input: ClaimAnalysisInput): Promise<ClaimAnalysis>
  chat(input: ChatCompletionInput): AsyncIterable<string>
}

export class AiProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = "AiProviderError"
  }
}
