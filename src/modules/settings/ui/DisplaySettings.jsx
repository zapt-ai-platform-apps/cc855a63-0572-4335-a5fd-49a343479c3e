import React from 'react';
import { useSettings } from '../hooks/useSettings';

const fontFamilies = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Comic Sans MS, cursive, sans-serif', label: 'Comic Sans' },
  { value: 'Impact, sans-serif', label: 'Impact' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Courier New, monospace', label: 'Courier New' }
];

const DisplaySettings = () => {
  const { settings, updateSetting } = useSettings();
  
  return (
    <section>
      <h3 className="text-lg font-medium mb-3">Display Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <label htmlFor="showOriginalText" className="flex-1">
            Show original text alongside translation
          </label>
          <div className="toggle">
            <input
              id="showOriginalText"
              type="checkbox"
              className="toggle-input"
              checked={settings.showOriginalText}
              onChange={(e) => updateSetting('showOriginalText', e.target.checked)}
            />
            <div className="toggle-slider" />
          </div>
        </div>
        
        <div>
          <label htmlFor="fontFamily" className="block mb-2">
            Font Style
          </label>
          <select
            id="fontFamily"
            value={settings.fontFamily}
            onChange={(e) => updateSetting('fontFamily', e.target.value)}
            className="select w-full"
            style={{ fontFamily: settings.fontFamily }}
          >
            {fontFamilies.map((font) => (
              <option 
                key={font.value} 
                value={font.value}
                style={{ fontFamily: font.value }}
              >
                {font.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="fontSize" className="block mb-2">
            Font Size: {settings.fontSize}px
          </label>
          <input
            id="fontSize"
            type="range"
            min="8"
            max="24"
            value={settings.fontSize}
            onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="textColor" className="block mb-2">
            Text Color
          </label>
          <div className="flex items-center">
            <input
              id="textColor"
              type="color"
              value={settings.textColor}
              onChange={(e) => updateSetting('textColor', e.target.value)}
              className="mr-2 cursor-pointer"
            />
            <span className="text-sm">{settings.textColor}</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="overlayOpacity" className="block mb-2">
            Background Opacity: {Math.round(settings.overlayOpacity * 100)}%
          </label>
          <input
            id="overlayOpacity"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.overlayOpacity}
            onChange={(e) => updateSetting('overlayOpacity', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="borderRadius" className="block mb-2">
            Border Radius: {settings.borderRadius}px
          </label>
          <input
            id="borderRadius"
            type="range"
            min="0"
            max="20"
            value={settings.borderRadius}
            onChange={(e) => updateSetting('borderRadius', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <div 
            className="p-3 rounded"
            style={{
              fontFamily: settings.fontFamily,
              fontSize: `${settings.fontSize}px`,
              color: settings.textColor,
              backgroundColor: `rgba(255, 255, 255, ${settings.overlayOpacity})`,
              borderRadius: `${settings.borderRadius}px`,
              border: '1px solid #e5e7eb'
            }}
          >
            This is how translated text will appear.
            {settings.showOriginalText && (
              <div className="mt-1 text-xs opacity-75">
                (Original text will appear here)
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DisplaySettings;