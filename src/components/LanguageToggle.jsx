import { useTranslation } from 'react-i18next'

const LanguageToggle = () => {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLang)
    document.body.dir = newLang === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 border-2 border-neon-teal/30 rounded-full text-neon-teal hover:border-neon-teal transition-all"
    >
      {i18n.language === 'en' ? 'العربية' : 'English'}
    </button>
  )
}

export default LanguageToggle