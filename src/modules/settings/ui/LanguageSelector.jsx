import React from 'react';
import { useSettings } from '../hooks/useSettings';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' }
];

const LanguageSelector = () => {
  const { settings, updateSetting } = useSettings();
  
  const handleChange = (e) => {
    updateSetting('targetLanguage', e.target.value);
  };
  
  return (
    <div className="mb-4">
      <label htmlFor="targetLanguage" className="block mb-2 font-medium">
        Target Language
      </label>
      <select
        id="targetLanguage"
        value={settings.targetLanguage}
        onChange={handleChange}
        className="select w-full"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
      <p className="mt-1 text-sm text-gray-500">
        Translated text will be converted to this language.
      </p>
    </div>
  );
};

export default LanguageSelector;