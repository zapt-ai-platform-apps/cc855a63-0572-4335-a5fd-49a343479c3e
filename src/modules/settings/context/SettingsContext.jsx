import React, { createContext, useState, useEffect } from 'react';
import { eventBus, events } from '@/modules/core/events';

// Default settings
const defaultSettings = {
  // Translation settings
  targetLanguage: 'en',
  translationProvider: 'browser', // 'google', 'deepl', 'browser'
  preserveFormatting: true,
  
  // OCR settings
  ocrLanguage: 'eng',
  enhanceTextRecognition: true,
  ocrConfidenceThreshold: 60,
  
  // Display settings
  showOriginalText: false,
  fontFamily: 'Comic Sans MS, cursive, sans-serif',
  fontSize: 14,
  textColor: '#000000',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 4,
  overlayOpacity: 0.9,
  
  // Extension settings
  activateOnClick: true,
  automaticTranslation: true
};

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('comicTranslatorSettings');
    return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('comicTranslatorSettings', JSON.stringify(settings));
    eventBus.publish(events.SETTINGS_CHANGED, settings);
  }, [settings]);

  // Update a single setting
  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
    console.log(`Setting updated: ${key} = ${value}`);
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    console.log('Settings reset to defaults');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};