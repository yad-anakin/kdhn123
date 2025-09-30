"use client"

import { useTheme, AccentPreset } from './ThemeProvider'
import { useLanguage } from './LanguageProvider'

const OPTIONS: { key: AccentPreset; labelKey: string; swatch: string }[] = [
  { key: 'blue', labelKey: 'accent.blue', swatch: 'bg-blue-500' },
  { key: 'green', labelKey: 'accent.green', swatch: 'bg-green-500' },
  { key: 'purple', labelKey: 'accent.purple', swatch: 'bg-purple-500' },
  { key: 'rose', labelKey: 'accent.rose', swatch: 'bg-rose-500' },
  { key: 'orange', labelKey: 'accent.orange', swatch: 'bg-orange-500' },
]

export default function ColorPicker() {
  const { accent, setAccent } = useTheme()
  const { t } = useLanguage()
  return (
    <div className="flex items-center gap-2">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          className={`h-6 w-6 rounded-full ring-2 ${opt.swatch} ${
            accent === opt.key ? 'ring-accent' : 'ring-transparent'
          }`}
          title={t(opt.labelKey as any)}
          aria-label={`${t('accent.prefix')} ${t(opt.labelKey as any)}`}
          onClick={() => setAccent(opt.key)}
        />
      ))}
    </div>
  )
}
