"use client"

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type LangCode = 'en' | 'ar' | 'ckb'

// We intentionally avoid changing layout direction; translations only.

type I18nDict = Record<string, Record<LangCode, string>>

const translations: I18nDict = {
  // Sidebar groups
  'sidebar.group.medical': {
    en: 'Medical Info',
    ar: 'المعلومات الطبية',
    ckb: 'زانیاری پزیشکی',
  },
  'sidebar.group.calc': {
    en: 'Calculation',
    ar: 'الحسابات',
    ckb: 'ژمێریار',
  },
  'sidebar.group.study': {
    en: 'Study',
    ar: 'الدراسة',
    ckb: 'خوێندن',
  },
  // Sidebar agents
  'sidebar.agent.detailed': {
    en: 'Detailed Response',
    ar: 'إجابة مفصلة',
    ckb: 'وەڵامی ورد',
  },
  'sidebar.agent.fast': {
    en: 'Fast Response',
    ar: 'إجابة سريعة',
    ckb: 'وەڵامی خێرا',
  },
  'sidebar.agent.drug': {
    en: 'Drug Calculator',
    ar: 'حاسبة الأدوية',
    ckb: 'ژمێریاری دەرمان',
  },
  'sidebar.agent.pediatric': {
    en: 'Pediatric Drug Calculator',
    ar: 'حاسبة أدوية الأطفال',
    ckb: 'دەرمانی منداڵان',
  },
  'sidebar.agent.neonatal': {
    en: 'Neonatal Drug Calculator',
    ar: 'حاسبة أدوية حديثي الولادة',
    ckb: 'منداڵی تازە لەدایکبوو',
  },
  'sidebar.agent.study': {
    en: 'Study Assistant',
    ar: 'مساعد الدراسة',
    ckb: 'یارمەتیدەری خوێندن',
  },
  'sidebar.general': {
    en: 'General Medical Info',
    ar: 'معلومات طبية عامة',
    ckb: 'زانیاری گشتیی پزیشکی',
  },
  'sidebar.fast': {
    en: 'Fast Info',
    ar: 'معلومات سريعة',
    ckb: 'زانیاری خێرا',
  },
  'sidebar.color': {
    en: 'Color & Mode',
    ar: 'الألوان والوضع',
    ckb: 'ڕەنگ و دۆخەکان',
  },
  'sidebar.languages': {
    en: 'Languages',
    ar: 'اللغات',
    ckb: 'زمانەکان',
  },
  'sidebar.close': {
    en: 'Close sidebar',
    ar: 'إغلاق القائمة',
    ckb: 'داخستنەوە',
  },
  'sidebar.close_title': {
    en: 'Close',
    ar: 'إغلاق',
    ckb: 'داخستن',
  },
  'welcome.title': {
    en: 'Welcome to KDHN',
    ar: ' KDHN مرحباً بك في',
    ckb: 'KDHN بەخێربێیت بۆ',
  },
  'welcome.subtitle': {
    en: 'First AI‑powered medical platform in Kurdistan',
    ar: 'أول منصة طبية مدعومة بالذكاء الاصطناعي في كردستان',
    ckb: 'لە کوردستان AI یەکەم پلاتفۆڕمی پزیشکی بەهاوکاری',
  },
  'welcome.hint': {
    en: 'Start by asking a question about symptoms, medications, or general health.',
    ar: '.ابدأ بطرح سؤال حول الأعراض أو الأدوية أو الصحة العامة',
    ckb: '.دەست بکە بە پرسیارکردن دەربارەی نەخۆشی، دەرمان یان تەندروستی گشتی',
  },
  // Agent-specific welcome hints
  'welcome.hint.agent1': {
    en: 'Ask detailed medical questions about symptoms, conditions, and treatments.',
    ar: '.اطرح أسئلة طبية مفصلة عن الأعراض والحالات والعلاجات',
    ckb: '.پرسیاری ورد بکە دەربارەی نیشانەکان، دۆخی پزیشکیت و چارەسەرەکانی',
  },
  'welcome.hint.agent2': {
    en: 'Ask quick medical questions for concise, to‑the‑point answers.',
    ar: '.اطرح أسئلة طبية سريعة للحصول على إجابات مختصرة ومباشرة',
    ckb: '.پرسیاری خێرا بکە بۆ وەڵامی کورت و پوخت',
  },
  'welcome.hint.drug': {
    en: 'Provide patient info (age, weight, renal function) to calculate safe drug doses.',
    ar: '.قدّم معلومات المريض (العمر، الوزن، وظائف الكلى) لحساب جرعات آمنة',
    ckb: '.زانیاری بدە لەسەر نەخۆشەکە لەبارەی (تەمەن، کێش، کارکردنی گورچیلەکانی) بۆ ڕێکخستنی دۆزی دەرمان',
  },
  'welcome.hint.pediatric': {
    en: 'Enter child age, weight, and indication to compute pediatric dosing.',
    ar: '.أدخل عمر الطفل ووزنه والدلالة العلاجية لحساب جرعات الأطفال',
    ckb: '.تەمەنی منداڵەکە، کێش و ئیشی دەرمانەکە بنووسە بۆ ئەژمێرکردنی دۆزەکە',
  },
  'welcome.hint.neonatal': {
    en: 'Provide GA, postnatal age, and weight to calculate neonatal dosing.',
    ar: '.قدّم عمر الحمل، العمر بعد الولادة، والوزن لحساب جرعات حديثي الولادة',
    ckb: '.ماوەی جێستەیشنەڵ، تەمەنی دوای لەدایکبوون، کێش بنووسە بۆ ئەژمێرکردنی دۆزەکە',
  },
  'welcome.hint.study': {
    en: 'Ask to learn medical topics with summaries, mnemonics, and practice questions.',
    ar: '.اطلب تعلّم مواضيع طبية مع ملخصات ووسائل حفظ وأسئلة تدريبية',
    ckb: '.پرسیار بکە بۆ فێربوونی بابەتە پزیشکییەکان، کورتکردنەوەیان و یارمەتیدان لە بیرخستنەوەیان ',
  },
  // Theme modal
  'theme.choose_title': {
    en: 'Choose color & mode',
    ar: 'اختر اللون والوضع',
    ckb: 'ڕەنگ و دۆخ هەڵبژێرە',
  },
  'theme.close_modal': {
    en: 'Close theme modal',
    ar: 'إغلاق نافذة السمة',
    ckb: 'داخستنی پەنجەرەی ڕووکار',
  },
  'common.close': {
    en: 'Close',
    ar: 'إغلاق',
    ckb: 'داخستن',
  },
  'theme.light': {
    en: 'Light',
    ar: 'فاتح',
    ckb: 'کاڵ',
  },
  'theme.dark': {
    en: 'Dark',
    ar: 'داكن',
    ckb: 'تۆخ',
  },
  // Accent/color labels
  'accent.normal': { en: 'Normal', ar: 'عادي', ckb: 'ئاسایی' },
  'accent.blue': { en: 'Blue', ar: 'أزرق', ckb: 'شین' },
  'accent.green': { en: 'Green', ar: 'أخضر', ckb: 'سەوز' },
  'accent.purple': { en: 'Purple', ar: 'أرجواني', ckb: 'مۆر' },
  'accent.rose': { en: 'Rose', ar: 'وردي', ckb: 'پەمەیی' },
  'accent.orange': { en: 'Orange', ar: 'برتقالي', ckb: 'پرتەقاڵی' },
  'accent.prefix': { en: 'Accent', ar: 'لون', ckb: 'ڕەنگ' },
  // Aria helpers
  'aria.use': { en: 'Use', ar: 'استخدم', ckb: 'بەکاربهێنە' },
  'aria.in_light': { en: 'in Light mode', ar: 'في الوضع الفاتح', ckb: 'لە دۆخی کاڵدا' },
  'aria.in_dark': { en: 'in Dark mode', ar: 'في الوضع الداكن', ckb: 'لە دۆخی تۆخدا' },
  'input.placeholder': {
    en: 'Ask anything',
    ar: 'اسأل أي شيء',
    ckb: 'هەر شتێک بپرسە',
  },
  'send.aria': {
    en: 'Send',
    ar: 'إرسال',
    ckb: 'ناردن',
  },
  'img.loading': {
    en: 'Loading',
    ar: 'جار التحميل',
    ckb: 'بار دەکرێت',
  },
  // Loading steps (shown next to spinner)
  'loading.step.1': {
    en: 'Receiving your question',
    ar: 'جارٍ استلام سؤالك',
    ckb: 'پرسیارەکەت وەرگیرا',
  },
  'loading.step.2': {
    en: 'Analyzing context',
    ar: 'جارٍ تحليل السياق',
    ckb: 'تێگەیشتن لە ناوەڕۆک',
  },
  'loading.step.3': {
    en: 'Preparing your answer',
    ar: 'جارٍ تجهيز الإجابة',
    ckb: 'ئامادەکردنی وەڵام',
  },
  'loading.step.4': {
    en: 'Finalizing',
    ar: 'جارٍ الإنهاء',
    ckb: 'تەواوکردن',
  },
  'error.reply': {
    en: 'Sorry, I had trouble responding. Please try again.',
    ar: 'عذراً، حدثت مشكلة في الرد. حاول مرة أخرى.',
    ckb: 'ببورە، کێشەیەک ڕوویدا لەوەی وەڵام بدرێتەوە. تکایە دووبارە هەوڵ بدە.',
  },
  // Social
  'social.instagram': {
    en: 'Instagram',
    ar: 'إنستغرام',
    ckb: 'ئینستاگرام',
  },
}

type LanguageContextType = {
  lang: LangCode
  setLang: (l: LangCode) => void
  t: (key: keyof typeof translations) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en')

  // Read initial language
  useEffect(() => {
    try {
      const stored = (localStorage.getItem('lang') as LangCode) || 'en'
      setLangState(stored)
    } catch {}
  }, [])

  // Apply html lang/dir when language changes
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('lang', lang)
    try {
      localStorage.setItem('lang', lang)
    } catch {}
  }, [lang])

  const t = (key: keyof typeof translations) => translations[key]?.[lang] ?? translations[key]?.en ?? String(key)

  const value = useMemo(() => ({ lang, setLang: setLangState, t }), [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
