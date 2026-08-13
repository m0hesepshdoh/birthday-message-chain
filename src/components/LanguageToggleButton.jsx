import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';


export default function LanguageToggleButton() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      id="toggleLangBtn"
      title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      aria-label="Toggle between English and Arabic"
      onClick={toggleLanguage}
    >
      <span id="langToggleText">{lang === 'en' ? '🇵🇸' : '🌐'}</span>
    </button>
  );
}
