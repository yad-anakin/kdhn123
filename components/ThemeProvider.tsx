"use client"

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ThemeMode = 'light' | 'dark'
export type AccentPreset = 'normal' | 'blue' | 'green' | 'purple' | 'rose' | 'orange'

type ThemeContextType = {
  mode: ThemeMode
  setMode: (m: ThemeMode) => void
  accent: AccentPreset
  setAccent: (a: AccentPreset) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const ACCENTS: Partial<Record<Exclude<AccentPreset, 'normal'>, string>> = {
  blue: '221 83% 53%',
  green: '142 70% 45%',
  purple: '262 83% 58%',
  rose: '350 89% 60%',
  orange: '27 96% 61%',
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark')
  const [accent, setAccentState] = useState<AccentPreset>('normal')

  useEffect(() => {
    const storedMode = (localStorage.getItem('theme-mode') as ThemeMode) || 'dark'
    const storedAccent = (localStorage.getItem('theme-accent') as AccentPreset) || 'normal'
    setModeState(storedMode)
    setAccentState(storedAccent)
  }, [])

  // Helper to compute and set the CSS variable based on current accent and mode
  function applyAccentVar(currentAccent: AccentPreset, currentMode: ThemeMode) {
    const root = document.documentElement
    if (currentAccent === 'normal') {
      // Black in light, white in dark
      const bg = currentMode === 'dark' ? '0 0% 100%' : '0 0% 0%'
      const fg = currentMode === 'dark' ? '0 0% 0%' : '0 0% 100%'
      root.style.setProperty('--accent', bg)
      root.style.setProperty('--accent-foreground', fg)
    } else {
      root.style.setProperty('--accent', ACCENTS[currentAccent]!)
      // Use white foreground by default for colored accents for contrast
      root.style.setProperty('--accent-foreground', '0 0% 100%')
    }
  }

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    localStorage.setItem('theme-mode', mode)
    // Re-apply accent when mode changes if accent is 'normal'
    applyAccentVar(accent, mode)
  }, [mode])

  useEffect(() => {
    applyAccentVar(accent, mode)
    localStorage.setItem('theme-accent', accent)
  }, [accent, mode])

  const value = useMemo(
    () => ({ mode, setMode: setModeState, accent, setAccent: setAccentState }),
    [mode, accent]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
