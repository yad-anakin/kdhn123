"use client"

import clsx from 'clsx'
import { useState } from 'react'
import { useLanguage } from './LanguageProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark,
  faNotesMedical,
  faChevronRight,
  faCalculator,
  faBookOpen,
  faPalette,
  faLanguage,
  faCheck,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
type AgentId = 'agent1' | 'agent2' | 'drug' | 'study' | 'pediatric' | 'neonatal'

export default function Sidebar({
  open,
  onClose,
  onOpenTheme,
  onOpenLanguage,
  onOpenSidebar,
  active,
  onChangeActive,
}: {
  open: boolean
  onClose: () => void
  onOpenTheme: () => void
  onOpenLanguage: () => void
  onOpenSidebar?: () => void
  active?: AgentId
  onChangeActive?: (val: AgentId) => void
}) {
  const { t, lang, setLang } = useLanguage()
  const [internalActive, setInternalActive] = useState<AgentId>('agent1')
  const current = active ?? internalActive
  const setActive = (val: AgentId) => {
    if (onChangeActive) onChangeActive(val)
    else setInternalActive(val)
  }

  const [openMedical, setOpenMedical] = useState(true)
  const [openCalc, setOpenCalc] = useState(false)
  const [openStudy, setOpenStudy] = useState(false)

  // Desktop collapsed rail (only icons) when sidebar is closed
  const collapsed = !open

  const content = (
    <aside className={clsx(
      'h-full w-full md:w-full flex flex-col bg-white dark:bg-gray-950 overscroll-contain sidebar-scroll',
      'md:border-r md:border-gray-200 dark:md:border-gray-800',
      collapsed ? 'md:overflow-y-hidden' : 'overflow-y-auto'
    )}>
      <div
        className={clsx(
          'sticky top-0 z-20 min-h-16 flex items-center bg-white dark:bg-gray-950',
          collapsed ? 'justify-center px-0' : 'pr-3 pl-5 gap-2'
        )}
      >
        {/* Brand: show text+logo when expanded; logo only when collapsed */}
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <Image src="/kdhn.png" alt="KDHN" width={20} height={20} className="h-[20px] w-auto object-contain filter brightness-0 dark:brightness-100" />
            <span className="font-semibold">KDHN</span>
          </div>
        ) : (
          <button
            type="button"
            className="hidden md:flex items-center justify-center py-3 group cursor-pointer"
            onClick={() => {
              if (onOpenSidebar) {
                onOpenSidebar()
              } else if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('sidebar:open'))
              }
            }}
            title="KDHN"
            aria-label="Open sidebar"
          >
            <Image
              src="/kdhn.png"
              alt="KDHN"
              width={28}
              height={28}
              className="h-7 w-7 object-contain filter brightness-0 dark:brightness-100 transition-transform duration-500 group-hover:rotate-180"
            />
          </button>
        )}
        <button
          className="btn md:hidden ml-auto !px-2 !py-2 transition transform hover:scale-110 active:scale-95 hover:rotate-3 text-[hsl(var(--accent))]"
          onClick={onClose}
          aria-label={t('sidebar.close')}
          title={t('sidebar.close_title')}
        >
          <FontAwesomeIcon icon={faXmark} className="text-base" />
        </button>
      </div>
      <nav className="p-2 space-y-2">
        {/* Inset separator under header for better alignment */}
        <div className="mb-2 border-t border-gray-200 dark:border-gray-800 mx-1" />
        {/* Group: Medical Info */}
        <div>
          <button
            className={clsx(
              'w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 text-[hsl(var(--accent))]',
              collapsed ? 'md:justify-center md:gap-0' : ''
            )}
            onClick={() => {
              if (collapsed) { setActive('agent1'); return }
              setOpenMedical((v) => !v)
            }}
            aria-expanded={openMedical}
            title={t('sidebar.group.medical')}
          >
            <FontAwesomeIcon icon={faNotesMedical} className={clsx('text-sm', collapsed && 'md:text-lg')} />
            <span className={clsx(collapsed ? 'hidden md:hidden' : '')}>{t('sidebar.group.medical')}</span>
            <FontAwesomeIcon icon={faChevronRight} className={clsx('ml-auto transition-transform text-xs', openMedical ? 'rotate-90' : '', collapsed ? 'hidden md:hidden' : '')} />
          </button>
          {openMedical && !collapsed && (
            <div className="mt-1 space-y-1 pl-6">
              <button
                className={clsx(
                  'w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 border',
                  current === 'agent1'
                    ? 'bg-gray-100 dark:bg-gray-900 border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]'
                    : 'border-transparent'
                )}
                aria-selected={current === 'agent1'}
                onClick={() => setActive('agent1')}
                title={t('sidebar.agent.detailed')}
              >
                <FontAwesomeIcon icon={faCaretRight} className="text-xs opacity-70" />
                <span>{t('sidebar.agent.detailed')}</span>
                <FontAwesomeIcon icon={faCheck} className={clsx('ml-auto text-[hsl(var(--accent))]', current === 'agent1' ? 'opacity-100' : 'opacity-0')} />
              </button>
              <button
                className={clsx(
                  'w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 border',
                  current === 'agent2'
                    ? 'bg-gray-100 dark:bg-gray-900 border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]'
                    : 'border-transparent'
                )}
                aria-selected={current === 'agent2'}
                onClick={() => setActive('agent2')}
                title={t('sidebar.agent.fast')}
              >
                <FontAwesomeIcon icon={faCaretRight} className="text-xs opacity-70" />
                <span>{t('sidebar.agent.fast')}</span>
                <FontAwesomeIcon icon={faCheck} className={clsx('ml-auto text-[hsl(var(--accent))]', current === 'agent2' ? 'opacity-100' : 'opacity-0')} />
              </button>
            </div>
          )}
        </div>

        {/* Group: Calculation */}
        <div>
          <button
            className={clsx(
              'w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 text-[hsl(var(--accent))]',
              collapsed ? 'md:justify-center md:gap-0' : ''
            )}
            onClick={() => {
              if (collapsed) { setActive('drug'); return }
              setOpenCalc((v) => !v)
            }}
            aria-expanded={openCalc}
            title={t('sidebar.group.calc')}
          >
            <FontAwesomeIcon icon={faCalculator} className={clsx('text-sm', collapsed && 'md:text-lg')} />
            <span className={clsx(collapsed ? 'hidden md:hidden' : '')}>{t('sidebar.group.calc')}</span>
            <FontAwesomeIcon icon={faChevronRight} className={clsx('ml-auto transition-transform text-xs', openCalc ? 'rotate-90' : '', collapsed ? 'hidden md:hidden' : '')} />
          </button>
          {openCalc && !collapsed && (
            <div className="mt-1 space-y-1 pl-6">
              <button
                className={clsx(
                  'w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 border',
                  current === 'drug'
                    ? 'bg-gray-100 dark:bg-gray-900 border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]'
                    : 'border-transparent'
                )}
                aria-selected={current === 'drug'}
                onClick={() => setActive('drug')}
                title={t('sidebar.agent.drug')}
              >
                <FontAwesomeIcon icon={faCaretRight} className="text-xs opacity-70" />
                <span>{t('sidebar.agent.drug')}</span>
                <FontAwesomeIcon icon={faCheck} className={clsx('ml-auto text-[hsl(var(--accent))]', current === 'drug' ? 'opacity-100' : 'opacity-0')} />
              </button>
              <button
                className={clsx(
                  'w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 border',
                  current === 'pediatric'
                    ? 'bg-gray-100 dark:bg-gray-900 border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]'
                    : 'border-transparent'
                )}
                aria-selected={current === 'pediatric'}
                onClick={() => setActive('pediatric')}
                title={t('sidebar.agent.pediatric')}
              >
                <FontAwesomeIcon icon={faCaretRight} className="text-xs opacity-70" />
                <span>{t('sidebar.agent.pediatric')}</span>
                <FontAwesomeIcon icon={faCheck} className={clsx('ml-auto text-[hsl(var(--accent))]', current === 'pediatric' ? 'opacity-100' : 'opacity-0')} />
              </button>
              <button
                className={clsx(
                  'w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 border',
                  current === 'neonatal'
                    ? 'bg-gray-100 dark:bg-gray-900 border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]'
                    : 'border-transparent'
                )}
                aria-selected={current === 'neonatal'}
                onClick={() => setActive('neonatal')}
                title={t('sidebar.agent.neonatal')}
              >
                <FontAwesomeIcon icon={faCaretRight} className="text-xs opacity-70" />
                <span>{t('sidebar.agent.neonatal')}</span>
                <FontAwesomeIcon icon={faCheck} className={clsx('ml-auto text-[hsl(var(--accent))]', current === 'neonatal' ? 'opacity-100' : 'opacity-0')} />
              </button>
            </div>
          )}
        </div>

        {/* Group: Study */}
        <div>
          <button
            className={clsx(
              'w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 text-[hsl(var(--accent))]',
              collapsed ? 'md:justify-center md:gap-0' : ''
            )}
            onClick={() => {
              if (collapsed) { setActive('study'); return }
              setOpenStudy((v) => !v)
            }}
            aria-expanded={openStudy}
            title={t('sidebar.group.study')}
          >
            <FontAwesomeIcon icon={faBookOpen} className={clsx('text-sm', collapsed && 'md:text-lg')} />
            <span className={clsx(collapsed ? 'hidden md:hidden' : '')}>{t('sidebar.group.study')}</span>
            <FontAwesomeIcon icon={faChevronRight} className={clsx('ml-auto transition-transform text-xs', openStudy ? 'rotate-90' : '', collapsed ? 'hidden md:hidden' : '')} />
          </button>
          {openStudy && !collapsed && (
            <div className="mt-1 space-y-1 pl-6">
              <button
                className={clsx(
                  'w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 border',
                  current === 'study'
                    ? 'bg-gray-100 dark:bg-gray-900 border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]'
                    : 'border-transparent'
                )}
                aria-selected={current === 'study'}
                onClick={() => setActive('study')}
                title={t('sidebar.agent.study')}
              >
                <FontAwesomeIcon icon={faCaretRight} className="text-xs opacity-70" />
                <span>{t('sidebar.agent.study')}</span>
                <FontAwesomeIcon icon={faCheck} className={clsx('ml-auto text-[hsl(var(--accent))]', current === 'study' ? 'opacity-100' : 'opacity-0')} />
              </button>
            </div>
          )}
        </div>

        <button
          className={clsx(
            'w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 text-[hsl(var(--accent))]',
            collapsed ? 'md:justify-center md:gap-0' : ''
          )}
          onClick={onOpenTheme}
          title={t('sidebar.color')}
        >
          {/* Palette icon */}
          <FontAwesomeIcon icon={faPalette} className={clsx('text-sm', collapsed && 'md:text-lg')} />
          <span className={clsx(collapsed ? 'hidden md:hidden' : '')}>{t('sidebar.color')}</span>
        </button>

        {/* Languages as link to modal */}
        <button
          className={clsx(
            'w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition inline-flex items-center gap-2 text-[hsl(var(--accent))]',
            collapsed ? 'md:justify-center md:gap-0' : ''
          )}
          onClick={onOpenLanguage}
          title={t('sidebar.languages')}
        >
          {/* Language/translate icon */}
          <FontAwesomeIcon icon={faLanguage} className={clsx('text-sm', collapsed && 'md:text-lg')} />
          <span className={clsx(collapsed ? 'hidden md:hidden' : '')}>{t('sidebar.languages')}</span>
        </button>

        {/* Removed inline language grid; replaced by modal trigger above */}
      </nav>

      {/* Footer hidden when collapsed */}
      {!collapsed && (
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
      )}
    </aside>
  )

  return (
    <div
      className={clsx(
        // Base: mobile drawer, desktop inline with width animation
        'z-40 md:z-20 fixed left-0 w-full md:static md:shrink-0',
        // Mobile slide animation
        'transform transition-transform duration-300 ease-out',
        // Desktop width animation
        'md:overflow-hidden md:transition-[max-width] md:duration-300 md:ease-out',
        // States
        open
          ? 'translate-x-0 md:max-w-[280px]'
          : '-translate-x-full md:translate-x-0 md:max-w-[56px]'
      )}
      style={{
        top: 'env(safe-area-inset-top)',
        bottom: 'env(safe-area-inset-bottom)'
      }}
    >
      {content}
    </div>
  )
}
