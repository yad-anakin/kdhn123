"use client"

import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { mode, setMode } = useTheme()
  const toggle = () => setMode(mode === 'dark' ? 'light' : 'dark')
  return (
    <button className="btn" onClick={toggle} aria-label="Toggle theme">
      {mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
