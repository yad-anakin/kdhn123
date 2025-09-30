import { NextRequest, NextResponse } from 'next/server'
import { agent1Prompt } from '@/prompts/agent1'
import { agent2Prompt } from '@/prompts/agent2'

export const runtime = 'nodejs'

type InMsg = { role: 'user' | 'assistant'; content: string }
type PostBody = {
  messages: InMsg[]
  agent?: 'agent1' | 'agent2'
  customPrompt?: string
}

const AGENT_PROMPTS: Record<'agent1' | 'agent2', string> = {
  agent1: agent1Prompt,
  agent2: agent2Prompt,
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PostBody
    const lastUser = [...(body?.messages || [])].reverse().find((m) => m.role === 'user')?.content || ''

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      // Mock response if no key is provided
      const reply = `Mock reply (Gemini): You asked — "${lastUser.slice(0, 400)}"\n\n` +
        'I can provide general information. For medical concerns, consult a qualified professional.'
      return NextResponse.json({ reply })
    }

    const agent = body.agent || 'agent1'
    const systemInstruction = (body.customPrompt && body.customPrompt.trim()) || AGENT_PROMPTS[agent]

    // Map messages to Gemini format
    const contents = (body.messages || []).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(apiKey),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: { temperature: 0.3 },
        }),
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('Gemini error', res.status, text)
      return NextResponse.json({ reply: 'Sorry, there was an error contacting the AI service.' }, { status: 200 })
    }

    const data = (await res.json()) as any
    const reply: string = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('').trim() ||
      'Sorry, I could not generate a response.'
    return NextResponse.json({ reply })
  } catch (e) {
    console.error('API error', e)
    return NextResponse.json({ reply: 'Sorry, something went wrong. Please try again.' }, { status: 200 })
  }
}
