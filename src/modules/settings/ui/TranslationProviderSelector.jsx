import React from 'react';
import { useSettings } from '../hooks/useSettings';

const providers = [
  { value: 'browser', label: 'Browser (Built-in)' },
  { value: 'google', label: 'Google Translate' },
  { value: 'deepl', label: 'DeepL' }
];

const TranslationProviderSelector = () => {
  const { settings, updateSetting } = useSettings();
  
  const handleChange = (e) => {
    updateSetting('translationProvider', e.target.value);
  };
  
  return (
    <div className="mb-4">
      <label htmlFor="translationProvider" className="block mb-2 font-medium">
        Translation Provider
      </label>
      <select
        id="translationProvider"
        value={settings.translationProvider}
        onChange={handleChange}
        className="select w-full"
      >
        {providers.map((provider) => (
          <option key={provider.value} value={provider.value}>
            {provider.label}
          </option>
        ))}
      </select>
      <p className="mt-1 text-sm text-gray-500">
        {settings.translationProvider === 'browser' 
          ? 'Uses built-in translation that works offline.' 
          : 'External API requires an API key in settings.'}
      </p>
    </div>
  );
};

export default TranslationProviderSelector;