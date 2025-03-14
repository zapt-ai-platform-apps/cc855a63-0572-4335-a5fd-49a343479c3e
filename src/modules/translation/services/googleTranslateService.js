import * as Sentry from '@sentry/browser';

export class GoogleTranslateService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
  }
  
  /**
   * Translates text using Google Translate API
   * 
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<string>} - Translated text
   */
  async translate(text, targetLanguage) {
    if (!text.trim()) return '';
    
    try {
      // If no API key is available, fall back to browser translation
      if (!this.apiKey) {
        console.warn('No Google Translate API key found. Falling back to browser translation.');
        return this.fallbackTranslate(text, targetLanguage);
      }
      
      const endpoint = 'https://translation.googleapis.com/language/translate/v2';
      const response = await fetch(`${endpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: this.normalizeLanguageCode(targetLanguage),
          format: 'text'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Google Translate API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Google translation failed:', error);
      Sentry.captureException(error);
      
      // Fall back to browser translation
      return this.fallbackTranslate(text, targetLanguage);
    }
  }
  
  /**
   * Fallback translation method using browser capabilities
   * 
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<string>} - Translated text
   */
  async fallbackTranslate(text, targetLanguage) {
    // Simple fallback - in real implementation, you might want to redirect to browser service
    return text;
  }
  
  /**
   * Normalizes language codes to Google's format
   * 
   * @param {string} languageCode - Language code
   * @returns {string} - Normalized language code
   */
  normalizeLanguageCode(languageCode) {
    // Map common language codes to Google's format if needed
    const mapping = {
      'zh': 'zh-CN',  // Default Chinese to Simplified
      'zh-CN': 'zh-CN',
      'zh-TW': 'zh-TW',
    };
    
    return mapping[languageCode] || languageCode;
  }
}