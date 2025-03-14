import * as Sentry from '@sentry/browser';

export class DeepLTranslateService {
  constructor() {
    this.apiKey = import.meta.env.VITE_DEEPL_API_KEY;
  }
  
  /**
   * Translates text using DeepL API
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
        console.warn('No DeepL API key found. Falling back to browser translation.');
        return this.fallbackTranslate(text, targetLanguage);
      }
      
      const endpoint = 'https://api-free.deepl.com/v2/translate';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `DeepL-Auth-Key ${this.apiKey}`
        },
        body: new URLSearchParams({
          text: text,
          target_lang: this.normalizeLanguageCode(targetLanguage)
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepL API error: ${response.status} ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      return data.translations[0].text;
    } catch (error) {
      console.error('DeepL translation failed:', error);
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
    // In a real implementation, you might want to redirect to browser service
    return text;
  }
  
  /**
   * Normalizes language codes to DeepL's format
   * 
   * @param {string} languageCode - Language code
   * @returns {string} - Normalized language code
   */
  normalizeLanguageCode(languageCode) {
    // Map language codes to DeepL's format
    const mapping = {
      'en': 'EN-US',
      'es': 'ES',
      'fr': 'FR',
      'de': 'DE',
      'it': 'IT',
      'ja': 'JA',
      'ko': 'KO',
      'pt': 'PT-BR',
      'ru': 'RU',
      'zh': 'ZH',
      'zh-CN': 'ZH',
      'zh-TW': 'ZH'
    };
    
    return mapping[languageCode] || languageCode.toUpperCase();
  }
}