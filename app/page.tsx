"use client"

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatPanel from '@/components/ChatPanel2'
import ThemeModal from '@/components/ThemeModal'
import Image from 'next/image'

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'fast'>('general')
  const [clearSignal, setClearSignal] = useState(0)

  // Close on Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSidebarOpen(false)
        setThemeOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="h-screen w-full flex">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenTheme={() => setThemeOpen(true)}
        active={activeTab}
        onChangeActive={setActiveTab}
      />

      <div className="flex flex-col min-w-0 flex-1">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-950/60">
          <div className="container-page flex items-center gap-2 py-3">
            <button
              className="btn !px-2 !py-2 transition duration-300 ease-in-out active:scale-95 text-[hsl(var(--accent))]"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle menu"
              title="Menu"
            >
              <span className="relative block h-5 w-5">
                <span
                  className={`absolute left-0 h-[2px] w-full -translate-y-1/2 rounded bg-current transition-transform duration-300 ease-in-out will-change-transform ${
                    sidebarOpen ? 'top-1/2 rotate-45' : 'top-[25%]'
                  }`}
                />
                <span
                  className={`absolute left-0 h-[2px] w-full -translate-y-1/2 rounded bg-current transition-all duration-300 ease-in-out will-change-transform ${
                    sidebarOpen ? 'top-1/2 opacity-0 scale-x-0' : 'top-1/2 opacity-100 scale-x-100'
                  }`}
                />
                <span
                  className={`absolute left-0 h-[2px] w-full -translate-y-1/2 rounded bg-current transition-transform duration-300 ease-in-out will-change-transform ${
                    sidebarOpen ? 'top-1/2 -rotate-45' : 'top-[75%]'
                  }`}
                />
              </span>
            </button>
            {/* New chat (clear history for current agent) */}
            <button
              className="btn !px-2 !py-2 transition duration-300 ease-in-out active:scale-95 text-[hsl(var(--accent))]"
              onClick={() => setClearSignal((n) => n + 1)}
              aria-label="New chat (clear history)"
              title="New chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                <path d="M12 8v6" />
                <path d="M9 11h6" />
              </svg>
            </button>
            <div className="ml-auto" />
            <div className="flex items-center">
              <Image
                src="/kdhnb.png"
                alt="Logo"
                width={260}
                height={88}
                priority
                className="h-10 md:h-9 w-auto object-contain select-none invert dark:invert-0"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0">
          <div className="h-full">
            <ChatPanel agent={activeTab === 'general' ? 'agent1' : 'agent2'} clearSignal={clearSignal} />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      <button
        aria-label="Close menu overlay"
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Theme modal */}
      <ThemeModal open={themeOpen} onClose={() => setThemeOpen(false)} />
    </div>
  )
}
