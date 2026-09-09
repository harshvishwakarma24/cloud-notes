import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FileText,
  Calendar,
  Cloud,
  Edit2,
  Check,
  LogOut,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export const ProfileView = ({
  profile,
  notes = [],
  onUpdateProfile = () => {},
  onNotify = () => {},
  setActiveTab = () => {},
  isDarkTheme = false
}) => {
  const { user, signOut } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(profile?.avatarUrl || '');
  const [saveLoading, setSaveLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  // Compute dynamic profile statistics from notes data
  const notesCount = useMemo(
    () => notes.filter((n) => !n.isDeleted).length,
    [notes]
  );

  const daysActive = useMemo(() => {
    const days = new Set();
    notes.forEach((n) => {
      if (n.isDeleted) return;
      if (n.createdAt) days.add(n.createdAt.slice(0, 10));
      if (n.updatedAt) days.add(n.updatedAt.slice(0, 10));
    });
    return days.size;
  }, [notes]);

  // Keep local fields synchronized with the real profile
  useEffect(() => {
    setName(profile?.name || '');
    setPreviewUrl(profile?.avatarUrl || '');
  }, [profile]);

  // Clean up temporary image preview
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ---------------------------------------------------------
  // Profile picture selection
  // ---------------------------------------------------------

  const handleAvatarSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError('');

    // Only allow images
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      event.target.value = '';
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError('Profile picture must be smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    setSelectedAvatar(file);

    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
  };

  // ---------------------------------------------------------
  // Save profile
  // ---------------------------------------------------------

  const handleSave = async () => {
  if (!user) {
    setError('You must be logged in to update your profile.');
    onNotify('warning', 'You must be logged in to update your profile.');
    return;
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    setError('Name cannot be empty.');
    onNotify('warning', 'Name cannot be empty.');
    return;
  }

  setSaveLoading(true);
  setError('');

  let avatarUrl = profile?.avatarUrl || '';
  let newAvatarPath = null;
  let oldAvatarPath = null;

  try {
    // -------------------------------------------------------
    // Upload new avatar
    // -------------------------------------------------------

    if (selectedAvatar) {
      const fileExtension =
        selectedAvatar.name.split('.').pop()?.toLowerCase() || 'jpg';

      newAvatarPath = `${user.id}/${crypto.randomUUID()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(newAvatarPath, selectedAvatar, {
          cacheControl: '3600',
          upsert: false,
          contentType: selectedAvatar.type
        });

      if (uploadError) {
        throw new Error(
          `Profile picture upload failed: ${uploadError.message}`
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(newAvatarPath);

      avatarUrl = publicUrlData.publicUrl;

      // -----------------------------------------------------
      // Get old avatar path for cleanup later
      // -----------------------------------------------------

      if (profile?.avatarUrl) {
        try {
          const oldUrl = new URL(profile.avatarUrl);
          const marker = '/storage/v1/object/public/avatars/';

          const markerIndex = oldUrl.pathname.indexOf(marker);

          if (markerIndex !== -1) {
            oldAvatarPath = decodeURIComponent(
              oldUrl.pathname.substring(
                markerIndex + marker.length
              )
            );
          }
        } catch (urlError) {
          console.warn(
            'Could not determine old avatar path:',
            urlError
          );
        }
      }
    }

    // -------------------------------------------------------
    // Update profile database row
    // -------------------------------------------------------

    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({
        display_name: trimmedName,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select('id, display_name, avatar_url, created_at, updated_at')
      .single();

    if (updateError) {
      throw new Error(
        `Profile update failed: ${updateError.message}`
      );
    }

    // -------------------------------------------------------
    // Delete old avatar ONLY after database update succeeds
    // -------------------------------------------------------

    if (oldAvatarPath && newAvatarPath) {
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([oldAvatarPath]);

      if (deleteError) {
        // Don't fail the profile update if cleanup fails.
        console.warn(
          'Old profile picture cleanup failed:',
          deleteError
        );
      }
    }

    // -------------------------------------------------------
    // Update parent App state
    // -------------------------------------------------------

    onUpdateProfile({
      id: data.id,
      name: data.display_name || '',
      email: user.email || '',
      avatarUrl: data.avatar_url || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });

    // Reset editing state
    setSelectedAvatar(null);
    setPreviewUrl(data.avatar_url || '');
    setIsEditing(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

  } catch (err) {
    console.error('Profile save failed:', err);
    setError(err.message || 'Unable to save your profile.');
    onNotify('error', 'Could not save your profile. Please try again.');
  } finally {
    setSaveLoading(false);
  }
};

  // ---------------------------------------------------------
  // Cancel editing
  // ---------------------------------------------------------

  const handleCancel = () => {
    setName(profile?.name || '');
    setSelectedAvatar(null);
    setPreviewUrl(profile?.avatarUrl || '');
    setError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setIsEditing(false);
  };

  // ---------------------------------------------------------
  // Logout
  // ---------------------------------------------------------

  const handleLogout = async () => {
    setLogoutLoading(true);

    const { error: logoutError } = await signOut();

    if (logoutError) {
      console.error('Logout failed:', logoutError);
      setLogoutLoading(false);
      onNotify('error', 'Could not log out. Please try again.');
    }
  };

  // ---------------------------------------------------------
  // Avatar fallback
  // ---------------------------------------------------------

  const avatarInitial =
    profile?.name?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    '?';

  return (
    <div className={`flex-1 flex flex-col h-full overflow-y-auto relative ${isDarkTheme ? 'bg-[#18201b]' : 'bg-[#f8f5ee]'}`}>

      {/* Top Simple Header */}
      <div className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between border-b shrink-0 ${
        isDarkTheme ? 'bg-[#1b251f] border-[#344239]' : 'bg-[#f8f5ee] border-[#e5dcce]'
      }`}>
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Cloud className={`w-5 h-5 ${isDarkTheme ? 'text-[#6f9b7f]' : 'text-[#1b3b2b]'}`} />

          <span className={`font-serif-title font-semibold text-base sm:text-lg ${
            isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'
          }`}>
            Cloud Notes
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`text-xs font-medium cursor-pointer ${
            isDarkTheme ? 'text-[#aeb8ae] hover:text-[#e7e1d5]' : 'text-[#526156] hover:text-[#1b3b2b]'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Main Profile Canvas */}
      <div className="relative flex-1 flex flex-col items-center">

        {/* Watercolor Landscape Banner */}
        <div
          className={`w-full h-44 sm:h-56 lg:h-72 bg-cover bg-center relative border-b shadow-inner ${
            isDarkTheme ? 'border-[#344239]' : 'border-[#e2d8be]'
          }`}
          style={{
            backgroundImage:
              `url('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80')`
          }}
        >
          <div className={`absolute inset-0 ${
            isDarkTheme 
              ? 'bg-gradient-to-t from-[#18201b] via-transparent to-black/30' 
              : 'bg-gradient-to-t from-[#f8f5ee] via-transparent to-black/10'
          }`} />
        </div>

        {/* Profile Content */}
        <div className="relative -mt-12 sm:-mt-16 lg:-mt-20 flex flex-col items-center text-center space-y-4 max-w-xl w-full px-4 sm:px-6 z-10 pb-12">

          {/* Avatar */}
          <div className="relative group">

            {previewUrl ? (
              <img
                src={previewUrl}
                alt={profile?.name || 'Profile'}
                className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 shadow-xl ${
                  isDarkTheme ? 'border-[#18201b]' : 'border-[#f8f5ee]'
                }`}
              />
            ) : (
              <div className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-4 shadow-xl flex items-center justify-center font-serif-title text-3xl sm:text-4xl ${
                isDarkTheme ? 'border-[#18201b] bg-[#163c2b] text-[#e7e1d5]' : 'border-[#f8f5ee] bg-[#335d46] text-[#f8f5ee]'
              }`}>
                {avatarInitial}
              </div>
            )}

            {/* Change avatar button */}
            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saveLoading}
                  className={`absolute bottom-1 right-1 w-9 h-9 sm:w-10 sm:h-10 rounded-full text-[#f8f5ee] border-2 shadow-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 ${
                    isDarkTheme 
                      ? 'bg-[#163c2b] border-[#18201b] hover:bg-[#1f4e39]' 
                      : 'bg-[#1b3b2b] border-[#f8f5ee] hover:bg-[#284f3b]'
                  }`}
                  aria-label="Change profile picture"
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Name + Email */}
          {isEditing ? (
            <div className="space-y-3 w-full max-w-sm">

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                autoFocus
                className={`w-full text-center font-serif-title text-lg sm:text-xl font-bold rounded-xl px-3 py-2 outline-none ${
                  isDarkTheme 
                    ? 'bg-[#202c25] border border-[#344239] text-[#e7e1d5] focus:border-[#6f9b7f]' 
                    : 'bg-[#f2ece0] border border-[#d8ceb3] text-[#2c3830] focus:border-[#335d46]'
                }`}
                placeholder="Your name"
              />

              {/* Email is intentionally read-only */}
              <div className={`w-full text-center text-xs sm:text-sm rounded-xl px-3 py-2 border ${
                isDarkTheme 
                  ? 'bg-[#202c25]/60 border-[#344239] text-[#aeb8ae]' 
                  : 'bg-[#eee8dc]/60 border-[#e2d8be] text-[#6e7d71]'
              }`}>
                {user?.email || profile?.email || ''}
              </div>

              <p className={`text-[10px] ${isDarkTheme ? 'text-[#829087]' : 'text-[#7c887e]'}`}>
                Email address cannot be changed here.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <h2 className={`font-serif-title text-2xl sm:text-3xl font-semibold ${
                isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'
              }`}>
                {profile?.name || 'User'}
              </h2>

              <p className={`text-xs sm:text-sm ${isDarkTheme ? 'text-[#aeb8ae]' : 'text-[#6e7d71]'}`}>
                {profile?.email || user?.email || ''}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className={`w-full max-w-md rounded-xl border px-4 py-2.5 text-xs ${
              isDarkTheme ? 'border-[#7a3b3b] bg-[#3b1f1f] text-[#f5a5a5]' : 'border-[#e7caca] bg-[#f8e9e7] text-[#8a4b43]'
            }`}>
              {error}
            </div>
          )}

          {/* Profile Actions */}
          {isEditing ? (
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-md">

              <button
                onClick={handleCancel}
                disabled={saveLoading}
                className={`px-5 sm:px-7 py-2 sm:py-2.5 border rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer disabled:opacity-50 ${
                  isDarkTheme 
                    ? 'border-[#344239] bg-[#202c25] hover:bg-[#26332b] text-[#aeb8ae]' 
                    : 'border-[#d8ceb3] bg-[#f5f0e4] hover:bg-[#eee5cf] text-[#526156]'
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saveLoading}
                className="flex-1 py-2 sm:py-2.5 bg-[#1b3b2b] hover:bg-[#284f3b] text-[#f8f5ee] rounded-full text-xs sm:text-sm font-medium transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />

                <span>
                  {saveLoading ? 'Saving...' : 'Save profile'}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setError('');
                setIsEditing(true);
              }}
              className="w-full max-w-md py-2 sm:py-2.5 bg-[#335d46] hover:bg-[#274836] text-[#f8f5ee] rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit profile</span>
            </button>
          )}

          {/* Divider */}
          <div className={`w-full h-px my-4 sm:my-6 ${isDarkTheme ? 'bg-[#344239]' : 'bg-[#e2d8be]/80'}`} />

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">

            <div className={`border rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs ${
              isDarkTheme ? 'bg-[#202c25] border-[#344239]' : 'bg-[#f5f0e4] border-[#e2d8be]'
            }`}>
              <div className={`p-2 sm:p-2.5 rounded-xl ${isDarkTheme ? 'bg-[#26332b] text-[#6f9b7f]' : 'bg-[#eee5cf] text-[#1b3b2b]'}`}>
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="text-left">
                <span className={`text-[11px] sm:text-xs font-medium block ${isDarkTheme ? 'text-[#829087]' : 'text-[#6e7d71]'}`}>
                  Notes
                </span>

                <span className={`font-serif-title text-lg sm:text-xl font-bold ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
                  {notesCount}
                </span>
              </div>
            </div>

            <div className={`border rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs ${
              isDarkTheme ? 'bg-[#202c25] border-[#344239]' : 'bg-[#f5f0e4] border-[#e2d8be]'
            }`}>
              <div className={`p-2 sm:p-2.5 rounded-xl ${isDarkTheme ? 'bg-[#26332b] text-[#6f9b7f]' : 'bg-[#eee5cf] text-[#1b3b2b]'}`}>
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="text-left">
                <span className={`text-[11px] sm:text-xs font-medium block ${isDarkTheme ? 'text-[#829087]' : 'text-[#6e7d71]'}`}>
                  Days active
                </span>

                <span className={`font-serif-title text-lg sm:text-xl font-bold ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
                  {daysActive}
                </span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="flex justify-center w-full mt-3 sm:mt-4">
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className={`px-8 sm:px-10 py-2.5 sm:py-3 border rounded-full text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                isDarkTheme 
                  ? 'border-[#4a3434] bg-[#291e1e] hover:bg-[#382626] text-[#e5a090]' 
                  : 'border-[#d8ceb3] bg-[#f5f0e4] hover:bg-[#eee5cf] text-[#6e4a42]'
              }`}
            >
              <LogOut className="w-4 h-4" />

              <span>
                {logoutLoading ? 'Logging out...' : 'Log out'}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};