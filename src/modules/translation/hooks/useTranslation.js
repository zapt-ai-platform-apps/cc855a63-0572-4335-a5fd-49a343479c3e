import { useState, useCallback, useContext } from 'react';
import { TranslationContext } from '../context/TranslationContext';
import { eventBus, events } from '@/modules/core/events';
import * as Sentry from '@sentry/browser';

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const { translationService } = useContext(TranslationContext);
  
  const translateText = useCallback(async (text, targetLanguage) => {
    if (!text.trim()) return '';
    
    setIsTranslating(true);
    eventBus.publish(events.TRANSLATION_STARTED, { text, targetLanguage });
    
    try {
      console.log(`Translating to ${targetLanguage}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
      
      const translatedText = await translationService.translate(text, targetLanguage);
      
      console.log(`Translation result: "${translatedText.substring(0, 50)}${translatedText.length > 50 ? '...' : ''}"`);
      eventBus.publish(events.TRANSLATION_COMPLETED, { originalText: text, translatedText, targetLanguage });
      
      setIsTranslating(false);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      Sentry.captureException(error);
      eventBus.publish(events.TRANSLATION_FAILED, { error, text, targetLanguage });
      
      setIsTranslating(false);
      throw error;
    }
  }, [translationService]);

  return {
    translateText,
    isTranslating
  };
};