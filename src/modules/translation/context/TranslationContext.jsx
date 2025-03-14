import React, { createContext, useState, useEffect } from 'react';
import { GoogleTranslateService } from '../services/googleTranslateService';
import { DeepLTranslateService } from '../services/deepLTranslateService';
import { BrowserTranslateService } from '../services/browserTranslateService';
import { useSettings } from '@/modules/settings/hooks/useSettings';
import * as Sentry from '@sentry/browser';

export const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [translationService, setTranslationService] = useState(null);
  const { settings } = useSettings();
  
  // Initialize the translation service based on the selected provider
  useEffect(() => {
    const initializeService = async () => {
      try {
        switch (settings.translationProvider) {
          case 'google':
            setTranslationService(new GoogleTranslateService());
            break;
          case 'deepl':
            setTranslationService(new DeepLTranslateService());
            break;
          case 'browser':
          default:
            setTranslationService(new BrowserTranslateService());
            break;
        }
        
        console.log(`Initialized ${settings.translationProvider} translation service`);
      } catch (error) {
        console.error('Failed to initialize translation service:', error);
        Sentry.captureException(error);
        
        // Fall back to browser translation if API service fails
        setTranslationService(new BrowserTranslateService());
      }
    };

    initializeService();
  }, [settings.translationProvider]);

  return (
    <TranslationContext.Provider value={{ translationService }}>
      {children}
    </TranslationContext.Provider>
  );
};