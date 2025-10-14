"use client"

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTheme } from './ThemeProvider'
import { useLanguage } from './LanguageProvider'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPanel2({ agent, clearSignal }: { agent: 'agent1' | 'agent2' | 'drug' | 'study' | 'pediatric' | 'neonatal'; clearSignal?: number }) {
  const { mode, accent } = useTheme()
  const { t } = useLanguage()
  // Normalize content to reduce extra blank lines produced by the model
  const normalize = (text: string) =>
    text
      // Collapse 3+ newlines to a single blank line
      .replace(/\n{3,}/g, '\n\n')
      // Trim spaces around newlines
      .replace(/[\t ]+\n/g, '\n')
      // Avoid blank line between list items
      .replace(/\n\s*\n\s*([*-]\s+)/g, '\n$1')
      .trim()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadStep, setLoadStep] = useState(0)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Cycle loading steps while loading
  useEffect(() => {
    if (!loading) {
      setLoadStep(0)
      return
    }
    const id = setInterval(() => {
      setLoadStep((s) => (s + 1) % 4)
    }, 6000)
    return () => clearInterval(id)
  }, [loading])

  // Load last 10 messages for the current agent from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`chat-history-${agent}`)
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[]
        if (Array.isArray(parsed) && parsed.length) {
          setMessages(parsed.slice(-10))
          return
        }
      }
    } catch {}
    // No history: start empty
    setMessages([])
  }, [agent])

  // Save last 10 messages to localStorage whenever messages change
  useEffect(() => {
    try {
      const toSave = messages.slice(-10)
      localStorage.setItem(`chat-history-${agent}`, JSON.stringify(toSave))
    } catch {}
  }, [messages, agent])

  // Clear history on demand from parent
  useEffect(() => {
    if (clearSignal === undefined) return
    // When clearSignal changes, reset messages and clear storage for this agent
    try {
      localStorage.removeItem(`chat-history-${agent}`)
    } catch {}
    setMessages([])
  }, [clearSignal, agent])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    const next = [...messages, { role: 'user' as const, content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-12), agent }),
      })
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

      // Start streaming: create an empty assistant message we will append to
      setMessages((m) => [...m, { role: 'assistant', content: '' }])

      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        let idx: number
        while ((idx = buffer.indexOf('\n\n')) !== -1) {
          const frame = buffer.slice(0, idx)
          buffer = buffer.slice(idx + 2)
          const lines = frame.split('\n')
          const eventLine = lines.find((l) => l.startsWith('event: ')) || ''
          const dataLine = lines.find((l) => l.startsWith('data: ')) || ''
          const event = eventLine.slice(7).trim()
          const dataStr = dataLine.slice(6)
          if (!event || !dataStr) continue
          try {
            const payload = JSON.parse(dataStr)
            if (event === 'delta') {
              const delta = typeof payload?.text === 'string' ? payload.text : ''
              if (delta) {
                setMessages((m) => {
                  const copy = m.slice()
                  const last = copy[copy.length - 1]
                  if (last && last.role === 'assistant') {
                    copy[copy.length - 1] = { role: 'assistant', content: (last.content || '') + delta }
                  }
                  return copy
                })
              }
            } else if (event === 'done') {
              // End of stream
              break
            } else if (event === 'error') {
              throw new Error('stream_error')
            }
          } catch {}
        }
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: t('error.reply') },
      ])
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Pick agent-specific welcome hint
  const hintKey = (
    agent === 'agent1' ? 'welcome.hint.agent1'
    : agent === 'agent2' ? 'welcome.hint.agent2'
    : agent === 'drug' ? 'welcome.hint.drug'
    : agent === 'pediatric' ? 'welcome.hint.pediatric'
    : agent === 'neonatal' ? 'welcome.hint.neonatal'
    : 'welcome.hint.study'
  ) as any

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 relative">
      {/* Messages */}
      <div className="messages-scroll relative flex-1 max-h-full overflow-y-auto overscroll-contain scroll-smooth space-y-4 px-3 md:px-4 pt-20 md:pt-24 pb-24">
        {messages.length === 0 && !loading ? (
          <div className="absolute left-0 right-0 top-16 md:top-20 bottom-24 flex items-center justify-center px-6">
            <div className="text-center max-w-2xl">
              <div className="mx-auto mb-5 flex items-center justify-center">
                <Image
                  src="/kdhn.png"
                  alt="KDHN"
                  width={220}
                  height={70}
                  priority
                  className="h-12 md:h-14 w-auto object-contain select-none invert dark:invert-0"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold">{t('welcome.title')}</h1>
              <p className="mt-2 text-base md:text-lg text-gray-600 dark:text-gray-300">{t('welcome.subtitle')}</p>
              <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">{t(hintKey)}</p>
            </div>
          </div>
        ) : (
        messages.map((m, i) => {
          const isRtl = /[\u0600-\u06FF]/.test(m.content)
          const isUser = m.role === 'user'
          return (
          <div key={i} className={isUser ? 'text-right' : 'text-left'}>
            <div
              className={`inline-block max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                isUser
                  ? `bg-[hsl(var(--accent)/0.9)] ${
                      mode === 'dark' && accent === 'normal'
                        ? 'text-black [&_*]:text-black'
                        : 'text-white [&_*]:text-white'
                    }`
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
              style={m.role === 'user' && mode === 'dark' && accent === 'normal' ? { color: '#000' } : undefined}
            >
              {(() => {
                const userWhiteBubble = isUser && mode === 'dark' && accent === 'normal'
                const proseClass = isUser
                  ? (userWhiteBubble
                      ? 'chat-md max-w-none text-black [&_*]:text-black space-y-2'
                      : 'chat-md max-w-none text-white [&_*]:text-white space-y-2')
                  : 'chat-md prose prose-sm max-w-none dark:prose-invert'
                return (
                  <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'text-right' : 'text-left'}>
                    <ReactMarkdown
                      className={proseClass}
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeHighlight]}
                      components={{
                      a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
                        <a
                          {...props}
                          className={`${isUser ? 'text-inherit' : ''} underline decoration-dashed hover:decoration-solid`}
                        />
                      ),
                      code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) => {
                        const isInline = inline || !/\n/.test(String(children))
                        const base = 'rounded font-mono'
                        if (isInline) {
                          return (
                            <code className={`${base} bg-gray-200/70 dark:bg-gray-700/60 px-1`} {...props}>
                              {children}
                            </code>
                          )
                        }
                        return (
                          <pre className="overflow-auto rounded-md bg-gray-900 text-gray-100 p-3 text-xs">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        )
                      },
                    }}
                    >
                      {normalize(m.content)}
                    </ReactMarkdown>
                  </div>
                )
              })()}
            </div>
          </div>
          )
        }))}
        {loading && (
          <div className="text-left">
            <div className="inline-flex items-center gap-3 rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800">
              <Image
                src="/kdhn.png"
                alt={t('img.loading')}
                width={24}
                height={24}
                className="h-6 w-6 animate-spin select-none invert dark:invert-0"
                priority
              />
              <div
                className="text-sm text-gray-700 dark:text-gray-200"
                // Arabic and Sorani Kurdish are RTL
                dir={(() => {
                  try {
                    const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase()
                    return lang === 'ar' || lang === 'ckb' ? 'rtl' : 'ltr'
                  } catch { return 'ltr' }
                })()}
              >
                {[
                  t('loading.step.1'),
                  t('loading.step.2'),
                  t('loading.step.3'),
                  t('loading.step.4'),
                ][loadStep]}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Floating composer (scoped to chat section) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] max-w-4xl">
        <div className="relative pointer-events-auto rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-sm overflow-hidden">
          <textarea
            className="composer-textarea block w-full bg-transparent resize-none overflow-y-auto overflow-x-hidden rounded-2xl px-4 pr-20 py-3 text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 min-h-[48px] max-h-40"
            placeholder={t('input.placeholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button
            className={`absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium ${
              input.trim() && !loading
                ? 'btn-accent'
                : 'opacity-60 cursor-not-allowed bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            aria-label={t('send.aria')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5" />
              <path d="m5 12 7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
