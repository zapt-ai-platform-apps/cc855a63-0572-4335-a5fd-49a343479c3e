export class EventBus {
  subscribers = {};

  subscribe(event, callback) {
    if (!this.subscribers[event]) this.subscribers[event] = [];
    this.subscribers[event].push(callback);
    return () => this.unsubscribe(event, callback);
  }

  publish(event, data) {
    if (!this.subscribers[event]) return;
    this.subscribers[event].forEach(callback => callback(data));
  }

  unsubscribe(event, callback) {
    if (!this.subscribers[event]) return;
    this.subscribers[event] = this.subscribers[event]
      .filter(cb => cb !== callback);
  }
}

export const eventBus = new EventBus();

export const events = {
  // OCR events
  OCR_STARTED: 'ocr/started',
  OCR_COMPLETED: 'ocr/completed',
  OCR_FAILED: 'ocr/failed',
  
  // Translation events
  TRANSLATION_STARTED: 'translation/started',
  TRANSLATION_COMPLETED: 'translation/completed',
  TRANSLATION_FAILED: 'translation/failed',
  
  // Settings events
  SETTINGS_CHANGED: 'settings/changed',
  
  // Image events
  IMAGE_LOADED: 'image/loaded',
  IMAGE_PROCESSED: 'image/processed',
  
  // Extension events
  EXTENSION_ACTIVATED: 'extension/activated'
};