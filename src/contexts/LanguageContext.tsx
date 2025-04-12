import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
export type Language = 'en' | 'zh';

// Define language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem('language') as Language) || 'en'
  );
  
  // Store translations
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Import the translation file dynamically
        const translationModule = await import(`../translations/${language}.json`);
        setTranslations(translationModule.default);
        
        // Save language preference to localStorage
        localStorage.setItem('language', language);
        
        // Update document language for accessibility
        document.documentElement.lang = language;
        
        // Update document direction for RTL languages if needed
        // document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English if translation file not found
        if (language !== 'en') {
          setLanguageState('en');
        }
      }
    };

    loadTranslations();
  }, [language]);

  // Function to set language
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
