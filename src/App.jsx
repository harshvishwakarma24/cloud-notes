import React, { useState, useEffect } from 'react';
import { searchSuggestions } from './data';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { NotesView } from './components/NotesView';
import { NoteEditor } from './components/NoteEditor';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { SplashView } from './components/SplashView';
import { CalendarView } from './components/CalendarView';
import { NotificationToast } from './components/NotificationToast';
import { ConfirmationModal } from './components/ConfirmationModal';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabaseClient';
import {
  Home,
  FileText,
  Star,
  Pin,
  User,
  HelpCircle,
  Plus
} from 'lucide-react';

export default function App() {
  const { user, loading } = useAuth();

  // Navigation & View States
  const [activeTab, setActiveTab] = useState('home');

  const [selectedNoteId, setSelectedNoteId] = useState('n1');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Persistent States
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);

  const showNotification = (type, message) => {
    setNotification({ type, message, id: Date.now() });
  };

  const requestConfirmation = (options) => {
    setConfirmation(options);
  };

  const [profile, setProfile] = useState(null);
  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, created_at, updated_at')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        if (error) console.error('Failed to load profile:', error);
        setProfile({
          id: user.id,
          name: user.user_metadata?.name || (user.email ? user.email.split('@')[0] : 'User'),
          email: user.email || '',
          avatarUrl: '',
        });
        return;
      }

      setProfile({
        id: data.id,
        name: data.display_name || user.user_metadata?.name || (user.email ? user.email.split('@')[0] : 'User'),
        email: user.email || '',
        avatarUrl: data.avatar_url || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      if (!user) {
        setSettings({
          theme: 'light',
          paperTexture: true,
          softAnimations: true
        });
        return;
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('theme, paper_texture, soft_animations')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error('Failed to load settings:', error);
        return;
      }

      // Create the default settings row if this user does not have one yet.
      if (!data) {
        const defaultSettings = {
          user_id: user.id,
          theme: 'light',
          paper_texture: true,
          soft_animations: true
        };

        const { error: insertError } = await supabase
          .from('user_settings')
          .insert(defaultSettings);

        if (cancelled) return;

        if (insertError) {
          console.error(
            'Failed to create default settings:',
            insertError
          );
          return;
        }

        setSettings({
          theme: 'light',
          paperTexture: true,
          softAnimations: true
        });

        return;
      }

      setSettings({
        theme: data.theme || 'light',
        paperTexture: data.paper_texture ?? true,
        softAnimations: data.soft_animations ?? true
      });
    };

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const [settings, setSettings] = useState({
    theme: 'light',
    paperTexture: true,
    softAnimations: true
  });

  useEffect(() => {
    let cancelled = false;

    const loadNotes = async () => {
      if (!user) {
        setNotes([]);
        setNotesLoading(false);
        return;
      }

      setNotesLoading(true);

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error('Failed to load notes:', error);
        setNotes([]);
        setNotesLoading(false);
        return;
      }

      const mappedNotes = (data || []).map((note) => ({
        id: note.id,
        title: note.title || 'Untitled Note 🌿',
        content: note.content || '',
        space: 'Personal',
        pinned: note.is_pinned ?? false,
        isFavorite: note.is_favorite ?? false,
        isArchived: note.is_archived ?? false,
        isDeleted: note.is_deleted ?? false,
        deletedAt: note.deleted_at || null,
        bookmarkColor: '#c89f65',
        color: null,
        imageUrl: '',
        tags: [],
        createdAt: note.created_at,
        updatedAt: note.updated_at
      }));

      setNotes(mappedNotes);
      setNotesLoading(false);
    };

    loadNotes();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleUpdateSettings = async (updatedSettings) => {
    if (!user) return;

    // Update UI immediately for a responsive feel.
    setSettings(updatedSettings);

    const { error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          theme: updatedSettings.theme || 'light',
          paper_texture: updatedSettings.paperTexture ?? true,
          soft_animations: updatedSettings.softAnimations ?? true
        },
        {
          onConflict: 'user_id'
        }
      );

    if (error) {
      console.error('Failed to save settings:', error);
      showNotification('error', 'Could not save your settings. Please try again.');
    }
  };

  // Handle Note Operations
  const handleOpenNote = (id) => {
    setSelectedNoteId(id);
    setActiveTab('editor');
  };

  const handleCreateNewNote = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: '',
        content: '',
        is_pinned: false,
        is_favorite: false,
        is_archived: false,
        is_deleted: false,
        deleted_at: null
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create note:', error);
      showNotification('error', 'Could not create your note. Please try again.');
      return;
    }

    const newNote = {
      id: data.id,
      title: data.title || '',
      content: data.content || '',
      pinned: data.is_pinned ?? false,
      isFavorite: data.is_favorite ?? false,
      isArchived: data.is_archived ?? false,
      isDeleted: data.is_deleted ?? false,
      deletedAt: data.deleted_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,

      // UI compatibility defaults
      bookmarkColor: '#c89f65',
      color: null,
      imageUrl: '',
      tags: []
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setActiveTab('editor');
  };

  const handleCreateNoteWithContent = async ({ content = '' } = {}) => {
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: 'Untitled Note 🌿',
        content: content,
        is_pinned: false,
        is_favorite: false,
        is_archived: false,
        is_deleted: false,
        deleted_at: null
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create note from Quick Capture:', error);
      showNotification('error', 'Could not save your note. Please try again.');
      throw error;
    }

    const newNote = {
      id: data.id,
      title: data.title || 'Untitled Note 🌿',
      content: data.content || '',
      pinned: data.is_pinned ?? false,
      isFavorite: data.is_favorite ?? false,
      isArchived: data.is_archived ?? false,
      isDeleted: data.is_deleted ?? false,
      deletedAt: data.deleted_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      bookmarkColor: '#c89f65',
      color: null,
      imageUrl: '',
      tags: []
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setActiveTab('editor');
  };

  const handleUpdateNote = async (updatedNote) => {
    if (!user || !updatedNote?.id) return;

    const previousNote = notes.find((note) => note.id === updatedNote.id);
    const updatedAt = new Date().toISOString();

    setNotes((prev) =>
      prev.map((note) =>
        note.id === updatedNote.id
          ? {
            ...note,
            title: updatedNote.title,
            content: updatedNote.content,
            pinned: updatedNote.pinned ?? note.pinned,
            isFavorite: updatedNote.isFavorite ?? note.isFavorite,
            isArchived: updatedNote.isArchived ?? note.isArchived,
            updatedAt
          }
          : note
      )
    );

    const { error } = await supabase
      .from('notes')
      .update({
        title: updatedNote.title,
        content: updatedNote.content,
        is_pinned: updatedNote.pinned ?? false,
        is_favorite: updatedNote.isFavorite ?? false,
        is_archived: updatedNote.isArchived ?? false,
        updated_at: updatedAt
      })
      .eq('id', updatedNote.id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to update note in Supabase:', error);
      if (previousNote) {
        setNotes((prev) =>
          prev.map((note) =>
            note.id === previousNote.id ? previousNote : note
          )
        );
      }
      showNotification('error', 'Could not save your note. Your previous version was restored.');
      return false;
    }

    return true;
  };

  const handleDeleteNote = async (id) => {
    if (!user || !id) return;

    const deletedAt = new Date().toISOString();

    const { error } = await supabase
      .from('notes')
      .update({
        is_deleted: true,
        deleted_at: deletedAt,
        updated_at: deletedAt
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to move note to trash:', error);
      showNotification('error', 'Could not move the note to Trash. Please try again.');
      return;
    }

    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
            ...note,
            isDeleted: true,
            deletedAt
          }
          : note
      )
    );

    if (selectedNoteId === id) {
      setSelectedNoteId(null);
      setActiveTab('notes');
    }
  };

  const handleRestoreFromTrash = async (id) => {
    if (!user || !id) return;

    const updatedAt = new Date().toISOString();

    const { error } = await supabase
      .from('notes')
      .update({
        is_deleted: false,
        deleted_at: null,
        updated_at: updatedAt
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to restore note:', error);
      showNotification('error', 'Could not restore the note. Please try again.');
      return;
    }

    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
            ...note,
            isDeleted: false,
            deletedAt: null,
            updatedAt
          }
          : note
      )
    );
  };

  const handlePermanentDeleteNote = async (id) => {
    if (!user || !id) return;

    requestConfirmation({
      title: 'Delete note permanently?',
      message: 'This action cannot be undone.',
      confirmLabel: 'Delete',
      onConfirm: async () => {
        setConfirmation(null);
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Failed to permanently delete note:', error);
          showNotification('error', 'Could not permanently delete the note. Please try again.');
          return;
        }

        setNotes((prev) => prev.filter((note) => note.id !== id));

        if (selectedNoteId === id) {
          setSelectedNoteId(null);
        }
        showNotification('success', 'Note permanently deleted.');
      }
    });
  };

  const handleToggleArchive = async (id) => {
    if (!user || !id) return;

    const note = notes.find((n) => n.id === id);
    if (!note) return;

    const newArchivedState = !note.isArchived;
    const updatedAt = new Date().toISOString();

    const { error } = await supabase
      .from('notes')
      .update({
        is_archived: newArchivedState,
        updated_at: updatedAt
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to update archive state:', error);
      showNotification('error', 'Could not update the archive state. Please try again.');
      return;
    }

    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
            ...n,
            isArchived: newArchivedState,
            updatedAt
          }
          : n
      )
    );
  };

  const handleTogglePin = async (id) => {
    if (!user || !id) return;

    const note = notes.find((n) => n.id === id);

    if (!note) return;

    const newPinnedState = !note.pinned;

    const { error } = await supabase
      .from('notes')
      .update({
        is_pinned: newPinnedState,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to update pin state:', error);
      showNotification('error', 'Could not update the pin state. Please try again.');
      return;
    }

    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
            ...n,
            pinned: newPinnedState
          }
          : n
      )
    );
  };

  const handleToggleFavorite = async (id) => {
    if (!user || !id) return;

    const note = notes.find((n) => n.id === id);

    if (!note) return;

    const newFavoriteState = !note.isFavorite;

    const { error } = await supabase
      .from('notes')
      .update({
        is_favorite: newFavoriteState,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to update favorite state:', error);
      showNotification('error', 'Could not update the favorite state. Please try again.');
      return;
    }

    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
            ...n,
            isFavorite: newFavoriteState
          }
          : n
      )
    );
  };

  const activeNotes = notes.filter((n) => !n.isDeleted && !n.isArchived);
  const selectedNote = notes.find(n => n.id === selectedNoteId) || activeNotes[0] || {
    id: 'empty',
    title: 'Welcome 🌿',
    content: 'Create your first note to begin.',
    updatedAt: 'Just now',
    createdAt: 'Today'
  };


  // Paper texture class
  const paperClass = settings?.paperTexture
    ? settings?.theme === 'dark'
      ? 'paper-texture-dark'
      : 'paper-texture'
    : settings?.theme === 'dark'
      ? 'bg-[#18201b]'
      : 'bg-[#f8f5ee]';

  const isDarkTheme = settings?.theme === 'dark';
  const softAnimClass = settings?.softAnimations ? 'soft-transitions' : '';

  if (loading) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center ${isDarkTheme ? 'bg-[#18201b] text-[#e7e1d5]' : 'bg-[#f8f5ee] text-[#2c322e]'}`}>
        <div className="text-center">
          <div className={`w-10 h-10 border-2 ${isDarkTheme ? 'border-[#6f9b7f]/20 border-t-[#6f9b7f]' : 'border-[#1b3b2b]/20 border-t-[#1b3b2b]'} rounded-full animate-spin mx-auto mb-4`} />
          <p className={`text-sm ${isDarkTheme ? 'text-[#aeb8ae]' : 'text-[#6e7d71]'}`}>Loading Cloud Notes...</p>
        </div>
      </div>
    );
  }
  // Authentication guard
  if (!user) {
    return (
      <div className={`min-h-screen w-full flex flex-col font-outfit ${paperClass} ${softAnimClass}`}>
        <SplashView
          onEnter={() => setAuthMode('login')}
          onLoginClick={() => setAuthMode('login')}
        />

        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onLoginSuccess={() => {
            setAuthMode(null);
            setActiveTab('home');
          }}
          setMode={setAuthMode}
          onNotify={showNotification}
          isDarkTheme={isDarkTheme}
        />
      </div>
    );
  }

  // Render main view component based on activeTab
  const renderMainContent = () => {
    const activeNotes = notes.filter((n) => !n.isDeleted && !n.isArchived);
    const favoriteNotes = notes.filter((n) => n.isFavorite && !n.isDeleted && !n.isArchived);
    const pinnedNotes = notes.filter((n) => n.pinned && !n.isDeleted && !n.isArchived);
    const archivedNotes = notes.filter((n) => n.isArchived && !n.isDeleted);
    const trashedNotes = notes.filter((n) => n.isDeleted);

    switch (activeTab) {
      case 'splash':
        return (
          <SplashView
            onEnter={() => setActiveTab('home')}
            onLoginClick={() => setAuthMode('login')}
          />
        );

      case 'home':
        return (
          <HomeView
            notes={activeNotes}
            openNote={handleOpenNote}
            createNewNote={handleCreateNewNote}
            createNoteWithContent={handleCreateNoteWithContent}
            setActiveTab={setActiveTab}
            onNotify={showNotification}
            isDarkTheme={isDarkTheme}
          />
        );

      case 'notes':
        return (
          <NotesView
            notes={activeNotes}
            isLoading={notesLoading}
            openNote={handleOpenNote}
            createNewNote={handleCreateNewNote}
            deleteNote={handleDeleteNote}
            togglePin={handleTogglePin}
            toggleFavorite={handleToggleFavorite}
            toggleArchive={handleToggleArchive}
            viewTitle="All Notes"
            isDarkTheme={isDarkTheme}
          />
        );

      case 'favorites':
        return (
          <NotesView
            notes={favoriteNotes}
            isLoading={notesLoading}
            openNote={handleOpenNote}
            createNewNote={handleCreateNewNote}
            deleteNote={handleDeleteNote}
            togglePin={handleTogglePin}
            toggleFavorite={handleToggleFavorite}
            toggleArchive={handleToggleArchive}
            viewTitle="Favorites"
            isDarkTheme={isDarkTheme}
          />
        );

      case 'pinned':
        return (
          <NotesView
            notes={pinnedNotes}
            isLoading={notesLoading}
            openNote={handleOpenNote}
            createNewNote={handleCreateNewNote}
            deleteNote={handleDeleteNote}
            togglePin={handleTogglePin}
            toggleFavorite={handleToggleFavorite}
            toggleArchive={handleToggleArchive}
            viewTitle="Pinned Notes"
            isDarkTheme={isDarkTheme}
          />
        );

      case 'archive':
        return (
          <NotesView
            notes={archivedNotes}
            isLoading={notesLoading}
            isArchiveView={true}
            openNote={handleOpenNote}
            createNewNote={handleCreateNewNote}
            deleteNote={handleDeleteNote}
            toggleArchive={handleToggleArchive}
            viewTitle="Archive"
            isDarkTheme={isDarkTheme}
          />
        );

      case 'trash':
        return (
          <NotesView
            notes={trashedNotes}
            isLoading={notesLoading}
            isTrashView={true}
            restoreNote={handleRestoreFromTrash}
            permanentDeleteNote={handlePermanentDeleteNote}
            viewTitle="Trash"
            isDarkTheme={isDarkTheme}
          />
        );

      case 'calendar':
        return (
          <CalendarView
            notes={notes}
            openNote={handleOpenNote}
            isDarkTheme={isDarkTheme}
          />
        );

      case 'editor':
        return (
          <NoteEditor
            note={selectedNote}
            onUpdateNote={handleUpdateNote}
            onTogglePin={handleTogglePin}
            onToggleFavorite={handleToggleFavorite}
            onToggleArchive={handleToggleArchive}
            onDeleteNote={handleDeleteNote}
            onNotify={showNotification}
            onBack={() => setActiveTab('home')}
            isDarkTheme={isDarkTheme}
          />
        );

      case 'profile':
        return (
          <ProfileView
            profile={profile}
            notes={notes}
            onUpdateProfile={setProfile}
            onNotify={showNotification}
            setActiveTab={setActiveTab}
            isDarkTheme={isDarkTheme}
          />
        );

      case 'settings':
        return (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            isDarkTheme={isDarkTheme}
          />
        );

      case 'help':
        return (
          <div className="flex-1 p-4 sm:p-8 max-w-2xl mx-auto space-y-6 overflow-y-auto">
            <div className="flex items-center gap-3">
              <HelpCircle
                className={`w-6 h-6 ${isDarkTheme ? 'text-[#6f9b7f]' : 'text-[#1b3b2b]'
                  }`}
              />

              <h3
                className={`font-serif-title text-2xl font-bold ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'
                  }`}
              >
                Cloud Notes Help & Features Guide
              </h3>
            </div>

            <div
              className={`border rounded-2xl p-5 sm:p-6 space-y-4 text-xs leading-relaxed ${isDarkTheme
                  ? 'bg-[#1b251f] border-[#344239] text-[#e7e1d5]'
                  : 'bg-[#f5f0e4] border-[#e2d8be] text-[#2c3830]'
                }`}
            >
              <p className="font-medium text-sm">
                Welcome to Cloud Notes — A peaceful, mindful home for your thoughts.
              </p>

              <ul
                className={`list-disc pl-5 space-y-2.5 ${isDarkTheme ? 'text-[#aeb8ae]' : 'text-[#526156]'
                  }`}
              >
                <li>
                  <strong>All Notes & Filtering:</strong> Organize your workspace with All Notes, Favorites (starred notes), and Pinned notes.
                </li>

                <li>
                  <strong>Archive View:</strong> Store inactive notes safely out of your main workspace. Unarchive anytime to restore them.
                </li>

                <li>
                  <strong>Trash & Recovery:</strong> Discarded notes remain in Trash for 30 days before automatic clearance. Restore notes anytime or permanently delete them immediately.
                </li>

                <li>
                  <strong>Mindful Calendar:</strong> View your notes organized by creation and edit dates across time.
                </li>

                <li>
                  <strong>Formatting & Focus:</strong> Write with debounced autosave, rich text formatting, and native share.
                </li>

                <li>
                  <strong>Night Paper Dark Mode & Themes:</strong> Customize appearance with the Night Paper dark theme, paper texture, and soft transitions in Settings.
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return (
          <HomeView
            notes={activeNotes}
            openNote={handleOpenNote}
            createNewNote={handleCreateNewNote}
            createNoteWithContent={handleCreateNoteWithContent}
            setActiveTab={setActiveTab}
            isDarkTheme={isDarkTheme}
          />
        );
    }
  };

  // If splash view is active, render full-screen splash
  if (activeTab === 'splash') {
    return (
      <div className={`min-h-screen w-full flex flex-col font-outfit ${paperClass} ${softAnimClass}`}>
        <SplashView
          onEnter={() => setActiveTab('home')}
          onLoginClick={() => setAuthMode('login')}
        />
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onLoginSuccess={() => {
            setAuthMode(null);
            setActiveTab('home');
          }}
          setMode={setAuthMode}
          isDarkTheme={isDarkTheme}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full flex flex-row ${isDarkTheme
          ? 'bg-[#18201b] text-[#e7e1d5] dark-theme'
          : 'bg-[#f8f5ee] text-[#2c322e]'
        } font-outfit ${paperClass} ${softAnimClass} overflow-x-hidden transition-colors duration-500`}
    >
      {/* Collapsible Vertical Navigation Drawer (Desktop + Tablet + Mobile) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSearchModal={() => setSearchModalOpen(true)}
        profile={profile}
        isDarkTheme={isDarkTheme}
      />

      {/* Main View Area - Uses Full Screen Width */}
      <div className={`flex-1 flex flex-col min-w-0 h-screen overflow-hidden ${activeTab !== 'editor' ? 'pb-14 lg:pb-0' : 'pb-0'} transition-all duration-300 ease-in-out`}>
        {/* Render Top Header on views except Editor, Profile, Splash */}
        {activeTab !== 'editor' && activeTab !== 'profile' && (
          <Header
            profile={profile}
            openSearchModal={() => setSearchModalOpen(true)}
            createNewNote={handleCreateNewNote}
            setActiveTab={setActiveTab}
            onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            isDarkTheme={isDarkTheme}
          />
        )}

        {/* Dynamic Screen Component */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {renderMainContent()}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Shown on small screens for fast touch switching) */}
      {activeTab !== 'editor' && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#1b3b2b]/95 backdrop-blur-md border-t border-[#264836] px-3 py-2 flex items-center justify-around text-[#a3b8aa] shadow-lg">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'home' ? 'text-[#f8f5ee] font-semibold' : 'hover:text-[#f8f5ee]'
              }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'notes' ? 'text-[#f8f5ee] font-semibold' : 'hover:text-[#f8f5ee]'
              }`}
          >
            <FileText className="w-4 h-4" />
            <span>Notes</span>
          </button>

          {/* Quick Note Action Center Button */}
          <button
            onClick={handleCreateNewNote}
            className="flex items-center justify-center w-10 h-10 -mt-4 bg-[#325240] hover:bg-[#3d664f] text-[#f8f5ee] rounded-full shadow-lg border-2 border-[#1b3b2b] transition-transform active:scale-95 cursor-pointer"
            aria-label="Create new note"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'favorites' ? 'text-[#f8f5ee] font-semibold' : 'hover:text-[#f8f5ee]'
              }`}
          >
            <Star className="w-4 h-4" />
            <span>Favorites</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'profile' ? 'text-[#f8f5ee] font-semibold' : 'hover:text-[#f8f5ee]'
              }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </nav>
      )}

      {/* Search Modal Overlay */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        notes={activeNotes}
        openNote={handleOpenNote}
        searchSuggestions={searchSuggestions}
        isDarkTheme={isDarkTheme}
      />

      <NotificationToast
        notification={notification}
        onDismiss={() => setNotification(null)}
        isDarkTheme={isDarkTheme}
      />

      <ConfirmationModal
        confirmation={confirmation}
        onCancel={() => setConfirmation(null)}
        onConfirm={() => confirmation?.onConfirm?.()}
        isDarkTheme={isDarkTheme}
      />

      {/* Authentication Modal */}
      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onLoginSuccess={(p) => {
          setProfile(p);
          setActiveTab('home');
        }}
        setMode={setAuthMode}
        onNotify={showNotification}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
}
