import React from 'react';
import { Search, Bell, Plus, User, Menu } from 'lucide-react';

export const Header = ({
  profile,
  openSearchModal,
  createNewNote,
  setActiveTab,
  onToggleSidebar = () => {},
  isDarkTheme = false
}) => {
  // Dynamic time-of-day greeting
  const getGreetingPrefix = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const greetingPrefix = getGreetingPrefix();
  const displayName = profile?.name?.trim()
    ? profile.name.trim().split(' ')[0]
    : (profile?.email ? profile.email.split('@')[0] : 'there');

  const avatarUrl = profile?.avatarUrl || profile?.avatar_url;
  const avatarInitial = profile?.name?.trim()?.charAt(0)?.toUpperCase() || profile?.email?.charAt(0)?.toUpperCase();

  return (
    <header className={`w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 flex items-center justify-between border-b shrink-0 sticky top-0 z-20 backdrop-blur-xs ${
      isDarkTheme 
        ? 'bg-[#18201b]/95 border-[#34463a]' 
        : 'bg-[#f8f5ee]/80 border-[#e8e2d4]/70'
    }`}>
      <div className="flex items-center gap-3 min-w-0">
        {/* Collapsible Sidebar Drawer Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className={`p-2 -ml-1.5 rounded-xl cursor-pointer transition-colors ${
            isDarkTheme 
              ? 'text-[#e7e1d5] hover:bg-[#1d2821] active:bg-[#243129]' 
              : 'text-[#2c3830] hover:bg-[#eae3d0] active:bg-[#ded5c0]'
          }`}
          aria-label="Toggle navigation menu"
          title="Toggle menu"
        >
          <Menu className={`w-5 h-5 ${isDarkTheme ? 'text-[#6f9b7f]' : 'text-[#1b3b2b]'}`} />
        </button>

        <div className="min-w-0">
          <h2 className={`font-serif-title text-base sm:text-xl lg:text-2xl font-semibold tracking-tight truncate flex items-center gap-1.5 ${
            isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'
          }`}>
            <span>{greetingPrefix}, {displayName}</span>
            <span className="shrink-0">🌿</span>
          </h2>
          <p className={`text-[11px] sm:text-xs truncate hidden xs:block mt-0.5 ${
            isDarkTheme ? 'text-[#829087]' : 'text-[#738276]'
          }`}>
            Let's capture something beautiful today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
        {/* Search trigger */}
        <button 
          onClick={openSearchModal}
          className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border rounded-full text-xs transition-all shadow-xs cursor-pointer ${
            isDarkTheme 
              ? 'bg-[#1d2821] hover:bg-[#243129] border-[#34463a] text-[#aeb8ae]' 
              : 'bg-[#f0ebd9] hover:bg-[#e8e1cb] border-[#e2d8be] text-[#526156]'
          }`}
        >
          <Search className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-[#829087]' : 'text-[#7a8a7e]'}`} />
          <span className="font-medium hidden sm:inline">Search</span>
          <kbd className={`hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded border ${
            isDarkTheme ? 'bg-[#243129] text-[#829087] border-[#34463a]' : 'bg-[#e4dcce] text-[#8a988d] border-[#d8ceb3]'
          }`}>⌘K</kbd>
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
          className={`relative p-2 rounded-full border transition-colors cursor-pointer ${
            isDarkTheme 
              ? 'bg-[#1d2821] hover:bg-[#243129] border-[#34463a] text-[#aeb8ae]' 
              : 'text-[#526156] border-transparent hover:bg-[#eae3d0]'
          }`}
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c25a38] rounded-full"></span>
        </button>

        {/* User Avatar */}
        <button 
          onClick={() => setActiveTab('profile')}
          className={`w-8 h-8 rounded-full overflow-hidden border transition-all cursor-pointer shrink-0 ${
            isDarkTheme 
              ? 'bg-[#1d2821] border-[#34463a] hover:ring-2 hover:ring-[#6f9b7f]/30' 
              : 'border-[#d0c6ac] hover:ring-2 hover:ring-[#1b3b2b]/30'
          }`}
          aria-label="User Profile"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={profile?.name || 'User Profile'} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center font-serif-title text-xs font-semibold ${
              isDarkTheme ? 'bg-[#163c2b] text-[#e7e1d5]' : 'bg-[#1b3b2b] text-[#f8f5ee]'
            }`}>
              {avatarInitial || <User className="w-4 h-4" />}
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
