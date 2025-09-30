"use client"

import { useTheme, AccentPreset } from './ThemeProvider'
import { useLanguage } from './LanguageProvider'

const ACCENTS: { key: AccentPreset; labelKey: string; swatch: string }[] = [
  { key: 'normal', labelKey: 'accent.normal', swatch: 'bg-gray-800' },
  { key: 'blue', labelKey: 'accent.blue', swatch: 'bg-blue-500' },
  { key: 'green', labelKey: 'accent.green', swatch: 'bg-green-500' },
  { key: 'purple', labelKey: 'accent.purple', swatch: 'bg-purple-500' },
  { key: 'rose', labelKey: 'accent.rose', swatch: 'bg-rose-500' },
  { key: 'orange', labelKey: 'accent.orange', swatch: 'bg-orange-500' },
]

export default function ThemeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setMode, setAccent } = useTheme()
  const { t } = useLanguage()

  function choose(a: AccentPreset, mode: 'light' | 'dark') {
    setAccent(a)
    setMode(mode)
    onClose()
  }

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
    >
      {/* Overlay */}
      <button
        aria-label={t('theme.close_modal')}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`absolute left-1/2 top-1/2 w-[min(92vw,640px)] -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="card p-4">
          <div className="flex items-center">
            <h2 className="text-base font-semibold">{t('theme.choose_title')}</h2>
            <button className="btn ml-auto" onClick={onClose}>{t('common.close')}</button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACCENTS.map((a) => (
              <div key={a.key} className="rounded-md overflow-hidden">
                <div className="px-3 py-2 flex items-center gap-2 bg-gray-50 dark:bg-gray-900">
                  <span className={`h-3 w-3 rounded-full ${a.swatch}`} />
                  <span className="text-sm font-medium">{t(a.labelKey as any)}</span>
                </div>
                <div className="grid grid-cols-2">
                  {/* Light preview */}
                  <button
                    className="p-3 text-left hover:bg-gray-50 focus:outline-none rounded-md border border-transparent hover:border-gray-300 dark:hover:border-gray-700"
                    onClick={() => choose(a.key, 'light')}
                    aria-label={`${t('aria.use')} ${t(a.labelKey as any)} ${t('aria.in_light')}`}
                  >
                    <div className="text-xs text-gray-500">{t('theme.light')}</div>
                    <div className="mt-2 rounded-md bg-white p-2">
                      {a.key === 'normal' ? (
                        <div className="h-2 w-12 rounded" style={{ backgroundColor: 'hsl(0 0% 0%)' }} />
                      ) : (
                        <div className={`h-2 w-12 rounded ${a.swatch}`} />
                      )}
                    </div>
                  </button>
                  {/* Dark preview */}
                  <button
                    className="group p-3 text-left hover:bg-gray-900/40 focus:outline-none rounded-md border border-transparent hover:border-gray-300 dark:hover:border-gray-700"
                    onClick={() => choose(a.key, 'dark')}
                    aria-label={`${t('aria.use')} ${t(a.labelKey as any)} ${t('aria.in_dark')}`}
                  >
                    <div className="text-xs text-gray-400 group-hover:text-white">{t('theme.dark')}</div>
                    <div className="mt-2 rounded-md bg-gray-900 p-2">
                      {a.key === 'normal' ? (
                        <div className="h-2 w-12 rounded" style={{ backgroundColor: 'hsl(0 0% 100%)' }} />
                      ) : (
                        <div className={`h-2 w-12 rounded ${a.swatch}`} />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
