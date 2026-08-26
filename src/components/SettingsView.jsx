import React, { useState } from 'react';
import { Sun, Moon, Cloud, ChevronDown, Check } from 'lucide-react';

export const SettingsView = ({
  settings,
  onUpdateSettings = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('Appearance');
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);

  const tabsList = ['General', 'Account', 'Appearance', 'Privacy', 'About'];
  const fontsList = ['Outfit', 'Inter', 'Roboto', 'Georgia'];

  const handleThemeChange = (theme) => {
    onUpdateSettings({ ...settings, theme });
  };

  const handleFontChange = (font) => {
    onUpdateSettings({ ...settings, font });
    setFontDropdownOpen(false);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-4xl mx-auto w-full space-y-6 sm:space-y-8">
      {/* Title Header */}
      <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#2c3830]">
        Settings
      </h2>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-4 sm:gap-6 border-b border-[#e5dcce] pb-2 text-xs font-medium text-[#738276] overflow-x-auto scrollbar-none">
        {tabsList.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 relative transition-colors shrink-0 cursor-pointer ${
              activeTab === tab ? 'text-[#1b3b2b] font-semibold' : 'hover:text-[#2c3830]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1b3b2b] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Appearance' ? (
        <div className="space-y-6 sm:space-y-8 max-w-xl">
          {/* Theme Selector */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#738276] block">
              Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Light Theme Card */}
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`p-3.5 sm:p-4 rounded-2xl border flex flex-row sm:flex-col items-center justify-between gap-3 h-auto sm:h-28 transition-all cursor-pointer ${
                  settings?.theme === 'light' 
                    ? 'bg-[#f8f5ee] border-[#1b3b2b] shadow-md ring-2 ring-[#1b3b2b]/20' 
                    : 'bg-[#f2ece0] border-[#e2d8be] hover:border-[#c8bd9f]'
                }`}
              >
                <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                  <div className="p-2 rounded-xl bg-[#eee5cf] text-[#1b3b2b]">
                    <Sun className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-[#2c3830]">Light</span>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  settings?.theme === 'light' ? 'border-[#1b3b2b] bg-[#1b3b2b]' : 'border-[#9aa89d]'
                }`}>
                  {settings?.theme === 'light' && <div className="w-1 h-1 bg-white rounded-full" />}
                </div>
              </button>

              {/* Dark Theme Card */}
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`p-3.5 sm:p-4 rounded-2xl border flex flex-row sm:flex-col items-center justify-between gap-3 h-auto sm:h-28 transition-all cursor-pointer ${
                  settings?.theme === 'dark' 
                    ? 'bg-[#18241d] border-[#1b3b2b] shadow-md ring-2 ring-[#1b3b2b]/20 text-white' 
                    : 'bg-[#202e26] border-[#2f4237] text-[#c5d8cc] hover:border-[#3d5648]'
                }`}
              >
                <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                  <div className="p-2 rounded-xl bg-[#28382f] text-[#d4e6db]">
                    <Moon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">Dark</span>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  settings?.theme === 'dark' ? 'border-[#e2c275] bg-[#e2c275]' : 'border-[#5e7868]'
                }`}>
                  {settings?.theme === 'dark' && <div className="w-1 h-1 bg-[#18241d] rounded-full" />}
                </div>
              </button>

              {/* System Theme Card */}
              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`p-3.5 sm:p-4 rounded-2xl border flex flex-row sm:flex-col items-center justify-between gap-3 h-auto sm:h-28 transition-all cursor-pointer ${
                  settings?.theme === 'system' 
                    ? 'bg-[#1b3b2b] border-[#2a543f] text-[#f8f5ee] shadow-md ring-2 ring-[#1b3b2b]/30' 
                    : 'bg-[#254836] border-[#2f5742] text-[#d0e0d6] hover:border-[#3b664f]'
                }`}
              >
                <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                  <div className="p-2 rounded-xl bg-[#284f3b] text-[#e2c275]">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">System</span>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  settings?.theme === 'system' ? 'border-[#e2c275] bg-[#e2c275]' : 'border-[#507a63]'
                }`}>
                  {settings?.theme === 'system' && <div className="w-1 h-1 bg-[#1b3b2b] rounded-full" />}
                </div>
              </button>
            </div>
          </div>

          {/* Paper Texture Toggle */}
          <div className="flex items-center justify-between py-3 border-t border-[#e5dcce]">
            <div>
              <span className="text-xs font-medium text-[#2c3830] block">Paper texture</span>
              <span className="text-[11px] text-[#738276]">Subtle tactile paper grain background</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, paperTexture: !settings?.paperTexture })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                settings?.paperTexture ? 'bg-[#1b3b2b]' : 'bg-[#d0c6ac]'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                settings?.paperTexture ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Soft Animations Toggle */}
          <div className="flex items-center justify-between py-3 border-t border-[#e5dcce]">
            <div>
              <span className="text-xs font-medium text-[#2c3830] block">Soft animations</span>
              <span className="text-[11px] text-[#738276]">Gentle transitions and meditative fades</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, softAnimations: !settings?.softAnimations })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                settings?.softAnimations ? 'bg-[#1b3b2b]' : 'bg-[#d0c6ac]'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                settings?.softAnimations ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Font Selection Dropdown */}
          <div className="space-y-3 pt-3 border-t border-[#e5dcce]">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#738276] block">
              Typography Font
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
                className="w-full bg-[#f2ece0] border border-[#e2d8be] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-[#2c3830] font-medium shadow-xs hover:border-[#c8bd9f] transition-all cursor-pointer"
              >
                <span>{settings?.font || 'Outfit'}</span>
                <ChevronDown className="w-4 h-4 text-[#738276]" />
              </button>

              {fontDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#f8f5ee] border border-[#e2d8be] rounded-xl shadow-xl z-20 overflow-hidden py-1">
                  {fontsList.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => handleFontChange(f)}
                      className={`w-full px-4 py-2.5 text-xs flex items-center justify-between hover:bg-[#eee7d8] transition-colors cursor-pointer ${
                        settings?.font === f ? 'font-semibold text-[#1b3b2b] bg-[#ede5d5]' : 'text-[#2c3830]'
                      }`}
                    >
                      <span>{f}</span>
                      {settings?.font === f && <Check className="w-3.5 h-3.5 text-[#1b3b2b]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Typography Live Preview */}
            <div className="bg-[#f2ece0] p-4 rounded-xl border border-[#e2d8be] space-y-1 mt-3">
              <p className={`text-xs text-[#2c3830] font-${(settings?.font || 'outfit').toLowerCase()}`}>
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className={`text-xs text-[#6e7d71] font-${(settings?.font || 'outfit').toLowerCase()}`}>
                “Clarity is the calm lake where ideas reflect true light.”
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-xs text-[#738276] bg-[#f2ece0] border border-[#e2d8be] rounded-2xl p-6">
          <p className="font-medium text-sm text-[#2c3830]">{activeTab} Preferences</p>
          <p className="mt-1">All {activeTab.toLowerCase()} parameters are synchronized with local Cloud Notes storage.</p>
        </div>
      )}
    </div>
  );
};
