import React, { useEffect } from 'react';
import { 
  Home, 
  FileText, 
  Star, 
  Pin, 
  Archive, 
  Trash2, 
  Settings, 
  Cloud, 
  X,
  Search
} from 'lucide-react';

export const Sidebar = ({
  isOpen = true,
  onClose = () => {},
  activeTab,
  setActiveTab,
  openSearchModal = () => {},
  profile = {},
  isDarkTheme = false
}) => {
  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    // On small/touch screens, close the drawer after selection
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleSearchClick = () => {
    openSearchModal();
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
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
      {/* Top & Navigation Section */}
      <div className="p-4 flex flex-col gap-6 overflow-y-auto">
        {/* App Branding & Close Button */}
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
              <p className="text-[11px] text-[#8ea896] mt-0.5">Mindful notes</p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a3b8aa] hover:text-[#f8f5ee] hover:bg-[#254233] transition-colors cursor-pointer lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation Items */}
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

          <button 
            onClick={() => handleNavClick('favorites')}
            className={navItemClass('favorites')}
          >
            <Star className="w-4 h-4 shrink-0 text-[#e2c275]" />
            <span>Favorites</span>
          </button>

          <button 
            onClick={() => handleNavClick('pinned')}
            className={navItemClass('pinned')}
          >
            <Pin className="w-4 h-4 shrink-0" />
            <span>Pinned</span>
          </button>

          <button 
            onClick={() => handleNavClick('archive')}
            className={navItemClass('archive')}
          >
            <Archive className="w-4 h-4 shrink-0" />
            <span>Archive</span>
          </button>

          <button 
            onClick={() => handleNavClick('trash')}
            className={navItemClass('trash')}
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>Trash</span>
          </button>
        </nav>

        {/* Tools & Search */}
        <div className="flex flex-col gap-1 border-t border-[#264836] pt-4">

          <button 
            onClick={handleSearchClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#a3b8aa] hover:text-[#f8f5ee] hover:bg-[#254233] transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Bottom Menu: Settings & Profile */}
      <div className="p-4 border-t border-[#264836] flex flex-col gap-1 bg-[#163325]">
        <button 
          onClick={() => handleNavClick('settings')}
          className={navItemClass('settings')}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </button>

        <button 
          onClick={() => handleNavClick('profile')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
            activeTab === 'profile' ? 'bg-[#325240] text-[#f8f5ee]' : 'text-[#a3b8aa] hover:text-[#f8f5ee] hover:bg-[#254233]'
          }`}
        >
          <img 
            src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'} 
            alt={profile?.name || 'User'} 
            className="w-6 h-6 rounded-full object-cover border border-[#487057] shrink-0"
          />
          <span className="truncate text-left text-xs font-medium">{profile?.name || 'Profile'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop In-Flow Sidebar (Smooth collapsible transition with 300ms ease-in-out) */}
      <aside 
        className={`hidden lg:flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none bg-[#1b3b2b] text-[#e2ebd8] transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'w-60 border-r border-[#264836] opacity-100' : 'w-0 border-r-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-60 h-full flex flex-col justify-between shrink-0">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer (Visible below lg when opened, with backdrop overlay) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true" aria-label="Navigation Drawer">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ease-in-out animate-in fade-in"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <aside className="relative w-72 max-w-[85vw] bg-[#1b3b2b] text-[#e2ebd8] flex flex-col justify-between h-full shadow-2xl z-10 border-r border-[#264836] animate-in slide-in-from-left duration-300 ease-in-out select-none">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};


