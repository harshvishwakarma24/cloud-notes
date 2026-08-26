import React, { useState } from 'react';
import { Search, X, FileText } from 'lucide-react';

export const SearchModal = ({
  isOpen = false,
  onClose = () => {},
  notes = [],
  openNote = () => {},
  searchSuggestions = []
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredNotes = query.trim() 
    ? notes.filter(n => 
        n.title.toLowerCase().includes(query.toLowerCase()) || 
        n.content.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const recentNotes = notes.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#f8f5ee] border border-[#e2d8be] rounded-3xl overflow-hidden shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#1b3b2b] text-[#f8f5ee] px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
          <span className="font-serif-title text-sm font-medium tracking-wide">Search</span>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#284f3b] transition-colors cursor-pointer text-[#d5e0d8]"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Field */}
        <div className="p-4 sm:p-5 border-b border-[#e5dcce] shrink-0">
          <div className="relative flex items-center bg-[#f2ece0] border border-[#e2d8be] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-inner">
            <Search className="w-4 h-4 text-[#738276] mr-2.5 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full bg-transparent text-xs sm:text-sm text-[#2c3830] outline-none font-outfit placeholder-[#8a988d]"
            />
            {query && (
              <button 
                onClick={() => setQuery('')} 
                className="p-1 text-[#8a988d] hover:text-[#1b3b2b] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {query.trim() ? (
            /* Search Results */
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <div className="text-xs font-semibold text-[#738276] uppercase tracking-wider mb-2">
                Results ({filteredNotes.length})
              </div>
              {filteredNotes.length === 0 ? (
                <p className="text-xs text-[#8a988d] py-6 text-center">No matching notes found.</p>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => {
                      openNote(note.id);
                      onClose();
                    }}
                    className="p-3 bg-[#f2ece0] hover:bg-[#eae2ce] border border-[#e2d8be] rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <h5 className="font-serif-title font-semibold text-xs sm:text-sm text-[#2c3830] truncate">{note.title}</h5>
                      <p className="text-xs text-[#6e7d71] line-clamp-1 mt-0.5">{note.content}</p>
                    </div>
                    <span className="text-[10px] text-[#8a988d] shrink-0">{note.updatedAt}</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Recent & Suggestions Columns (Matching Screen 4) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent Searches */}
              <div className="bg-[#f2ece0] p-3.5 sm:p-4 rounded-2xl border border-[#e2d8be] space-y-3">
                <div className="text-[11px] font-semibold text-[#738276] uppercase tracking-wider">
                  Recent
                </div>
                <div className="space-y-2">
                  {recentNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => {
                        openNote(note.id);
                        onClose();
                      }}
                      className="p-2.5 bg-[#f8f5ee] hover:bg-[#eee7d8] rounded-xl border border-[#e2d8be] transition-colors cursor-pointer flex items-center gap-2.5 min-w-0"
                    >
                      <div className="p-1.5 rounded-lg bg-[#e8decb] text-[#1b3b2b] shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h6 className="font-medium text-xs text-[#2c3830] truncate">{note.title}</h6>
                        <span className="text-[10px] text-[#8a988d] block">{note.updatedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions Tags */}
              <div className="bg-[#f2ece0] p-3.5 sm:p-4 rounded-2xl border border-[#e2d8be] space-y-3">
                <div className="text-[11px] font-semibold text-[#738276] uppercase tracking-wider">
                  Suggestions
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {searchSuggestions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#f8f5ee] hover:bg-[#e8decb] border border-[#e2d8be] rounded-full text-xs text-[#2c3830] transition-all cursor-pointer shadow-2xs font-medium"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
