import * as Sentry from '@sentry/browser';

export class BrowserTranslateService {
  /**
   * Translates text using free translation APIs or mock service
   * This is a fallback service when no API keys are available
   * 
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<string>} - Translated text
   */
  async translate(text, targetLanguage) {
    if (!text.trim()) return '';
    
    try {
      // Try using the LibreTranslate API (free and open source)
      const endpoint = 'https://libretranslate.de/translate';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: text,
          source: 'auto',
          target: this.normalizeLanguageCode(targetLanguage)
        })
      });
      
      if (!response.ok) {
        throw new Error(`LibreTranslate API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error('LibreTranslate failed, using mock translation:', error);
      Sentry.captureException(error);
      
      // Fall back to a simple mock translation
      return this.mockTranslate(text, targetLanguage);
    }
  }
  
  /**
   * Provides a mocked translation when all else fails
   * 
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code
   * @returns {string} - Mocked translated text
   */
  mockTranslate(text, targetLanguage) {
    // In a real browser extension, we'd request permission to use the browser's
    // translation engine. For this demo, we'll return a simple placeholder.
    console.log(`Mock translating to ${targetLanguage}: "${text}"`);
    
    // Add a note that this is a simulated translation
    return `[${targetLanguage}] ${text} (simulated translation)`;
  }
  
  /**
   * Normalizes language codes to the format expected by LibreTranslate
   * 
   * @param {string} languageCode - Language code
   * @returns {string} - Normalized language code
   */
  normalizeLanguageCode(languageCode) {
    // LibreTranslate uses 2-letter codes
    const mainCode = languageCode.split('-')[0];
    
    // Map between common codes and LibreTranslate codes
    const mapping = {
      'zh': 'zh',
      'zh-CN': 'zh',
      'zh-TW': 'zh',
    };
    
    return mapping[languageCode] || mainCode;
  }
}