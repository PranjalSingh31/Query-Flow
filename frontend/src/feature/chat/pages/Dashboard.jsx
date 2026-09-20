import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import {useChat} from '../hooks/useChat'

const Dashboard = () => {

  const chat = useChat()
  const { chats, currentChatId, isLoading } = useSelector((state) => state.chat)
  const [inputMessage, setInputMessage] = useState('')
  const currentChat = currentChatId ? chats[currentChatId] : null
  const chatList = Object.values(chats)
  const messages = currentChat?.messages || []

  const markdownComponents = {
    h1: ({ children }) => <h1 className="mb-3 text-2xl font-semibold">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-2 mt-4 text-xl font-semibold">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-2 mt-3 text-lg font-semibold">{children}</h3>,
    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>,
    ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>,
    li: ({ children }) => <li>{children}</li>,
    a: ({ children, href }) => (
      <a className="text-blue-300 underline" href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-[#252525] px-1.5 py-0.5 text-[13px] text-neutral-100">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="mb-3 overflow-x-auto rounded-md bg-[#0c0c0c] p-3 text-[13px] leading-5">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-3 border-l-2 border-[#666] pl-3 text-neutral-300">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  }

  useEffect(()=>{
    chat.initiliazedSocketConnection()
    chat.handleGetChats().catch(() => {})
  }, [])

  const handleSelectChat = (chatId) => {
    chat.handleSelectChat(chatId).catch(() => {})
  }

  const handleDeleteChat = async (chatId, event) => {
    if (event) {
      event.stopPropagation()
    }

    await chat.handleDeleteChat(chatId).catch(() => {})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const message = inputMessage.trim()

    if (!message) {
      return
    }

    try {
      setInputMessage('')

      await chat.handleSendMessage({
        message,
        chatId: currentChatId,
      })
    } catch (error) {
      setInputMessage(message)
    }
  }

  return (
    <main className="h-screen w-full bg-[#111] p-4 text-white">
      <section className="flex h-full w-full overflow-hidden rounded-lg border border-[#4e4e4e] bg-[#151515]">
        <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[#343434] bg-[#101010] p-3">
          <h1 className="mb-4 text-sm font-semibold">QueryFlow</h1>

          <button
            className="mb-4 rounded-md border border-[#555] px-3 py-2 text-left text-sm text-white"
            onClick={chat.handleNewChat}
            type="button"
          >
            + New chat
          </button>

          <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
            {chatList.map((item) => (
              <div
                className={`flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-neutral-200 hover:bg-[#202020] ${
                  item._id === currentChatId ? 'bg-[#202020]' : ''
                }`}
                key={item._id}
              >
                <button
                  className="flex-1 overflow-hidden text-left truncate"
                  onClick={() => handleSelectChat(item._id)}
                  type="button"
                >
                  {item.title || 'Untitled chat'}
                </button>

                <button
                  className="rounded border border-[#555] px-2 py-1 text-[11px] text-neutral-300 hover:bg-[#2a2a2a]"
                  onClick={(event) => handleDeleteChat(item._id, event)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col bg-[#181818]">
          <header className="flex h-14 items-center justify-between border-b border-[#343434] px-5">
            <h2 className="text-sm font-medium">{currentChat?.title || 'New chat'}</h2>

            {currentChatId && (
              <button
                className="rounded border border-[#666] px-2 py-1 text-[11px]"
                onClick={() => handleDeleteChat(currentChatId)}
                type="button"
              >
                Delete chat
              </button>
            )}
          </header>

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
            {messages.map((message, index) => (
              <div
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                key={`${message.role}-${index}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg border border-[#3f3f3f] px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-[#2b2b2b] text-white'
                      : 'bg-[#141414] text-neutral-100'
                  }`}
                >
                  {message.role === 'user' ? (
                    message.content
                  ) : (
                    <ReactMarkdown components={markdownComponents}>
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
          </div>

          <footer className="border-t border-[#343434] p-4">
            <form
              className="flex items-center gap-3 rounded-lg border border-[#555] bg-[#101010] px-4 py-3"
              onSubmit={handleSubmit}
            >
              <input
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
                onChange={(event) => setInputMessage(event.target.value)}
                placeholder="Message QueryFlow"
                type="text"
                value={inputMessage}
              />
              <button
                className="rounded-md border border-[#666] px-4 py-2 text-sm"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? 'Sending' : 'Send'}
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Dashboard
