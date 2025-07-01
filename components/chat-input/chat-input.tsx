"use client"

import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useLayoutEffect } from "react"

interface ChatInputProps {
  onSubmitMessage: (message: string) => void
}

export const ChatInput = ({ onSubmitMessage }: ChatInputProps) => {
  const [message, setMessage] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedMessage = message.trim()
    if (!trimmedMessage) return

    onSubmitMessage(trimmedMessage)
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (textareaRef.current?.form) {
        const form = textareaRef.current.form
        const submitEvent = new Event("submit", { bubbles: true, cancelable: true })
        form.dispatchEvent(submitEvent)
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-start rounded-2xl border border-gray-200 bg-white shadow-lg transition-all focus-within:ring-2 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
    >
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Send a message..."
        className="w-full resize-none overflow-y-hidden rounded-2xl border-none bg-transparent p-4 pr-16 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-0 dark:text-white dark:placeholder:text-gray-400 md:text-base"
        rows={1}
        aria-label="Chat message input"
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-600 md:right-3"
        disabled={!message.trim()}
        aria-label="Send message"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
