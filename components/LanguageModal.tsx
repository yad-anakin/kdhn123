"use client"

import { useLanguage } from './LanguageProvider'

export default function LanguageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, setLang, lang } = useLanguage()

  function choose(l: 'en' | 'ar' | 'ckb') {
    setLang(l)
    onClose()
  }

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
        <div className="card p-4 w-[min(92vw,420px)] max-h-[90dvh] overflow-auto">
          <div className="flex items-center">
            <h2 className="text-base font-semibold">{t('sidebar.languages')}</h2>
            <button className="btn ml-auto" onClick={onClose}>{t('common.close')}</button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <button
              className={`w-full px-3 py-2 rounded-md border transition text-left ${lang === 'en' ? 'bg-[hsl(var(--accent)/0.15)] border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]' : 'bg-gray-100 dark:bg-gray-900 border-transparent hover:bg-gray-200 dark:hover:bg-gray-800'}`}
              onClick={() => choose('en')}
            >
              English
            </button>
            <button
              className={`w-full px-3 py-2 rounded-md border transition text-left ${lang === 'ar' ? 'bg-[hsl(var(--accent)/0.15)] border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]' : 'bg-gray-100 dark:bg-gray-900 border-transparent hover:bg-gray-200 dark:hover:bg-gray-800'}`}
              onClick={() => choose('ar')}
            >
              العربية
            </button>
            <button
              className={`w-full px-3 py-2 rounded-md border transition text-left ${lang === 'ckb' ? 'bg-[hsl(var(--accent)/0.15)] border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]' : 'bg-gray-100 dark:bg-gray-900 border-transparent hover:bg-gray-200 dark:hover:bg-gray-800'}`}
              onClick={() => choose('ckb')}
            >
              کوردی (Sorani)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
