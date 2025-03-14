import React from 'react';
import { useSettings } from '../hooks/useSettings';
import LanguageSelector from './LanguageSelector';
import TranslationProviderSelector from './TranslationProviderSelector';
import OcrSettings from './OcrSettings';
import DisplaySettings from './DisplaySettings';
import { FaUndo } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SettingsPanel = () => {
  const { settings, resetSettings } = useSettings();
  
  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      resetSettings();
      toast.success('Settings reset to defaults');
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Settings</h2>
        <button
          onClick={handleResetSettings}
          className="btn btn-secondary btn-sm flex items-center"
        >
          <FaUndo className="mr-1" /> Reset Defaults
        </button>
      </div>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-medium mb-3">Translation Settings</h3>
          <div className="space-y-4">
            <LanguageSelector />
            <TranslationProviderSelector />
            
            <div className="flex items-center">
              <label htmlFor="preserveFormatting" className="flex-1">Preserve text formatting</label>
              <div className="toggle">
                <input
                  id="preserveFormatting"
                  type="checkbox"
                  className="toggle-input"
                  checked={settings.preserveFormatting}
                  onChange={(e) => updateSetting('preserveFormatting', e.target.checked)}
                />
                <div className="toggle-slider" />
              </div>
            </div>
          </div>
        </section>
        
        <OcrSettings />
        <DisplaySettings />
        
        <section>
          <h3 className="text-lg font-medium mb-3">Extension Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <label htmlFor="activateOnClick" className="flex-1">Activate on right-click</label>
              <div className="toggle">
                <input
                  id="activateOnClick"
                  type="checkbox"
                  className="toggle-input"
                  checked={settings.activateOnClick}
                  onChange={(e) => updateSetting('activateOnClick', e.target.checked)}
                />
                <div className="toggle-slider" />
              </div>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="automaticTranslation" className="flex-1">Automatic translation</label>
              <div className="toggle">
                <input
                  id="automaticTranslation"
                  type="checkbox"
                  className="toggle-input"
                  checked={settings.automaticTranslation}
                  onChange={(e) => updateSetting('automaticTranslation', e.target.checked)}
                />
                <div className="toggle-slider" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPanel;