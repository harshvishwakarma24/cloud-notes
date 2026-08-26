import React from 'react';
import { Search, Bell, Plus, User, Menu } from 'lucide-react';

export const Header = ({
  profile,
  openSearchModal,
  createNewNote,
  setActiveTab,
  onOpenMobileMenu = () => {}
}) => {
  const firstName = profile?.name ? profile.name.split(' ')[0] : 'there';

  return (
    <header className="w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 flex items-center justify-between border-b border-[#e8e2d4]/70 bg-[#f8f5ee]/80 backdrop-blur-xs shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile / Tablet Menu Button */}
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-1.5 rounded-xl text-[#2c3830] hover:bg-[#eae3d0] lg:hidden cursor-pointer transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="font-serif-title text-base sm:text-xl lg:text-2xl font-semibold text-[#2c3830] tracking-tight truncate flex items-center gap-1.5">
            <span>Good morning, {firstName}</span>
            <span className="shrink-0">🌿</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-[#738276] truncate hidden xs:block mt-0.5">
            Let's capture something beautiful today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
        {/* Search trigger */}
        <button 
          onClick={openSearchModal}
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#f0ebd9] hover:bg-[#e8e1cb] border border-[#e2d8be] rounded-full text-xs text-[#526156] transition-all shadow-xs cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#7a8a7e]" />
          <span className="font-medium hidden sm:inline">Search</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#8a988d] bg-[#e4dcce] rounded border border-[#d8ceb3]">⌘K</kbd>
        </button>

        {/* New note button */}
        <button 
          onClick={createNewNote}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1b3b2b] hover:bg-[#284f3b] text-[#f8f5ee] rounded-full text-xs font-medium transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="hidden xs:inline">New note</span>
        </button>

        {/* Notification Bell */}
        <button 
          className="relative p-2 rounded-full text-[#526156] hover:bg-[#eae3d0] transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c25a38] rounded-full"></span>
        </button>

        {/* User Avatar */}
        <button 
          onClick={() => setActiveTab('profile')}
          className="w-8 h-8 rounded-full overflow-hidden border border-[#d0c6ac] hover:ring-2 hover:ring-[#1b3b2b]/30 transition-all cursor-pointer shrink-0"
          aria-label="User Profile"
        >
          {profile?.isLoggedIn ? (
            <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#1b3b2b] text-[#f8f5ee] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
