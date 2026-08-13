import React, { createContext, useContext, useEffect, useState } from 'react';


const LanguageContext = createContext(null);

function getInitialLang() {
  const stored = localStorage.getItem('selectedLanguage');
  if (stored) return stored;
  const browserIsArabic =
    typeof navigator !== 'undefined' &&
    navigator.language &&
    navigator.language.startsWith('ar');
  return browserIsArabic ? 'ar' : 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    const isRTL = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    localStorage.setItem('selectedLanguage', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const value = { lang, isRTL: lang === 'ar', setLang, toggleLanguage };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
