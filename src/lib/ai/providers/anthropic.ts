import Anthropic from "@anthropic-ai/sdk"

import type {
  AiGenerationProvider,
  ClaimGenerationInput,
  ClaimAnalysisInput,
  ClaimAnalysis,
  ChatCompletionInput,
} from "../types"
import { AiProviderError } from "../types"
import {
  SYSTEM_PROMPT,
  buildUserPrompt,
  ANALYSIS_SYSTEM_PROMPT,
  buildAnalysisPrompt,
  CHAT_SYSTEM_PROMPT,
  buildChatContext,
} from "../prompt"
import { parseAnalysisResponse } from "../parse-analysis"

export class AnthropicProvider implements AiGenerationProvider {
  readonly id = "anthropic" as const
  readonly model: string
  private client: Anthropic

  constructor(apiKey: string, model = "claude-sonnet-5") {
    this.client = new Anthropic({ apiKey })
    this.model = model
  }

  async *generate(input: ClaimGenerationInput) {
    try {
      const stream = this.client.messages.stream({
        model: this.model,
        max_tokens: 2048,
        temperature: 0.4,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(input) }],
      })

      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          yield event.delta.text
        }
      }
    } catch (error) {
      throw new AiProviderError("Fallo al generar con Anthropic", "anthropic", error)
    }
  }

  async analyze(input: ClaimAnalysisInput): Promise<ClaimAnalysis> {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        temperature: 0.2,
        system: ANALYSIS_SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildAnalysisPrompt(input) }],
      })

      const block = response.content.find((c) => c.type === "text")
      const text = block && block.type === "text" ? block.text : "{}"
      return parseAnalysisResponse(text)
    } catch (error) {
      throw new AiProviderError("Fallo al analizar con Anthropic", "anthropic", error)
    }
  }

  async *chat(input: ChatCompletionInput) {
    try {
      const stream = this.client.messages.stream({
        model: this.model,
        max_tokens: 1024,
        temperature: 0.4,
        system: `${CHAT_SYSTEM_PROMPT}\n\n${buildChatContext(input.claims)}`,
        messages: input.messages.map((m) => ({ role: m.role, content: m.content })),
      })

      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          yield event.delta.text
        }
      }
    } catch (error) {
      throw new AiProviderError("Fallo al chatear con Anthropic", "anthropic", error)
    }
  }
}
