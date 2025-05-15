'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { languages } from '../../lib/i18n';

export default function LanguageSwitcher({ currentLocale }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Get language names
  const languageNames = {
    'en': 'English',
    'tr': 'Türkçe',
    'ar': 'العربية',
    'es': 'Español',
    'ru': 'Русский'
  };
  
  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.language-switcher')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  // Change language handler
  const changeLanguage = (newLocale) => {
    // Get the path without the locale prefix
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    
    // Navigate to the same path but with new locale
    router.push(`/${newLocale}${pathWithoutLocale || ''}`);
    setIsOpen(false);
  };
  
  return (
    <div className="language-switcher relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm font-medium nav-link"
        aria-expanded={isOpen}
      >
        <span>{languageNames[currentLocale] || 'Language'}</span>
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-menu"
          >
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`${
                  lang === currentLocale
                    ? 'bg-gray-100 dark:bg-slate-700 text-red-500 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-300'
                } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700`}
                role="menuitem"
              >
                {languageNames[lang]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}