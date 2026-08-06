import OpenAI from "openai"

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

export class OpenAiProvider implements AiGenerationProvider {
  readonly id = "openai" as const
  readonly model: string
  private client: OpenAI

  constructor(apiKey: string, model = "gpt-4.1") {
    this.client = new OpenAI({ apiKey })
    this.model = model
  }

  async *generate(input: ClaimGenerationInput) {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        stream: true,
        temperature: 0.4,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(input) },
        ],
      })

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content
        if (token) yield token
      }
    } catch (error) {
      throw new AiProviderError("Fallo al generar con OpenAI", "openai", error)
    }
  }

  async analyze(input: ClaimAnalysisInput): Promise<ClaimAnalysis> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
          { role: "user", content: buildAnalysisPrompt(input) },
        ],
      })

      const text = response.choices[0]?.message?.content ?? "{}"
      return parseAnalysisResponse(text)
    } catch (error) {
      throw new AiProviderError("Fallo al analizar con OpenAI", "openai", error)
    }
  }

  async *chat(input: ChatCompletionInput) {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        stream: true,
        temperature: 0.4,
        messages: [
          { role: "system", content: `${CHAT_SYSTEM_PROMPT}\n\n${buildChatContext(input.claims)}` },
          ...input.messages.map((m) => ({ role: m.role, content: m.content }) as const),
        ],
      })

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content
        if (token) yield token
      }
    } catch (error) {
      throw new AiProviderError("Fallo al chatear con OpenAI", "openai", error)
    }
  }
}
