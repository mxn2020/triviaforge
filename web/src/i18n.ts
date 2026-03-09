// i18n configuration for TriviaForge
const translations = {
    en: { appName: 'TriviaForge', description: 'Generates interactive trivia quizzes on any topic' },
    de: { appName: 'TriviaForge', description: 'Generates interactive trivia quizzes on any topic (DE)' },
} as const

export type Locale = keyof typeof translations
export const defaultLocale: Locale = 'en'
export const supportedLocales = Object.keys(translations) as Locale[]

export function t(key: keyof typeof translations.en, locale: Locale = defaultLocale): string {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
}

export default translations
