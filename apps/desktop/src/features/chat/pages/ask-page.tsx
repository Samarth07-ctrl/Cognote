import * as React from 'react'
import { Send, MessageSquare, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Spinner } from '@/components/ui/spinner'
import { chatApi } from '@cognote/api-client'
import type { ChatMessage, Citation } from '@cognote/types'
import { cn } from '@/lib/utils'

const SUGGESTED = [
  'What is our current authentication architecture?',
  'Why did we choose PostgreSQL?',
  'What changed in the API architecture this year?',
  'Are there conflicting specifications?',
]

const STATE_LABELS: Record<string, string> = {
  generating: 'Cognote is thinking…',
  retrieving: 'Searching authorized knowledge…',
  answering: 'Generating answer…',
  no_evidence: 'No sufficient evidence found.',
  conflict: 'Conflicting information detected.',
  error: 'Something went wrong.',
}

function CitationCard({ citation }: { citation: Citation }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-xs">
      <BookOpen className="size-3.5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <p className="font-medium text-foreground truncate">{citation.documentTitle}</p>
        {citation.section && (
          <p className="text-muted-foreground truncate">{citation.section}</p>
        )}
        <p className="text-muted-foreground truncate">{citation.source}</p>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-3 text-sm space-y-3',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-card border border-border text-foreground'
        )}
      >
        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>

        {message.citations && message.citations.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-border/50">
            <p className="text-xs font-medium text-muted-foreground">Sources</p>
            {message.citations.map((c) => (
              <CitationCard key={c.id} citation={c} />
            ))}
          </div>
        )}

        {message.confidence && (
          <div className="flex items-center gap-2 pt-1">
            <Badge
              variant={
                message.confidence === 'high'
                  ? 'success'
                  : message.confidence === 'medium'
                    ? 'warning'
                    : 'destructive'
              }
            >
              {message.confidence.charAt(0).toUpperCase() + message.confidence.slice(1)} confidence
            </Badge>
            {message.processingLocation && (
              <span className="text-2xs text-muted-foreground">
                via {message.processingLocation}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function AskPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState('')
  const [streamingContent, setStreamingContent] = React.useState('')
  const [responseState, setResponseState] = React.useState<string | null>(null)
  const [isStreaming, setIsStreaming] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const sessionId = React.useRef(`sess_${Date.now()}`)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  async function handleSend(text: string) {
    if (!text.trim() || isStreaming) return

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sessionId: sessionId.current,
      role: 'user',
      content: text.trim(),
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)
    setStreamingContent('')
    setResponseState('retrieving')

    let finalContent = ''
    const finalCitations: Citation[] = []

    try {
      const stream = chatApi.streamMessage({
        sessionId: sessionId.current,
        message: text.trim(),
      })
      for await (const chunk of stream) {
        if (chunk.type === 'token' && chunk.token) {
          finalContent += chunk.token
          setStreamingContent((prev) => prev + chunk.token)
        }
        if (chunk.type === 'citation' && chunk.citation) {
          finalCitations.push(chunk.citation)
        }
        if (chunk.type === 'state_change' && chunk.state) {
          setResponseState(chunk.state)
        }
        if (chunk.type === 'done') break
        if (chunk.type === 'error') {
          setResponseState('error')
          break
        }
      }
    } catch {
      setResponseState('error')
    } finally {
      const assistantMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sessionId: sessionId.current,
        role: 'assistant',
        content: finalContent || streamingContent,
        citations: finalCitations,
        confidence: 'high', // MOCK — real confidence from backend in Phase 9
        processingLocation: 'Company Server', // MOCK
        responseState: 'done',
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMsg])
      setStreamingContent('')
      setResponseState(null)
      setIsStreaming(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void handleSend(input)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && !isStreaming && (
          <div className="flex h-full flex-col items-center justify-center gap-6 py-12">
            <EmptyState
              icon={<MessageSquare />}
              title="Ask Cognote"
              description="Ask anything about your organization's knowledge — decisions, architecture, projects, and more."
            />
            <div className="grid grid-cols-1 gap-2 w-full max-w-md">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void handleSend(s)}
                  className="text-left rounded-lg border border-border bg-card px-3 py-2.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="flex gap-3">
            <div className="max-w-[80%] rounded-lg border border-border bg-card px-4 py-3 text-sm space-y-2">
              {responseState && responseState !== 'answering' && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Spinner size="sm" />
                  {STATE_LABELS[responseState] ?? 'Working…'}
                </div>
              )}
              {streamingContent && (
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                  {streamingContent}
                  <span
                    className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse"
                    aria-hidden="true"
                  />
                </p>
              )}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border px-6 py-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Ask anything about your organization…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isStreaming}
            aria-label="Send message"
          >
            <Send className="size-4" aria-hidden="true" />
          </Button>
        </form>
        <p className="mt-2 text-2xs text-muted-foreground text-center">
          Answers are grounded in your authorized company knowledge only. Sources shown with every answer.
        </p>
      </div>
    </div>
  )
}
