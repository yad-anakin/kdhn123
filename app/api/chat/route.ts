import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI, MediaResolution } from '@google/genai'
import { agent1Prompt } from '@/prompts/agent1'
import { agent2Prompt } from '@/prompts/agent2'
import { drugCalculatorPrompt } from '@/prompts/drugCalculator'
import { studyAssistantPrompt } from '@/prompts/studyAssistant'
import { pediatricDrugCalculatorPrompt } from '@/prompts/pediatricDrugCalculator'
import { neonatalDrugCalculatorPrompt } from '@/prompts/neonatalDrugCalculator'

export const runtime = 'nodejs'

type InMsg = { role: 'user' | 'assistant'; content: string }
type PostBody = {
  messages: InMsg[]
  agent?: 'agent1' | 'agent2' | 'drug' | 'study' | 'pediatric' | 'neonatal'
  customPrompt?: string
}

const AGENT_PROMPTS: Record<'agent1' | 'agent2' | 'drug' | 'study' | 'pediatric' | 'neonatal', string> = {
  agent1: agent1Prompt,
  agent2: agent2Prompt,
  drug: drugCalculatorPrompt,
  study: studyAssistantPrompt,
  pediatric: pediatricDrugCalculatorPrompt,
  neonatal: neonatalDrugCalculatorPrompt,
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PostBody
    const lastUser = [...(body?.messages || [])].reverse().find((m) => m.role === 'user')?.content || ''

    const apiKey = process.env.GEMINI_API_KEY

    const agent = body.agent || 'agent1'
    const baseInstruction = (body.customPrompt && body.customPrompt.trim()) || AGENT_PROMPTS[agent]
    const isCalcAgent = agent === 'drug' || agent === 'pediatric' || agent === 'neonatal'
    const isSafeguardExempt = isCalcAgent || agent === 'study'
    const languagePolicy = isCalcAgent
      ? 'Language: Respond in Kurdish (Central Kurdish - Sorani). Use clear, concise medical language consistent with the calculator prompts.'
      : 'Language: Respond in the SAME language as the user\'s last message. Do NOT translate or switch languages unless explicitly requested. If the user writes in a right-to-left script, respond in that script.'

    const proceduralParagraph = '\n\nFor medical/clinical or procedural guidance: (1) include a concise verification checklist of key points you validated, (2) include at least two credible citations (guidelines, textbooks, primary sources) when available, (3) if confidence is low or sources conflict, ask for clarification.'
    const systemInstruction =
      baseInstruction +
      '\n\nMost important: strictly fact-check every statement. Verify names, data, dates, drug dosages, calculations, procedural steps, contraindications, and any quantitative claims against reliable sources. If uncertain, ask for clarification or state uncertainty clearly. Prefer citing credible sources or links when making factual claims. Never fabricate facts.' +
      (!isSafeguardExempt ? proceduralParagraph : '') +
      `\n\n${languagePolicy}` +
      '\n\nTruthfulness policy (applies to all agents): Always tell the truth and correct false assumptions. Never invent, omit, or obscure facts. If you do not know, clearly say you do not know. If content involves risks, still present accurate facts and include concise safety warnings where relevant.' +
      '\n\nFormat: Respond as plain text for the user-facing answer. Do NOT include your internal reasoning. Output text only.'

    // Map messages to Gemini format
    const contents = (body.messages || []).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    // Streaming response via SSE using Google GenAI generateContentStream (default)
    const encoder = new TextEncoder()

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const write = (event: string, data: any) => {
          const payload = `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(payload))
        }
        try {
          if (!apiKey) {
            // Stream a mock message if no key is provided
            write('delta', { text: `Mock reply (Gemini): You asked — "${lastUser.slice(0, 400)}"` })
            write('delta', { text: '\n\nI can provide general information. For medical concerns, consult a qualified professional.' })
            write('citations', { urls: [] })
            write('done', {})
            controller.close()
            return
          }

          const ai = new GoogleGenAI({ apiKey })
          const model = 'gemini-2.5-flash'
          const response = await ai.models.generateContentStream({
            model,
            config: {
              thinkingConfig: {
                thinkingBudget: -1,
              },
              mediaResolution: MediaResolution.MEDIA_RESOLUTION_UNSPECIFIED,
              temperature: 1,
              // Let the model emit text freely for streaming; parse/format in client if needed
              responseMimeType: 'text/plain',
              systemInstruction: systemInstruction,
            },
            contents,
          })

          for await (const chunk of response as any) {
            const text = chunk?.text || ''
            if (text) write('delta', { text })
          }
          write('done', {})
          controller.close()
        } catch (e) {
          write('error', { message: 'stream_error' })
          try { controller.close() } catch {}
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (e) {
    console.error('API error', e)
    return NextResponse.json({ reply: 'Sorry, something went wrong. Please try again.' }, { status: 200 })
  }
}
