import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const SettingsView = ({
  settings,
  onUpdateSettings = () => {},
  isDarkTheme = false
}) => {
  const [activeTab, setActiveTab] = useState('Appearance');

  const tabsList = ['Appearance', 'Privacy', 'About'];

  const handleThemeChange = (theme) => {
    onUpdateSettings({
      ...settings,
      theme
    });
  };

  const handlePaperTextureChange = () => {
    onUpdateSettings({
      ...settings,
      paperTexture: !settings?.paperTexture
    });
  };

  const handleSoftAnimationsChange = () => {
    onUpdateSettings({
      ...settings,
      softAnimations: !settings?.softAnimations
    });
  };

  return (
    <div className="flex-1 h-full overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">

        {/* Header */}
        <div className="max-w-2xl mx-auto">
          <h2 className={`font-serif-title text-3xl sm:text-4xl font-bold ${
            isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'
          }`}>
            Settings
          </h2>

          {/* Tabs */}
          <div className={`mt-6 sm:mt-8 flex items-center gap-5 sm:gap-7 border-b overflow-x-auto scrollbar-none ${
            isDarkTheme ? 'border-[#344239]' : 'border-[#e5dcce]'
          }`}>
            {tabsList.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative shrink-0 pb-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab
                    ? (isDarkTheme ? 'text-[#6f9b7f] font-semibold' : 'text-[#1b3b2b] font-semibold')
                    : (isDarkTheme ? 'text-[#829087] hover:text-[#e7e1d5]' : 'text-[#738276] hover:text-[#2c3830]')
                }`}
              >
                {tab}

                {activeTab === tab && (
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                    isDarkTheme ? 'bg-[#6f9b7f]' : 'bg-[#1b3b2b]'
                  }`} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* =====================================================
            APPEARANCE
        ===================================================== */}

        {activeTab === 'Appearance' && (
          <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-10 space-y-7 sm:space-y-9">

            {/* Theme */}
            <section className="space-y-3 sm:space-y-4">
              <label className={`text-xs font-semibold uppercase tracking-wider block ${
                isDarkTheme ? 'text-[#829087]' : 'text-[#738276]'
              }`}>
                Theme
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

                {/* Light Theme Card */}
                <button
                  type="button"
                  onClick={() => handleThemeChange('light')}
                  className={`min-h-[112px] sm:min-h-[128px] p-4 sm:p-5 rounded-2xl border flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 transition-all cursor-pointer ${
                    settings?.theme === 'light'
                      ? 'bg-[#f8f5ee] border-[#1b3b2b] shadow-md ring-2 ring-[#1b3b2b]/20 text-[#2c3830]'
                      : 'bg-[#f2ece0] border-[#e2d8be] hover:border-[#c8bd9f] text-[#526156]'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                    <div className="p-2.5 rounded-xl bg-[#eee5cf] text-[#1b3b2b]">
                      <Sun className="w-5 h-5" />
                    </div>

                    <span className="text-sm font-medium text-[#2c3830]">
                      Light
                    </span>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      settings?.theme === 'light'
                        ? 'border-[#1b3b2b] bg-[#1b3b2b]'
                        : 'border-[#9aa89d]'
                    }`}
                  >
                    {settings?.theme === 'light' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                </button>

                {/* Dark / Night Paper Theme Card */}
                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`min-h-[112px] sm:min-h-[128px] p-4 sm:p-5 rounded-2xl border flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 transition-all cursor-pointer ${
                    settings?.theme === 'dark'
                      ? 'bg-[#18201b] border-[#6f9b7f] shadow-md ring-2 ring-[#6f9b7f]/20 text-[#e7e1d5]'
                      : 'bg-[#202c25] border-[#344239] text-[#aeb8ae] hover:border-[#405247]'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                    <div className="p-2.5 rounded-xl bg-[#26332b] text-[#6f9b7f]">
                      <Moon className="w-5 h-5" />
                    </div>

                    <span className="text-sm font-medium">
                      Night Paper
                    </span>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      settings?.theme === 'dark'
                        ? 'border-[#6f9b7f] bg-[#6f9b7f]'
                        : 'border-[#405247]'
                    }`}
                  >
                    {settings?.theme === 'dark' && (
                      <div className="w-1.5 h-1.5 bg-[#18201b] rounded-full" />
                    )}
                  </div>
                </button>

              </div>
            </section>

            {/* Paper Texture */}
            <section className={`border-t pt-6 sm:pt-7 ${isDarkTheme ? 'border-[#344239]' : 'border-[#e5dcce]'}`}>
              <div className="flex items-center justify-between gap-6">
                <div className="min-w-0">
                  <span className={`text-sm font-medium block ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
                    Paper texture
                  </span>

                  <span className={`mt-1 text-xs block ${isDarkTheme ? 'text-[#829087]' : 'text-[#738276]'}`}>
                    Subtle tactile paper grain background
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePaperTextureChange}
                  aria-label="Toggle paper texture"
                  aria-pressed={settings?.paperTexture}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                    settings?.paperTexture
                      ? (isDarkTheme ? 'bg-[#6f9b7f]' : 'bg-[#1b3b2b]')
                      : (isDarkTheme ? 'bg-[#344239]' : 'bg-[#d0c6ac]')
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      settings?.paperTexture
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* Soft Animations */}
            <section className={`border-t pt-6 sm:pt-7 ${isDarkTheme ? 'border-[#344239]' : 'border-[#e5dcce]'}`}>
              <div className="flex items-center justify-between gap-6">
                <div className="min-w-0">
                  <span className={`text-sm font-medium block ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
                    Soft animations
                  </span>

                  <span className={`mt-1 text-xs block ${isDarkTheme ? 'text-[#829087]' : 'text-[#738276]'}`}>
                    Gentle transitions and meditative fades
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSoftAnimationsChange}
                  aria-label="Toggle soft animations"
                  aria-pressed={settings?.softAnimations}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                    settings?.softAnimations
                      ? (isDarkTheme ? 'bg-[#6f9b7f]' : 'bg-[#1b3b2b]')
                      : (isDarkTheme ? 'bg-[#344239]' : 'bg-[#d0c6ac]')
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      settings?.softAnimations
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </section>

          </div>
        )}

        {/* =====================================================
            PRIVACY
        ===================================================== */}

        {activeTab === 'Privacy' && (
          <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-10">
            <div className={`py-12 sm:py-16 text-center text-xs border rounded-2xl px-5 sm:px-8 ${
              isDarkTheme ? 'bg-[#1b251f] border-[#344239] text-[#aeb8ae]' : 'bg-[#f2ece0] border-[#e2d8be] text-[#738276]'
            }`}>
              <p className={`font-medium text-sm ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
                Privacy
              </p>

              <p className="mt-2 leading-relaxed">
                Your notes and personal information are protected
                by your account and database security.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            ABOUT
        ===================================================== */}

        {activeTab === 'About' && (
          <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-10">
            <div className={`py-12 sm:py-16 text-center text-xs border rounded-2xl px-5 sm:px-8 ${
              isDarkTheme ? 'bg-[#1b251f] border-[#344239] text-[#aeb8ae]' : 'bg-[#f2ece0] border-[#e2d8be] text-[#738276]'
            }`}>
              <p className={`font-medium text-sm ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
                About Cloud Notes
              </p>

              <p className="mt-2 leading-relaxed">
                A calm and simple space for writing, organizing,
                and keeping your notes in the cloud.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};