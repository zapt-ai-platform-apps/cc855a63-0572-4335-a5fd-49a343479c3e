import React from 'react';
import { useSettings } from '../hooks/useSettings';

const ocrLanguages = [
  { code: 'eng', name: 'English' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'ita', name: 'Italian' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kor', name: 'Korean' },
  { code: 'por', name: 'Portuguese' },
  { code: 'rus', name: 'Russian' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'chi_tra', name: 'Chinese (Traditional)' }
];

const OcrSettings = () => {
  const { settings, updateSetting } = useSettings();
  
  return (
    <section>
      <h3 className="text-lg font-medium mb-3">Text Recognition Settings</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="ocrLanguage" className="block mb-2">
            OCR Language
          </label>
          <select
            id="ocrLanguage"
            value={settings.ocrLanguage}
            onChange={(e) => updateSetting('ocrLanguage', e.target.value)}
            className="select w-full"
          >
            {ocrLanguages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Select the language of text in the comic for better recognition.
          </p>
        </div>
        
        <div className="flex items-center">
          <label htmlFor="enhanceTextRecognition" className="flex-1">
            Enhance text for better recognition
          </label>
          <div className="toggle">
            <input
              id="enhanceTextRecognition"
              type="checkbox"
              className="toggle-input"
              checked={settings.enhanceTextRecognition}
              onChange={(e) => updateSetting('enhanceTextRecognition', e.target.checked)}
            />
            <div className="toggle-slider" />
          </div>
        </div>
        
        <div>
          <label htmlFor="ocrConfidenceThreshold" className="block mb-2">
            Confidence Threshold: {settings.ocrConfidenceThreshold}%
          </label>
          <input
            id="ocrConfidenceThreshold"
            type="range"
            min="0"
            max="100"
            value={settings.ocrConfidenceThreshold}
            onChange={(e) => updateSetting('ocrConfidenceThreshold', parseInt(e.target.value))}
            className="w-full"
          />
          <p className="mt-1 text-sm text-gray-500">
            Minimum confidence level for detected text (higher = more accurate but may miss text).
          </p>
        </div>
      </div>
    </section>
  );
};

export default OcrSettings;