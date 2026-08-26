import React, { useState, useEffect } from 'react';
import { initialNotes, initialProfile, initialTasks, searchSuggestions } from './data';
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
import { 
  Home, 
  FileText, 
  LayoutGrid, 
  Sparkles, 
  User, 
  Calendar, 
  Trash2, 
  HelpCircle,
  Plus
} from 'lucide-react';

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState('home');
  const [selectedNoteId, setSelectedNoteId] = useState('n1');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [aiCompanionOpen, setAiCompanionOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState('All');

  // Persistent States
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('cloud_notes_items');
      return saved ? JSON.parse(saved) : initialNotes;
    } catch {
      return initialNotes;
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('cloud_notes_tasks');
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('cloud_notes_profile');
      return saved ? JSON.parse(saved) : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('cloud_notes_settings');
      return saved ? JSON.parse(saved) : {
        theme: 'light',
        paperTexture: true,
        softAnimations: true,
        font: 'Outfit'
      };
    } catch {
      return {
        theme: 'light',
        paperTexture: true,
        softAnimations: true,
        font: 'Outfit'
      };
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('cloud_notes_items', JSON.stringify(notes));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem('cloud_notes_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('cloud_notes_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('cloud_notes_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [settings]);

  // Handle Note Operations
  const handleOpenNote = (id) => {
    setSelectedNoteId(id);
    setActiveTab('editor');
  };

  const handleCreateNewNote = (space = 'Personal') => {
    const newNote = {
      id: `n_${Date.now()}`,
      title: 'Untitled Note 🌿',
      content: 'Start capturing your thoughts here...',
      space: typeof space === 'string' && space !== 'All' ? space : 'Personal',
      pinned: false,
      bookmarkColor: '#c89f65',
      updatedAt: 'Just now',
      createdAt: 'Today',
      tags: [typeof space === 'string' && space !== 'All' ? space : 'Personal'],
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setActiveTab('editor');
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleTogglePin = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  // Handle Task Operations
  const handleToggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (text) => {
    setTasks(prev => [...prev, { id: `t_${Date.now()}`, text, completed: false }]);
  };

  const selectedNote = notes.find(n => n.id === selectedNoteId) || notes[0] || {
    id: 'empty',
    title: 'Welcome 🌿',
    content: 'Create your first note to begin.',
    space: 'Personal',
    updatedAt: 'Just now',
    createdAt: 'Today'
  };

  // Font family class mapping
  const fontClassMap = {
    Outfit: 'font-outfit',
    Inter: 'font-inter',
    Roboto: 'font-roboto',
    Georgia: 'font-georgia',
  };

  const currentFontClass = fontClassMap[settings?.font] || 'font-outfit';

  // Paper texture class
  const paperClass = settings?.paperTexture ? 'paper-texture' : 'bg-[#f8f5ee]';

  // Render main view component based on activeTab
  const renderMainContent = () => {
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
            notes={notes}
            tasks={tasks}
            openNote={handleOpenNote}
            createNewNote={() => handleCreateNewNote('Personal')}
            toggleTask={handleToggleTask}
            addTask={handleAddTask}
            setActiveTab={setActiveTab}
          />
        );

      case 'notes':
      case 'spaces':
        return (
          <NotesView
            notes={notes}
            openNote={handleOpenNote}
            createNewNote={() => handleCreateNewNote(selectedSpace !== 'All' ? selectedSpace : 'Personal')}
            deleteNote={handleDeleteNote}
            togglePin={handleTogglePin}
            selectedSpace={selectedSpace}
            setSelectedSpace={setSelectedSpace}
          />
        );

      case 'journal':
        return (
          <NoteEditor
            note={notes.find(n => n.space === 'Journal') || selectedNote}
            onUpdateNote={handleUpdateNote}
            onBack={() => setActiveTab('home')}
            aiCompanionOpen={aiCompanionOpen}
            setAiCompanionOpen={setAiCompanionOpen}
          />
        );

      case 'editor':
        return (
          <NoteEditor
            note={selectedNote}
            onUpdateNote={handleUpdateNote}
            onBack={() => setActiveTab('home')}
            aiCompanionOpen={aiCompanionOpen}
            setAiCompanionOpen={setAiCompanionOpen}
          />
        );

      case 'ai-companion':
        return (
          <NoteEditor
            note={selectedNote}
            onUpdateNote={handleUpdateNote}
            onBack={() => setActiveTab('home')}
            aiCompanionOpen={true}
            setAiCompanionOpen={setAiCompanionOpen}
          />
        );

      case 'profile':
        return (
          <ProfileView
            profile={profile}
            onUpdateProfile={setProfile}
            setActiveTab={setActiveTab}
          />
        );

      case 'settings':
        return (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
          />
        );

      case 'calendar':
        return (
          <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto my-auto">
            <div className="p-4 rounded-full bg-[#f0ebd9] text-[#1b3b2b]">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-serif-title text-2xl font-bold text-[#2c3830]">Mindful Calendar</h3>
            <p className="text-xs text-[#6e7d71] leading-relaxed">
              View your notes across time. Tracking {profile?.daysActive || 89} active days of thoughts, ideas, and reflections.
            </p>
          </div>
        );

      case 'trash':
        return (
          <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto my-auto">
            <div className="p-4 rounded-full bg-[#f0ebd9] text-[#1b3b2b]">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-title text-2xl font-bold text-[#2c3830]">Trash</h3>
            <p className="text-xs text-[#6e7d71] leading-relaxed">
              Trash is empty. Discarded items will remain here for 30 days before permanent clearance.
            </p>
          </div>
        );

      case 'help':
        return (
          <div className="flex-1 p-4 sm:p-8 max-w-2xl mx-auto space-y-6 overflow-y-auto">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-[#1b3b2b]" />
              <h3 className="font-serif-title text-2xl font-bold text-[#2c3830]">Cloud Notes Help & Principles</h3>
            </div>
            <div className="bg-[#f5f0e4] border border-[#e2d8be] rounded-2xl p-5 sm:p-6 space-y-4 text-xs text-[#2c3830] leading-relaxed">
              <p className="font-medium text-sm">Welcome to Cloud Notes — A peaceful home for your thoughts.</p>
              <ul className="list-disc pl-5 space-y-2 text-[#526156]">
                <li><strong>Mindful Capture:</strong> Use Quick Capture on the Home screen to quickly record thoughts, audio, or sketches.</li>
                <li><strong>Spaces:</strong> Categorize notes by Personal, College, Work, Ideas, and Journal.</li>
                <li><strong>AI Companion & AI Suggestion:</strong> Select text inside the note editor to fix grammar, change tone, make text longer, or translate directly with Gemini AI.</li>
                <li><strong>Paper Texture & Fonts:</strong> Customize paper texture and font families inside Settings &gt; Appearance.</li>
              </ul>
            </div>
          </div>
        );

      default:
        return (
          <HomeView
            notes={notes}
            tasks={tasks}
            openNote={handleOpenNote}
            createNewNote={() => handleCreateNewNote('Personal')}
            toggleTask={handleToggleTask}
            addTask={handleAddTask}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  // If splash view is active, render full-screen splash
  if (activeTab === 'splash') {
    return (
      <div className={`min-h-screen w-full flex flex-col ${currentFontClass} ${paperClass}`}>
        <SplashView 
          onEnter={() => setActiveTab('home')}
          onLoginClick={() => setAuthMode('login')}
        />
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onLoginSuccess={(p) => {
            setProfile(p);
            setActiveTab('home');
          }}
          setMode={setAuthMode}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full flex bg-[#f8f5ee] text-[#2c322e] ${currentFontClass} ${paperClass} overflow-x-hidden`}>
      {/* Main Left Vertical Navigation Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSearchModal={() => setSearchModalOpen(true)}
        profile={profile}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden pb-14 lg:pb-0">
        {/* Render Top Header on views except Editor, Profile, Splash */}
        {activeTab !== 'editor' && activeTab !== 'journal' && activeTab !== 'ai-companion' && activeTab !== 'profile' && (
          <Header
            profile={profile}
            openSearchModal={() => setSearchModalOpen(true)}
            createNewNote={() => handleCreateNewNote(selectedSpace !== 'All' ? selectedSpace : 'Personal')}
            setActiveTab={setActiveTab}
            onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          />
        )}

        {/* Dynamic Screen Component */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {renderMainContent()}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Shown on small screens for fast touch switching) */}
      {activeTab !== 'editor' && activeTab !== 'journal' && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#1b3b2b]/95 backdrop-blur-md border-t border-[#264836] px-3 py-2 flex items-center justify-around text-[#a3b8aa] shadow-lg">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'home' ? 'text-[#f8f5ee] font-semibold' : 'hover:text-[#f8f5ee]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'notes' ? 'text-[#f8f5ee] font-semibold' : 'hover:text-[#f8f5ee]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Notes</span>
          </button>

          {/* Quick Note Action Center Button */}
          <button
            onClick={() => handleCreateNewNote('Personal')}
            className="flex items-center justify-center w-10 h-10 -mt-4 bg-[#325240] hover:bg-[#3d664f] text-[#f8f5ee] rounded-full shadow-lg border-2 border-[#1b3b2b] transition-transform active:scale-95 cursor-pointer"
            aria-label="Create new note"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('spaces')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'spaces' ? 'text-[#f8f5ee] font-semibold' : 'hover:text-[#f8f5ee]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Spaces</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'text-[#f8f5ee] font-semibold' : 'hover:text-[#f8f5ee]'
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
        notes={notes}
        openNote={handleOpenNote}
        searchSuggestions={searchSuggestions}
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
      />
    </div>
  );
}
