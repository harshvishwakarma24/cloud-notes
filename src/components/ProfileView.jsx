import React, { useState } from 'react';
import { FileText, Folder, Calendar, Cloud, Edit2, Check } from 'lucide-react';

export const ProfileView = ({
  profile,
  onUpdateProfile = () => {},
  setActiveTab = () => {}
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');

  const handleSave = () => {
    onUpdateProfile({ ...profile, name, email });
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f5ee] overflow-y-auto relative">
      {/* Top Simple Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between border-b border-[#e5dcce] bg-[#f8f5ee] shrink-0">
        <button 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Cloud className="w-5 h-5 text-[#1b3b2b]" />
          <span className="font-serif-title font-semibold text-base sm:text-lg text-[#2c3830]">Cloud Notes</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className="text-xs text-[#526156] hover:text-[#1b3b2b] font-medium cursor-pointer"
        >
          Settings
        </button>
      </div>

      {/* Main Profile Canvas */}
      <div className="relative flex-1 flex flex-col items-center">
        {/* Watercolor Landscape Banner */}
        <div 
          className="w-full h-44 sm:h-56 lg:h-72 bg-cover bg-center relative border-b border-[#e2d8be] shadow-inner"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80')`
          }}
        >
          {/* Subtle gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f5ee] via-transparent to-black/10" />
        </div>

        {/* Centered Avatar and User Details Container */}
        <div className="relative -mt-12 sm:-mt-16 lg:-mt-20 flex flex-col items-center text-center space-y-4 max-w-xl w-full px-4 sm:px-6 z-10 pb-12">
          {/* Avatar circle */}
          <div className="relative group">
            <img 
              src={profile?.avatarUrl} 
              alt={profile?.name} 
              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-[#f8f5ee] shadow-xl"
            />
          </div>

          {/* User Name & Email */}
          {isEditing ? (
            <div className="space-y-3 w-full max-w-sm">
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full text-center font-serif-title text-lg sm:text-xl font-bold text-[#2c3830] bg-[#f2ece0] border border-[#d8ceb3] rounded-xl px-3 py-1.5 outline-none"
              />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-center text-xs text-[#6e7d71] bg-[#f2ece0] border border-[#d8ceb3] rounded-xl px-3 py-1.5 outline-none"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <h2 className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#2c3830]">
                {profile?.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#6e7d71]">{profile?.email}</p>
            </div>
          )}

          {/* Edit Profile Button */}
          {isEditing ? (
            <button 
              onClick={handleSave}
              className="px-6 sm:px-8 py-2 sm:py-2.5 bg-[#1b3b2b] hover:bg-[#284f3b] text-[#f8f5ee] rounded-full text-xs sm:text-sm font-medium transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save profile</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full max-w-md py-2 sm:py-2.5 bg-[#335d46] hover:bg-[#274836] text-[#f8f5ee] rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit profile</span>
            </button>
          )}

          {/* Divider line */}
          <div className="w-full h-px bg-[#e2d8be]/80 my-4 sm:my-6" />

          {/* Stat Cards (Responsive Grid: 1 col on mobile, 3 on sm/md/lg) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
            <div className="bg-[#f5f0e4] border border-[#e2d8be] rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#eee5cf] text-[#1b3b2b]">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <span className="text-[11px] sm:text-xs text-[#6e7d71] font-medium block">Notes</span>
                <span className="font-serif-title text-lg sm:text-xl font-bold text-[#2c3830]">{profile?.notesCount || 0}</span>
              </div>
            </div>

            <div className="bg-[#f5f0e4] border border-[#e2d8be] rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#eee5cf] text-[#1b3b2b]">
                <Folder className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <span className="text-[11px] sm:text-xs text-[#6e7d71] font-medium block">Spaces</span>
                <span className="font-serif-title text-lg sm:text-xl font-bold text-[#2c3830]">{profile?.spacesCount || 0}</span>
              </div>
            </div>

            <div className="bg-[#f5f0e4] border border-[#e2d8be] rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#eee5cf] text-[#1b3b2b]">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <span className="text-[11px] sm:text-xs text-[#6e7d71] font-medium block">Days active</span>
                <span className="font-serif-title text-lg sm:text-xl font-bold text-[#2c3830]">{profile?.daysActive || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
