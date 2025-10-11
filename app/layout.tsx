import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/components/LanguageProvider'

export const metadata: Metadata = {
  title: 'KDHN AI',
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        {/* Font Awesome (CDN) for sidebar icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* App-like behavior on mobile */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
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
        {/* Prevent zoom interactions (desktop and mobile) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try {
  // Block Ctrl/⌘ + mousewheel pinch zoom
  window.addEventListener('wheel', (e) => { if (e.ctrlKey) { e.preventDefault(); } }, { passive: false });
  // Block keyboard zoom shortcuts
  window.addEventListener('keydown', (e) => {
    const key = e.key;
    if ((e.ctrlKey || e.metaKey) && (key === '+' || key === '-' || key === '=' || key === '0')) {
      e.preventDefault();
    }
  }, { passive: false });
  // iOS Safari pinch-zoom gestures
  window.addEventListener('gesturestart', (e) => e.preventDefault());
  window.addEventListener('gesturechange', (e) => e.preventDefault());
  window.addEventListener('gestureend', (e) => e.preventDefault());
  // Block pinch by preventing multi-touch moves
  let multiTouch = false;
  window.addEventListener('touchstart', (e) => {
    multiTouch = e.touches && e.touches.length > 1;
    if (multiTouch) e.preventDefault();
  }, { passive: false, capture: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false, capture: true });
  // Prevent double-tap to zoom
  let lastTouch = 0;
  window.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouch < 350) { e.preventDefault(); }
    lastTouch = now;
  }, { passive: false });
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
