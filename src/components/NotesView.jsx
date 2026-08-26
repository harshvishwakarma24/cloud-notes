import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List as ListIcon, 
  Tag, 
  Pin, 
  Trash2, 
  Edit3, 
  BookOpen, 
  Check, 
  Folder 
} from 'lucide-react';

export const NotesView = ({
  notes = [],
  openNote = () => {},
  createNewNote = () => {},
  deleteNote = () => {},
  togglePin = () => {},
  selectedSpace = 'All',
  setSelectedSpace = () => {}
}) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const spacesList = ['All', 'Personal', 'College', 'Work', 'Ideas', 'Journal'];

  const filteredNotes = notes.filter((note) => {
    const matchesSpace = selectedSpace === 'All' || note.space === selectedSpace;
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.tags && note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesSpace && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
      {/* Spaces Sub-Sidebar on Desktop / Tablet (md and up) */}
      <aside className="hidden md:flex w-48 lg:w-56 bg-[#f3ede1] border-r border-[#e5dcce] p-4 flex-col justify-between shrink-0 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#738276] flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5" />
              <span>Spaces</span>
            </h3>
            <span className="text-[11px] text-[#8a988d]">{notes.length} total</span>
          </div>

          <div className="space-y-1">
            {spacesList.map((space) => {
              const count = space === 'All' 
                ? notes.length 
                : notes.filter(n => n.space === space).length;

              return (
                <button
                  key={space}
                  onClick={() => setSelectedSpace(space)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedSpace === space
                      ? 'bg-[#1b3b2b] text-[#f8f5ee] shadow-xs'
                      : 'text-[#48564c] hover:bg-[#e8e0ce] hover:text-[#1b3b2b]'
                  }`}
                >
                  <span className="truncate">{space}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedSpace === space ? 'bg-[#284f3b] text-[#e2ebd8]' : 'bg-[#e5dcce] text-[#738276]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Space creation placeholder / tip */}
        <div className="p-3 bg-[#e8e0ce]/60 rounded-xl border border-[#ded4bf] text-[11px] text-[#6e7d71] space-y-1">
          <p className="font-medium text-[#2c3830]">Mindful tip 🌿</p>
          <p className="text-[10px] leading-relaxed">Group related thoughts into dedicated spaces to keep your mental desk clear.</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-transparent min-w-0">
        {/* Top Header Filter & Search Toolbar */}
        <div className="p-4 sm:p-6 border-b border-[#e5dcce]/70 space-y-3 bg-[#f8f5ee]/90 backdrop-blur-xs shrink-0">
          {/* Mobile Horizontal Spaces Chips (Below md) */}
          <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            {spacesList.map((space) => {
              const count = space === 'All' 
                ? notes.length 
                : notes.filter(n => n.space === space).length;
              return (
                <button
                  key={space}
                  onClick={() => setSelectedSpace(space)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedSpace === space
                      ? 'bg-[#1b3b2b] text-[#f8f5ee] shadow-xs'
                      : 'bg-[#ede5d5] text-[#526156] hover:bg-[#e2d8c3]'
                  }`}
                >
                  <span>{space}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 text-[#8a988d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${selectedSpace}...`}
                className="w-full bg-[#ede5d5] border border-[#ded4bf] rounded-full pl-9 pr-4 py-2 text-xs text-[#2c3830] placeholder-[#8a988d] outline-none focus:border-[#1b3b2b] transition-all"
              />
            </div>

            {/* View Toggle & New Note */}
            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
              <div className="flex items-center bg-[#ede5d5] p-0.5 rounded-xl border border-[#ded4bf]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid' ? 'bg-[#1b3b2b] text-[#f8f5ee] shadow-xs' : 'text-[#738276] hover:text-[#1b3b2b]'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'list' ? 'bg-[#1b3b2b] text-[#f8f5ee] shadow-xs' : 'text-[#738276] hover:text-[#1b3b2b]'
                  }`}
                  title="List view"
                >
                  <ListIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={createNewNote}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1b3b2b] hover:bg-[#284f3b] text-[#f8f5ee] rounded-full text-xs font-medium transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New note</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notes Grid / List View */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-w-0">
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-[#a3b8aa]" />
              <div>
                <p className="font-medium text-sm text-[#2c3830]">No notes found</p>
                <p className="text-xs text-[#8a988d] mt-0.5">Try a different search or create a new note in {selectedSpace}.</p>
              </div>
              <button
                onClick={createNewNote}
                className="px-4 py-2 bg-[#1b3b2b] text-[#f8f5ee] rounded-full text-xs font-medium cursor-pointer"
              >
                Create note
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => openNote(note.id)}
                  className="group relative bg-[#f5f0e4] border border-[#e5dcce] rounded-2xl p-4 sm:p-5 hover:border-[#cbbf9f] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[160px] min-w-0"
                  style={{ backgroundColor: note.color || '#f5f0e4' }}
                >
                  {/* Bookmark tab */}
                  <div 
                    className="absolute top-0 right-4 w-3.5 h-6 rounded-b-sm shadow-xs"
                    style={{ backgroundColor: note.bookmarkColor || '#c89f65' }}
                  />

                  <div className="space-y-2 pr-3 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#738276]">
                        {note.space}
                      </span>
                    </div>

                    <h4 className="font-serif-title font-semibold text-sm sm:text-base text-[#2c3830] group-hover:text-[#1b3b2b] transition-colors truncate">
                      {note.title}
                    </h4>

                    <p className="text-xs text-[#6e7d71] line-clamp-3 leading-relaxed break-words">
                      {note.content}
                    </p>
                  </div>

                  <div className="text-[11px] text-[#8a988d] pt-3 mt-3 border-t border-[#e2d8c3]/60 flex items-center justify-between">
                    <span>{note.updatedAt}</span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(note.id);
                        }}
                        className="p-1 text-[#738276] hover:text-[#1b3b2b] rounded-md hover:bg-[#ebd3bd]/40"
                        title={note.pinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin className={`w-3 h-3 ${note.pinned ? 'fill-[#1b3b2b] text-[#1b3b2b]' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-1 text-[#738276] hover:text-[#b24838] rounded-md hover:bg-[#ebd3bd]/40"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5 max-w-5xl">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => openNote(note.id)}
                  className="bg-[#f5f0e4] border border-[#e5dcce] rounded-xl p-3 sm:p-4 hover:border-[#cbbf9f] hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 min-w-0"
                  style={{ backgroundColor: note.color || '#f5f0e4' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-2.5 h-8 rounded-full shrink-0" 
                      style={{ backgroundColor: note.bookmarkColor || '#c89f65' }}
                    />
                    <div className="min-w-0">
                      <h4 className="font-serif-title font-semibold text-sm text-[#2c3830] truncate">
                        {note.title}
                      </h4>
                      <p className="text-xs text-[#6e7d71] truncate max-w-xl">
                        {note.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-[#8a988d] shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#e2d8c3]/40">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e8e0ce] text-[#526156]">
                      {note.space}
                    </span>
                    <span>{note.updatedAt}</span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(note.id);
                        }}
                        className="p-1.5 text-[#738276] hover:text-[#1b3b2b]"
                      >
                        <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-[#1b3b2b] text-[#1b3b2b]' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-1.5 text-[#738276] hover:text-[#b24838]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
