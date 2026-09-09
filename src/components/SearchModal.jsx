import React, { useState } from 'react';
import { Search, X, FileText } from 'lucide-react';

export const SearchModal = ({
  isOpen = false,
  onClose = () => {},
  notes = [],
  openNote = () => {},
  searchSuggestions = [],
  isDarkTheme = false
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className={`border rounded-3xl overflow-hidden shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 ${
          isDarkTheme ? 'bg-[#1b251f] border-[#344239]' : 'bg-[#f8f5ee] border-[#e2d8be]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className={`px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 ${
          isDarkTheme ? 'bg-[#163c2b] text-[#f8f5ee]' : 'bg-[#1b3b2b] text-[#f8f5ee]'
        }`}>
          <span className="font-serif-title text-sm font-medium tracking-wide">Search</span>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full transition-colors cursor-pointer ${
              isDarkTheme ? 'hover:bg-[#1f4e39] text-[#e7e1d5]' : 'hover:bg-[#284f3b] text-[#d5e0d8]'
            }`}
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Field */}
        <div className={`p-4 sm:p-5 border-b shrink-0 ${isDarkTheme ? 'border-[#344239]' : 'border-[#e5dcce]'}`}>
          <div className={`relative flex items-center border rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-inner ${
            isDarkTheme ? 'bg-[#202c25] border-[#344239]' : 'bg-[#f2ece0] border-[#e2d8be]'
          }`}>
            <Search className={`w-4 h-4 mr-2.5 shrink-0 ${isDarkTheme ? 'text-[#829087]' : 'text-[#738276]'}`} />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything..."
              className={`w-full bg-transparent text-xs sm:text-sm outline-none font-outfit ${
                isDarkTheme ? 'text-[#e7e1d5] placeholder-[#829087]' : 'text-[#2c3830] placeholder-[#8a988d]'
              }`}
            />
            {query && (
              <button 
                onClick={() => setQuery('')} 
                className={`p-1 cursor-pointer ${isDarkTheme ? 'text-[#829087] hover:text-[#e7e1d5]' : 'text-[#8a988d] hover:text-[#1b3b2b]'}`}
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
              <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDarkTheme ? 'text-[#829087]' : 'text-[#738276]'
              }`}>
                Results ({filteredNotes.length})
              </div>
              {filteredNotes.length === 0 ? (
                <p className={`text-xs py-6 text-center ${isDarkTheme ? 'text-[#829087]' : 'text-[#8a988d]'}`}>No matching notes found.</p>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => {
                      openNote(note.id);
                      onClose();
                    }}
                    className={`p-3 border rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      isDarkTheme 
                        ? 'bg-[#202c25] hover:bg-[#26332b] border-[#344239]' 
                        : 'bg-[#f2ece0] hover:bg-[#eae2ce] border-[#e2d8be]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <h5 className={`font-serif-title font-semibold text-xs sm:text-sm truncate ${
                        isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'
                      }`}>{note.title}</h5>
                      <p className={`text-xs line-clamp-1 mt-0.5 ${
                        isDarkTheme ? 'text-[#aeb8ae]' : 'text-[#6e7d71]'
                      }`}>{note.content}</p>
                    </div>
                    <span className={`text-[10px] shrink-0 ${isDarkTheme ? 'text-[#829087]' : 'text-[#8a988d]'}`}>{note.updatedAt}</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Recent & Suggestions Columns */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent Searches */}
              <div className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 ${
                isDarkTheme ? 'bg-[#202c25] border-[#344239]' : 'bg-[#f2ece0] border-[#e2d8be]'
              }`}>
                <div className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isDarkTheme ? 'text-[#829087]' : 'text-[#738276]'
                }`}>
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
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-2.5 min-w-0 ${
                        isDarkTheme 
                          ? 'bg-[#26332b] hover:bg-[#344239] border-[#344239]' 
                          : 'bg-[#f8f5ee] hover:bg-[#eee7d8] border-[#e2d8be]'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        isDarkTheme ? 'bg-[#163c2b] text-[#6f9b7f]' : 'bg-[#e8decb] text-[#1b3b2b]'
                      }`}>
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h6 className={`font-medium text-xs truncate ${
                          isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'
                        }`}>{note.title}</h6>
                        <span className={`text-[10px] block ${isDarkTheme ? 'text-[#829087]' : 'text-[#8a988d]'}`}>{note.updatedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions Tags */}
              <div className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 ${
                isDarkTheme ? 'bg-[#202c25] border-[#344239]' : 'bg-[#f2ece0] border-[#e2d8be]'
              }`}>
                <div className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isDarkTheme ? 'text-[#829087]' : 'text-[#738276]'
                }`}>
                  Suggestions
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {searchSuggestions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border rounded-full text-xs transition-all cursor-pointer shadow-2xs font-medium ${
                        isDarkTheme 
                          ? 'bg-[#26332b] hover:bg-[#344239] border-[#344239] text-[#e7e1d5]' 
                          : 'bg-[#f8f5ee] hover:bg-[#e8decb] border-[#e2d8be] text-[#2c3830]'
                      }`}
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
