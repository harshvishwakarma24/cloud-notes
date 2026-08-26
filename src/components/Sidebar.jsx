import React from 'react';
import { 
  Home, 
  FileText, 
  LayoutGrid, 
  BookOpen, 
  Sparkles, 
  Search, 
  Calendar, 
  Trash2, 
  Settings, 
  HelpCircle, 
  Cloud, 
  X 
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  openSearchModal,
  profile,
  mobileOpen = false,
  setMobileOpen = () => {}
}) => {
  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const navItemClass = (tab) => `
    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
    ${activeTab === tab 
      ? 'bg-[#325240] text-[#f8f5ee] shadow-sm font-semibold' 
      : 'text-[#a3b8aa] hover:text-[#f8f5ee] hover:bg-[#254233]'
    }
  `;

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="p-4 flex flex-col gap-6 overflow-y-auto">
        {/* App Branding */}
        <div className="flex items-center justify-between px-2">
          <div 
            onClick={() => handleNavClick('splash')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-[#2a4d3a] border border-[#3d634d] flex items-center justify-center shadow-inner overflow-hidden group-hover:border-[#528265] transition-all">
              <Cloud className="w-5 h-5 text-[#dbe5ce]" />
            </div>
            <div>
              <h1 className="font-serif-title font-semibold text-lg text-[#f0f5ea] tracking-wide leading-none">Cloud Notes</h1>
              <p className="text-[11px] text-[#8ea896] mt-0.5">Mindful spaces</p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-[#a3b8aa] hover:text-[#f8f5ee] hover:bg-[#254233] lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1">
          <button 
            onClick={() => handleNavClick('home')}
            className={navItemClass('home')}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Home</span>
          </button>
          
          <button 
            onClick={() => handleNavClick('notes')}
            className={navItemClass('notes')}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Notes</span>
          </button>
        </nav>

        {/* Spaces Section */}
        <div className="flex flex-col gap-1">
          <div className="px-3 text-[11px] font-semibold text-[#6e8a78] uppercase tracking-wider mb-1">
            Spaces
          </div>
          <button 
            onClick={() => handleNavClick('spaces')}
            className={navItemClass('spaces')}
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span>Spaces</span>
          </button>
          <button 
            onClick={() => handleNavClick('journal')}
            className={navItemClass('journal')}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Journal</span>
          </button>
        </div>

        {/* Favorites Section */}
        <div className="flex flex-col gap-1">
          <div className="px-3 text-[11px] font-semibold text-[#6e8a78] uppercase tracking-wider mb-1">
            Favorites
          </div>
          <button 
            onClick={() => handleNavClick('ai-companion')}
            className={navItemClass('ai-companion')}
          >
            <Sparkles className="w-4 h-4 text-[#e2c275] shrink-0" />
            <span>AI Companion</span>
          </button>
          
          <button 
            onClick={() => {
              openSearchModal();
              setMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#a3b8aa] hover:text-[#f8f5ee] hover:bg-[#254233] transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>Search</span>
          </button>

          <button 
            onClick={() => handleNavClick('calendar')}
            className={navItemClass('calendar')}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Calendar</span>
          </button>

          <button 
            onClick={() => handleNavClick('trash')}
            className={navItemClass('trash')}
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>Trash</span>
          </button>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-[#264836] flex flex-col gap-1 bg-[#163325]">
        <button 
          onClick={() => handleNavClick('profile')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
            activeTab === 'profile' ? 'bg-[#325240] text-[#f8f5ee]' : 'text-[#a3b8aa] hover:text-[#f8f5ee] hover:bg-[#254233]'
          }`}
        >
          <img 
            src={profile.avatarUrl} 
            alt={profile.name} 
            className="w-6 h-6 rounded-full object-cover border border-[#487057] shrink-0"
          />
          <span className="truncate text-left text-xs font-medium">{profile.name}</span>
        </button>

        <button 
          onClick={() => handleNavClick('settings')}
          className={navItemClass('settings')}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </button>

        <button 
          onClick={() => handleNavClick('help')}
          className={navItemClass('help')}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>Help</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (lg and up) */}
      <aside className="hidden lg:flex w-60 bg-[#1b3b2b] text-[#e2ebd8] flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none border-r border-[#264836]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Below lg) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer container */}
          <aside className="relative w-72 max-w-[80vw] bg-[#1b3b2b] text-[#e2ebd8] flex flex-col justify-between h-full shadow-2xl z-10 border-r border-[#264836] animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
