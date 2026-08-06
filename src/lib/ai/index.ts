import type { AiGenerationProvider } from "./types"
import { OpenAiProvider } from "./providers/openai"
import { AnthropicProvider } from "./providers/anthropic"
import { MockProvider } from "./providers/mock"

export type { ClaimGenerationInput, ClaimAnalysis, ClaimAnalysisInput, AiGenerationProvider } from "./types"
export { AiProviderError } from "./types"

/**
 * Provider is selected purely from env config, so switching between OpenAI,
 * Anthropic, or the offline demo provider never touches call sites.
 */
export function getAiProvider(): AiGenerationProvider {
  const configured = (process.env.AI_PROVIDER ?? "mock").toLowerCase()

  if (configured === "openai" && process.env.OPENAI_API_KEY) {
    return new OpenAiProvider(process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL)
  }

  if (configured === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    return new AnthropicProvider(process.env.ANTHROPIC_API_KEY, process.env.ANTHROPIC_MODEL)
  }

  return new MockProvider()
}
