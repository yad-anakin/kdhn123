"use client"

import clsx from 'clsx'
import { useState } from 'react'
import { useLanguage } from './LanguageProvider'
export default function Sidebar({
  open,
  onClose,
  onOpenTheme,
  active: activeProp,
  onChangeActive,
}: {
  open: boolean
  onClose: () => void
  onOpenTheme: () => void
  active?: 'general' | 'fast'
  onChangeActive?: (val: 'general' | 'fast') => void
}) {
  const { t, lang, setLang } = useLanguage()
  const [internalActive, setInternalActive] = useState<'general' | 'fast'>('general')
  const active = activeProp ?? internalActive
  const setActive = (val: 'general' | 'fast') => {
    if (onChangeActive) onChangeActive(val)
    else setInternalActive(val)
  }

  const content = (
    <aside className="h-full w-full md:w-fit flex flex-col bg-white dark:bg-gray-950">
      <div
        className="px-3 min-h-16 flex items-center gap-2"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <span className="font-semibold">KDHN</span>
        <button
          className="btn md:hidden ml-auto !px-2 !py-2 transition transform hover:scale-110 active:scale-95 hover:rotate-3 text-[hsl(var(--accent))]"
          onClick={onClose}
          aria-label={t('sidebar.close')}
          title={t('sidebar.close_title')}
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav className="p-2 space-y-1">
        <button
          className={clsx(
            'w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 text-[hsl(var(--accent))]',
            active === 'general' && 'bg-gray-100 dark:bg-gray-900'
          )}
          onClick={() => setActive('general')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 19.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v13" />
            <path d="M4 19.5h16" />
            <path d="M8 8h8" />
            <path d="M8 12h8" />
          </svg>
          <span>{t('sidebar.general')}</span>
        </button>
        <button
          className={clsx(
            'w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 text-[hsl(var(--accent))]',
            active === 'fast' && 'bg-gray-100 dark:bg-gray-900'
          )}
          onClick={() => setActive('fast')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span>{t('sidebar.fast')}</span>
        </button>

        <button
          className="w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 text-[hsl(var(--accent))]"
          onClick={onOpenTheme}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15a1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 3.6a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 3.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c0 .57.22 1.12.6 1.53.38.41.6.96.6 1.53s-.22 1.12-.6 1.53A2.18 2.18 0 0 0 19.4 15z" />
          </svg>
          <span>{t('sidebar.color')}</span>
        </button>

        {/* Languages Section */}
        <div className="pt-2">
          <div className="px-3 py-1 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t('sidebar.languages')}
          </div>
          <div className="grid grid-cols-3 gap-2 px-2">
            <button
              className={clsx(
                'px-2 py-1.5 rounded-md text-sm border transition',
                lang === 'en'
                  ? 'bg-[hsl(var(--accent)/0.15)] border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]'
                  : 'bg-gray-100 dark:bg-gray-900 border-transparent hover:bg-gray-200 dark:hover:bg-gray-800'
              )}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              className={clsx(
                'px-2 py-1.5 rounded-md text-sm border transition',
                lang === 'ar'
                  ? 'bg-[hsl(var(--accent)/0.15)] border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]'
                  : 'bg-gray-100 dark:bg-gray-900 border-transparent hover:bg-gray-200 dark:hover:bg-gray-800'
              )}
              onClick={() => setLang('ar')}
            >
              العربية
            </button>
            <button
              className={clsx(
                'px-2 py-1.5 rounded-md text-sm border transition',
                lang === 'ckb'
                  ? 'bg-[hsl(var(--accent)/0.15)] border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]'
                  : 'bg-gray-100 dark:bg-gray-900 border-transparent hover:bg-gray-200 dark:hover:bg-gray-800'
              )}
              onClick={() => setLang('ckb')}
            >
              کوردی
            </button>
          </div>
        </div>
      </nav>

      {/* Footer links on one row */}
      <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between gap-3">
          {/* Website */}
          <a
            href="https://www.kdhn.krd/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-[hsl(var(--accent))] transition"
          >
            {/* Globe icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>kdhn.krd</span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/kurdistan.digital.healthnet?igsh=MWtjcnJyNTV1bHlnYw=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-[hsl(var(--accent))] transition"
          >
            {/* Instagram icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
            </svg>
            <span>{t('social.instagram')}</span>
          </a>
        </div>
      </div>
    </aside>
  )

  return (
    <div
      className={clsx(
        // Base: mobile drawer, desktop inline with width animation
        'z-40 md:z-auto fixed inset-y-0 left-0 w-full md:static md:shrink-0',
        // Mobile slide animation
        'transform transition-transform duration-300 ease-out md:transform-none',
        // Desktop width animation
        'md:overflow-hidden md:transition-[max-width] md:duration-300 md:ease-out',
        // States
        open
          ? 'translate-x-0 md:max-w-[280px]'
          : '-translate-x-full md:max-w-0'
      )}
    >
      {content}
    </div>
  )
}
