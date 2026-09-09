import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Tag,
  Mic, 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  ArrowUpRight,
  X
} from 'lucide-react';

const isChecklistNote = (content = '') => content.includes('data-checklist-item');

const getChecklistItems = (content = '') => {
  if (!isChecklistNote(content) || typeof DOMParser === 'undefined') return [];

  const document = new DOMParser().parseFromString(content, 'text/html');
  return Array.from(document.querySelectorAll('[data-checklist-item]')).map((item) => ({
    checked: item.dataset.checked === 'true',
    text: item.querySelector('[data-checklist-text]')?.textContent?.trim() || ''
  }));
};

const ChecklistPreview = ({ content, className = '' }) => (
  <div className={`checklist-preview ${className}`}>
    {getChecklistItems(content).map((item, index) => (
      <div className="checklist-preview-item" key={`${index}-${item.text}`}>
        <span className={`checklist-preview-box ${item.checked ? 'is-checked' : ''}`} aria-hidden="true" />
        <span className={item.checked ? 'checklist-preview-text is-checked' : 'checklist-preview-text'}>
          {item.text || 'Checklist item'}
        </span>
      </div>
    ))}
  </div>
);

export const HomeView = ({
  notes = [],
  openNote = () => {},
  createNewNote = () => {},
  createNoteWithContent = () => {},
  setActiveTab = () => {},
  onNotify = () => {},
  isDarkTheme = false
}) => {
  const [quickCaptureText, setQuickCaptureText] = useState('');
  const [quickCaptureTags, setQuickCaptureTags] = useState([]);
  const [tagInputText, setTagInputText] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Speech recognition state (shared between both mic buttons)
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);
  const tagInputRef = useRef(null);

  const pinnedNotes = notes.filter(n => n.pinned).slice(0, 4);
  const recentNotes = notes.slice(0, 4);

  // Check for Web Speech API on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
  }, []);

  // Toggle speech recognition
  const toggleSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      // Stop
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
      return;
    }

    // Start
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuickCaptureText(prev => prev ? prev + ' ' + transcript : transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Add a tag to Quick Capture draft
  const handleAddTag = useCallback((e) => {
    if (e) e.preventDefault();
    const trimmed = tagInputText.trim().replace(/^#+/, '').trim();
    if (!trimmed) return;
    if (!quickCaptureTags.includes(trimmed)) {
      setQuickCaptureTags(prev => [...prev, trimmed]);
    }
    setTagInputText('');
  }, [tagInputText, quickCaptureTags]);

  // Remove a tag from draft
  const removeTag = useCallback((tag) => {
    setQuickCaptureTags(prev => prev.filter(t => t !== tag));
  }, []);

  // Clear the Quick Capture draft completely
  const handleClearDraft = useCallback((e) => {
    if (e) e.preventDefault();
    setQuickCaptureText('');
    setQuickCaptureTags([]);
    setTagInputText('');
    setShowTagInput(false);
    setSaveError('');
    // Stop speech recognition if active
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, []);

  // Submit Quick Capture — creates a real note in Supabase via App.jsx handler
  const handleQuickCaptureSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!quickCaptureText.trim() || isSaving) return;

    setSaveError('');
    setIsSaving(true);

    try {
      await createNoteWithContent({
        content: quickCaptureText.trim()
      });
      // Clear the draft on success
      setQuickCaptureText('');
      setQuickCaptureTags([]);
      setTagInputText('');
      setShowTagInput(false);
    } catch (err) {
      console.error('Failed to save Quick Capture note:', err);
      setSaveError('Could not save note. Please try again.');
      onNotify('error', 'Could not save your note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [quickCaptureText, quickCaptureTags, isSaving, createNoteWithContent]);

  // Allow Ctrl+Enter to submit
  const handleTextareaKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleQuickCaptureSubmit(e);
    }
  }, [handleQuickCaptureSubmit]);

  const micBtnBase = `p-1.5 rounded-full transition-all cursor-pointer ${
    isDarkTheme ? 'hover:bg-[#202c25]' : 'hover:bg-[#eae3d0]'
  }`;
  const micActiveClass = isListening
    ? 'text-red-400 animate-pulse'
    : isDarkTheme ? 'text-[#829087] hover:text-[#6f9b7f]' : 'text-[#738276] hover:text-[#1b3b2b]';

  return (
    <div className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto space-y-5 sm:space-y-8 w-full max-w-[1600px] mx-auto min-w-0">
      {/* Quick Capture Input Bar */}
      <div className={`border rounded-2xl p-3 sm:p-4 shadow-sm transition-all min-w-0 ${
        isDarkTheme 
          ? 'bg-[#1b251f] border-[#344239] hover:border-[#405247]' 
          : 'bg-[#f2ece0] border-[#e3dac8] hover:border-[#d4c8b2]'
      }`}>
        <form onSubmit={handleQuickCaptureSubmit} className="flex flex-col gap-2.5 sm:gap-3">

          {/* Active tags display */}
          {quickCaptureTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {quickCaptureTags.map(tag => (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    isDarkTheme ? 'bg-[#202c25] text-[#6f9b7f] border border-[#344239]' : 'bg-[#e8e0cb] text-[#1b3b2b] border border-[#d4c8b2]'
                  }`}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="opacity-60 hover:opacity-100 cursor-pointer"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag input row (shown when tag button is clicked) */}
          {showTagInput && (
            <div className={`flex items-center gap-2 border rounded-xl px-2.5 py-1.5 ${
              isDarkTheme ? 'border-[#344239] bg-[#202c25]' : 'border-[#d4c8b2] bg-[#ede8d9]'
            }`}>
              <Tag className={`w-3.5 h-3.5 shrink-0 ${isDarkTheme ? 'text-[#6f9b7f]' : 'text-[#1b3b2b]'}`} />
              <input
                ref={tagInputRef}
                type="text"
                value={tagInputText}
                onChange={(e) => setTagInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }
                  if (e.key === 'Escape') { setShowTagInput(false); setTagInputText(''); }
                }}
                placeholder="Add tag, press Enter..."
                className={`flex-1 bg-transparent text-xs outline-none ${
                  isDarkTheme ? 'text-[#e7e1d5] placeholder-[#829087]' : 'text-[#2c3830] placeholder-[#8a988d]'
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddTag}
                className={`text-[11px] font-semibold cursor-pointer ${isDarkTheme ? 'text-[#6f9b7f]' : 'text-[#1b3b2b]'}`}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => { setShowTagInput(false); setTagInputText(''); }}
                className={`p-0.5 cursor-pointer ${isDarkTheme ? 'text-[#829087]' : 'text-[#8a988d]'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Listening indicator */}
          {isListening && (
            <div className={`text-[11px] font-medium flex items-center gap-1.5 ${isDarkTheme ? 'text-red-400' : 'text-red-500'}`}>
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse inline-block" />
              Listening... speak now
            </div>
          )}

          <textarea
            value={quickCaptureText}
            onChange={(e) => setQuickCaptureText(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder="Quick capture... (Ctrl+Enter to save)"
            rows={2}
            className={`w-full bg-transparent resize-none outline-none text-xs sm:text-sm font-outfit ${
              isDarkTheme ? 'text-[#e7e1d5] placeholder-[#829087]' : 'text-[#2c3830] placeholder-[#8a988d]'
            }`}
          />

          {/* Error message */}
          {saveError && (
            <p className="text-[11px] text-red-500 font-medium">{saveError}</p>
          )}

          <div className={`flex items-center justify-between border-t pt-2.5 sm:pt-3 flex-wrap gap-2 ${
            isDarkTheme ? 'border-[#344239]' : 'border-[#e2d8c3]'
          }`}>
            <div className={`flex items-center gap-1 sm:gap-2 ${isDarkTheme ? 'text-[#829087]' : 'text-[#738276]'}`}>

              {/* Tag button */}
              <button
                type="button"
                onClick={() => {
                  setShowTagInput(v => !v);
                  if (!showTagInput) {
                    setTimeout(() => tagInputRef.current?.focus(), 50);
                  }
                }}
                className={`${micBtnBase} ${
                  showTagInput
                    ? (isDarkTheme ? 'text-[#6f9b7f]' : 'text-[#1b3b2b]')
                    : (isDarkTheme ? 'text-[#829087] hover:text-[#6f9b7f]' : 'text-[#738276] hover:text-[#1b3b2b]')
                }`}
                title="Add tag"
                aria-label="Add tag"
              >
                <Tag className="w-4 h-4" />
              </button>

              {/* Microphone button */}
              {speechSupported ? (
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`${micBtnBase} ${micActiveClass}`}
                  title={isListening ? 'Stop listening' : 'Voice capture'}
                  aria-label={isListening ? 'Stop listening' : 'Start voice capture'}
                >
                  <Mic className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="p-1.5 rounded-full opacity-30 cursor-not-allowed"
                  title="Speech recognition not supported in this browser"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}

              {/* Trash / clear draft button */}
              <button 
                type="button" 
                onClick={handleClearDraft}
                className={`${micBtnBase} ${isDarkTheme ? 'text-[#829087] hover:text-red-400' : 'text-[#738276] hover:text-red-500'}`}
                title="Clear draft"
                aria-label="Clear Quick Capture draft"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            {/* Submit / right microphone button */}
            <button 
              type="submit" 
              disabled={!quickCaptureText.trim() || isSaving}
              className={`p-2 rounded-full transition-all cursor-pointer shrink-0 ml-auto flex items-center gap-1.5 ${
                isSaving
                  ? 'bg-[#1b3b2b]/50 text-[#f8f5ee]/50 cursor-not-allowed'
                  : isListening
                    ? 'bg-red-500 text-white animate-pulse hover:bg-red-600'
                    : 'bg-[#1b3b2b] text-[#f8f5ee] disabled:opacity-40 hover:bg-[#284f3b]'
              }`}
              title={isSaving ? 'Saving...' : isListening ? 'Stop & Save' : 'Save note'}
              aria-label={isSaving ? 'Saving...' : 'Save Quick Capture note'}
              onClick={isListening ? (e) => { e.preventDefault(); toggleSpeechRecognition(); } : undefined}
            >
              <Mic className="w-4 h-4" />
              {isSaving && <span className="text-[10px] hidden sm:inline">Saving...</span>}
            </button>
          </div>
        </form>
      </div>

      {/* Pinned Notes Section */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
            isDarkTheme ? 'text-[#aeb8ae]' : 'text-[#738276]'
          }`}>
            <span>📌 Pinned</span>
          </h3>
          <button 
            onClick={() => setActiveTab('notes')}
            className={`text-xs font-medium flex items-center gap-1 cursor-pointer ${
              isDarkTheme ? 'text-[#aeb8ae] hover:text-[#6f9b7f]' : 'text-[#526156] hover:text-[#1b3b2b]'
            }`}
          >
            <span>View all</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="pinned-grid-autofit">
          {pinnedNotes.map((note) => {
            return (
              <div 
                key={note.id}
                onClick={() => openNote(note.id)}
                className={`group relative border rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 transition-all cursor-pointer flex flex-col justify-between min-h-[130px] sm:min-h-[140px] min-w-0 ${
                  isDarkTheme 
                    ? 'bg-[#1d2821] hover:bg-[#243129] border-[#34463a] hover:border-[#405247] hover:shadow-md' 
                    : 'border-[#e5dcce] hover:border-[#cbbf9f] hover:shadow-md'
                }`}
                style={{ backgroundColor: isDarkTheme ? undefined : (note.color || '#f5f0e4') }}
              >
                {/* Bookmark tab */}
                <div 
                  className="absolute top-0 right-3 sm:right-4 w-3 h-5 sm:w-3.5 sm:h-6 rounded-b-sm shadow-xs"
                  style={{ backgroundColor: note.bookmarkColor || '#c89f65' }}
                />

                <div className="space-y-1.5 sm:space-y-2 pr-2.5 sm:pr-4 min-w-0">
                  <h4 className={`font-serif-title font-semibold text-xs sm:text-sm lg:text-base transition-colors truncate ${
                    isDarkTheme ? 'text-[#e7e1d5] group-hover:text-[#6f9b7f]' : 'text-[#2c3830] group-hover:text-[#1b3b2b]'
                  }`}>
                    {note.title}
                  </h4>
                  {isChecklistNote(note.content) ? (
                    <ChecklistPreview
                      content={note.content}
                      className="max-h-[4.5rem] overflow-y-auto pr-1"
                    />
                  ) : (
                    <p className={`text-[11px] sm:text-xs line-clamp-2 leading-relaxed break-words ${
                      isDarkTheme ? 'text-[#aeb8ae]' : 'text-[#6e7d71]'
                    }`}>
                      {/* Strip HTML tags for preview */}
                      {note.content ? note.content.replace(/<[^>]*>/g, '') : ''}
                    </p>
                  )}
                </div>

                <div className={`text-[10px] sm:text-[11px] pt-2 sm:pt-3 mt-2 border-t flex items-center justify-between ${
                  isDarkTheme ? 'text-[#829087] border-[#34463a]' : 'text-[#8a988d] border-[#e2d8c3]/60'
                }`}>
                  <span>{note.updatedAt}</span>
                </div>
              </div>
            );
          })}

          {/* Plus Add Note Card */}
          <div 
            onClick={() => createNewNote()}
            className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-3 sm:p-5 transition-all cursor-pointer flex items-center justify-center min-h-[130px] sm:min-h-[140px] group ${
              isDarkTheme 
                ? 'border-[#34463a] hover:border-[#6f9b7f] hover:bg-[#243129] text-[#829087] hover:text-[#e7e1d5]' 
                : 'border-[#dbd1ba] hover:border-[#1b3b2b] hover:bg-[#f3edd9]/50 text-[#8a988d] hover:text-[#1b3b2b]'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Plus className="w-5 sm:w-6 h-5 sm:h-6 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] sm:text-xs font-medium">New note</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Grid: Recent Notes and Inspiration Quote */}
      <div className="dashboard-bottom-grid min-w-0">
        {/* Recent Notes List */}
        <div className={`border rounded-2xl p-4 sm:p-5 space-y-4 ${
          isDarkTheme ? 'bg-[#1d2821] border-[#34463a]' : 'bg-[#f5f0e4] border-[#e5dcce]'
        }`}>
          <h3 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
            isDarkTheme ? 'text-[#aeb8ae]' : 'text-[#738276]'
          }`}>
            <span>≡ Recent Notes</span>
          </h3>

          <div className="space-y-2.5">
            {recentNotes.map((note) => (
              <div 
                key={note.id}
                onClick={() => openNote(note.id)}
                className={`p-2 sm:p-2.5 rounded-xl transition-colors cursor-pointer group flex items-start gap-2.5 min-w-0 ${
                  isDarkTheme ? 'hover:bg-[#243129]' : 'hover:bg-[#ebd3bd]/40'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 group-hover:scale-125 transition-transform ${
                  isDarkTheme ? 'bg-[#6f9b7f]' : 'bg-[#1b3b2b]'
                }`} />
                <div className="flex-1 min-w-0">
                  <h5 className={`font-medium text-xs truncate ${
                    isDarkTheme ? 'text-[#e7e1d5] group-hover:text-[#6f9b7f]' : 'text-[#2c3830] group-hover:text-[#1b3b2b]'
                  }`}>
                    {note.title}
                  </h5>
                  <span className={`text-[10px] block mt-0.5 ${isDarkTheme ? 'text-[#829087]' : 'text-[#8a988d]'}`}>
                    {note.updatedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inspiration Quote Card with Watercolor Aesthetic */}
        <div className={`relative overflow-hidden border rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs min-h-[160px] ${
          isDarkTheme 
            ? 'bg-gradient-to-br from-[#1b251f] via-[#1d2821] to-[#16221a] border-[#34463a]' 
            : 'bg-gradient-to-br from-[#f2edd8] via-[#e8e0cc] to-[#ded5be] border-[#e0d6bd]'
        }`}>
          {/* Soft mountain watercolor image background */}
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-bottom mix-blend-multiply pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80')`
            }}
          />

          <div className="relative z-10 space-y-3">
            <span className={`text-3xl sm:text-4xl font-serif leading-none block ${isDarkTheme ? 'text-[#6f9b7f]/30' : 'text-[#1b3b2b]/30'}`}>"</span>
            <p className={`font-serif-title italic text-base sm:text-lg leading-relaxed ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#253229]'}`}>
              The quieter you become, the more you can hear.
            </p>
          </div>

          <div className={`relative z-10 pt-3 text-xs font-medium border-t ${isDarkTheme ? 'text-[#aeb8ae] border-[#34463a]' : 'text-[#6e7d71] border-[#1b3b2b]/10'}`}>
            — Ram Dass
          </div>
        </div>
      </div>
    </div>
  );
};
