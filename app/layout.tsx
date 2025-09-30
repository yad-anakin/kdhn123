import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/components/LanguageProvider'

export const metadata: Metadata = {
  title: 'AI Chat Dashboard',
  description: 'Chat panel with collapsible menu and theming',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent light-mode flash: set dark class and --accent before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try {
  const mode = localStorage.getItem('theme-mode') || 'dark';
  const accent = localStorage.getItem('theme-accent') || 'normal';
  const lang = localStorage.getItem('lang') || 'en';
  const root = document.documentElement;
  if (mode === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  const ACCENTS = { blue: '221 83% 53%', green: '142 70% 45%', purple: '262 83% 58%', rose: '350 89% 60%', orange: '27 96% 61%' };
  const accentBg = accent === 'normal' ? (mode === 'dark' ? '0 0% 100%' : '0 0% 0%') : (ACCENTS[accent] || ACCENTS.blue);
  const accentFg = accent === 'normal' ? (mode === 'dark' ? '0 0% 0%' : '0 0% 100%') : '0 0% 100%';
  root.style.setProperty('--accent', accentBg);
  root.style.setProperty('--accent-foreground', accentFg);
  // Initialize language before hydration (no layout direction changes)
  root.setAttribute('lang', lang);
} catch (_) {} })();`,
          }}
        />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
      </head>
      <body>
        <LanguageProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
