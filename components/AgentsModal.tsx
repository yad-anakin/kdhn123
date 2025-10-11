"use client"

import { useLanguage } from './LanguageProvider'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAsterisk } from '@fortawesome/free-solid-svg-icons'

export type AgentId = 'agent1' | 'agent2' | 'drug' | 'study' | 'pediatric' | 'neonatal'
export type AgentGroup = 'medical' | 'calc' | 'study'

export default function AgentsModal({
  open,
  group,
  onClose,
  onSelect,
}: {
  open: boolean
  group: AgentGroup
  onClose: () => void
  onSelect: (agent: AgentId) => void
}) {
  const { t } = useLanguage()

  const title =
    group === 'medical' ? t('sidebar.group.medical')
    : group === 'calc' ? t('sidebar.group.calc')
    : t('sidebar.group.study')

  const items: { key: AgentId; labelKey: string }[] = (
    group === 'medical'
      ? [
          { key: 'agent1', labelKey: 'sidebar.agent.detailed' },
          { key: 'agent2', labelKey: 'sidebar.agent.fast' },
        ]
      : group === 'calc'
      ? [
          { key: 'drug', labelKey: 'sidebar.agent.drug' },
          { key: 'pediatric', labelKey: 'sidebar.agent.pediatric' },
          { key: 'neonatal', labelKey: 'sidebar.agent.neonatal' },
        ]
      : [
          { key: 'study', labelKey: 'sidebar.agent.study' },
        ]
  )

  return (
    <div aria-hidden={!open} className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <button
        aria-label={t('common.close')}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        className={`absolute inset-0 flex items-center justify-center p-4 md:p-6 overflow-y-auto transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="card p-4 w-[min(92vw,480px)] max-h-[90dvh] overflow-auto">
          <div className="flex items-center gap-2 group">
            <Image
              src="/kdhn.png"
              alt="KDHN"
              width={24}
              height={24}
              className="h-6 w-6 object-contain select-none invert dark:invert-0 group-hover:animate-[spin_2s_linear_infinite] active:animate-[spin_1.2s_linear_infinite]"
              priority
            />
            <h2 className="text-base font-semibold">{title}</h2>
            <button className="btn ml-auto" onClick={onClose}>{t('common.close')}</button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            {items.map(it => (
              <button
                key={it.key}
                className="group w-full px-3 py-2 rounded-md border transition text-left bg-gray-100 dark:bg-gray-900 border-transparent hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => onSelect(it.key)}
              >
                <span className="inline-flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faAsterisk}
                    className="text-[hsl(var(--accent))] group-hover:animate-spin active:animate-spin"
                  />
                  <span>{t(it.labelKey as any)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
