export const languages = ['en', 'tr', 'ar', 'es', 'ru'];
export const defaultLanguage = 'en';

export function getDefaultLanguage() {
  return defaultLanguage;
}

export function getTranslation(translations, languageId) {
  return translations.find((translation) => translation.language_id === languageId) || null;
}

export function getLanguageName(languageId) {
  const languageMap = {
    1: 'Türkçe',
    2: 'English',
    3: 'العربية',
    4: 'Español',
    5: 'Русский'
  };
  
  return languageMap[languageId] || 'Unknown';
}

export function getLanguageCodeById(languageId) {
  const codeMap = {
    1: 'tr',
    2: 'en',
    3: 'ar',
    4: 'es',
    5: 'ru'
  };
  
  return codeMap[languageId] || 'en';
}

export function getLanguageIdByCode(code) {
  const idMap = {
    'tr': 1,
    'en': 2,
    'ar': 3,
    'es': 4,
    'ru': 5
  };
  
  return idMap[code] || 2; // Default to English
}