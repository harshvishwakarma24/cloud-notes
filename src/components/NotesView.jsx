import React, { useState } from 'react';
import {
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  Pin,
  Star,
  Trash2,
  BookOpen,
  Archive,
  ArchiveRestore,
  RotateCcw
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

export const NotesView = ({
  notes = [],
  openNote = () => {},
  createNewNote = () => {},
  deleteNote = () => {},
  togglePin = () => {},
  toggleFavorite = () => {},
  toggleArchive = () => {},
  restoreNote = () => {},
  permanentDeleteNote = () => {},
  viewTitle = 'All Notes',
  isArchiveView = false,
  isTrashView = false,
  isLoading = false,
  isDarkTheme = false
}) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();

    const matchesTitle =
      note.title &&
      note.title.toLowerCase().includes(query);

    const matchesContent =
      note.content &&
      note.content.toLowerCase().includes(query);

    const matchesTags =
      note.tags &&
      note.tags.some((t) =>
        t.toLowerCase().includes(query)
      );

    return matchesTitle || matchesContent || matchesTags;
  });

  const getEmptyMessage = () => {
    if (isTrashView) {
      return {
        title: 'Trash is empty',
        subtitle: 'Discarded notes will remain here for 30 days before permanent clearance.'
      };
    }
    if (isArchiveView) {
      return {
        title: 'Archive is empty',
        subtitle: 'Archive notes to store them safely out of your main workspace.'
      };
    }
    if (viewTitle === 'Favorites') {
      return {
        title: 'No favorite notes',
        subtitle: 'Star important notes to quickly access them in your favorites.'
      };
    }
    if (viewTitle === 'Pinned Notes') {
      return {
        title: 'No pinned notes',
        subtitle: 'Pin notes to keep them at the top of your home screen.'
      };
    }
    return {
      title: 'No notes found',
      subtitle: 'Try a different search or create a new note to begin.'
    };
  };

  const emptyInfo = getEmptyMessage();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent min-w-0">

      {/* Top Header Filter & Search Toolbar */}
      <div
        className={`p-4 sm:p-6 border-b space-y-3 shrink-0 backdrop-blur-xs ${
          isDarkTheme
            ? 'bg-[#1b251f]/90 border-[#344239]'
            : 'bg-[#f8f5ee]/90 border-[#e5dcce]/70'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

          {/* Title & Count */}
          <div className="flex items-center gap-3">
            <h2
              className={`font-serif-title text-lg sm:text-xl font-bold ${
                isDarkTheme
                  ? 'text-[#e7e1d5]'
                  : 'text-[#2c3830]'
              }`}
            >
              {viewTitle}
            </h2>

            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                isDarkTheme
                  ? 'bg-[#202c25] text-[#aeb8ae]'
                  : 'bg-[#ede5d5] text-[#738276]'
              }`}
            >
              {filteredNotes.length}{' '}
              {filteredNotes.length === 1 ? 'note' : 'notes'}
            </span>
          </div>

          {/* Search Input, View Toggle & New Note */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:justify-end">

            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs min-w-[160px]">
              <Search
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  isDarkTheme
                    ? 'text-[#829087]'
                    : 'text-[#8a988d]'
                }`}
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className={`w-full rounded-full pl-9 pr-4 py-2 text-xs outline-none transition-all ${
                  isDarkTheme
                    ? 'bg-[#202c25] border border-[#344239] text-[#e7e1d5] placeholder-[#829087] focus:border-[#405247]'
                    : 'bg-[#ede5d5] border border-[#ded4bf] text-[#2c3830] placeholder-[#8a988d] focus:border-[#1b3b2b]'
                }`}
              />
            </div>

            {/* View Toggle */}
            <div
              className={`flex items-center p-0.5 rounded-xl border shrink-0 ${
                isDarkTheme
                  ? 'bg-[#202c25] border-[#344239]'
                  : 'bg-[#ede5d5] border-[#ded4bf]'
              }`}
            >
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#1b3b2b] text-[#f8f5ee] shadow-xs'
                    : isDarkTheme
                      ? 'text-[#829087] hover:text-[#e7e1d5]'
                      : 'text-[#738276] hover:text-[#1b3b2b]'
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#1b3b2b] text-[#f8f5ee] shadow-xs'
                    : isDarkTheme
                      ? 'text-[#829087] hover:text-[#e7e1d5]'
                      : 'text-[#738276] hover:text-[#1b3b2b]'
                }`}
                title="List view"
                aria-label="List view"
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* New Note Button (Hidden in Trash) */}
            {!isTrashView && (
              <button
                type="button"
                onClick={createNewNote}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1b3b2b] hover:bg-[#284f3b] text-[#f8f5ee] rounded-full text-xs font-medium transition-all shadow-xs cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">New note</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notes Grid / List View */}
      <div className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto min-w-0 max-w-[1600px] mx-auto w-full">

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
            <div className={`w-8 h-8 border-2 ${isDarkTheme ? 'border-[#6f9b7f]/20 border-t-[#6f9b7f]' : 'border-[#1b3b2b]/20 border-t-[#1b3b2b]'} rounded-full animate-spin`} />
            <p className={`text-xs ${isDarkTheme ? 'text-[#829087]' : 'text-[#8a988d]'}`}>Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
            <BookOpen
              className={`w-10 h-10 ${
                isDarkTheme
                  ? 'text-[#6f9b7f]'
                  : 'text-[#a3b8aa]'
              }`}
            />

            <div>
              <p
                className={`font-medium text-sm ${
                  isDarkTheme
                    ? 'text-[#e7e1d5]'
                    : 'text-[#2c3830]'
                }`}
              >
                {emptyInfo.title}
              </p>

              <p
                className={`text-xs mt-0.5 max-w-sm ${
                  isDarkTheme
                    ? 'text-[#829087]'
                    : 'text-[#8a988d]'
                }`}
              >
                {emptyInfo.subtitle}
              </p>
            </div>

            {!isTrashView && !isArchiveView && (
              <button
                type="button"
                onClick={createNewNote}
                className="px-4 py-2 bg-[#1b3b2b] text-[#f8f5ee] rounded-full text-xs font-medium cursor-pointer"
              >
                Create note
              </button>
            )}
          </div>

        ) : viewMode === 'grid' ? (

          /* =========================
             GRID VIEW
             ========================= */
          <div className="notes-grid-autofit">
            {filteredNotes.map((note) => {
              return (
                <div
                  key={note.id}
                  onClick={() => !isTrashView && openNote(note.id)}
                  className={`group relative border rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] sm:min-h-[160px] min-w-0 ${
                    isDarkTheme
                      ? 'bg-[#1d2821] hover:bg-[#243129] border-[#34463a] hover:border-[#405247] hover:shadow-md'
                      : 'border-[#e5dcce] hover:border-[#cbbf9f] hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: isDarkTheme
                      ? undefined
                      : (note.color || '#f5f0e4')
                  }}
                >

                  {/* Bookmark tab */}
                  <div
                    className="absolute top-0 right-3 sm:right-4 w-3 h-5 sm:w-3.5 sm:h-6 rounded-b-sm shadow-xs"
                    style={{
                      backgroundColor:
                        note.bookmarkColor || '#c89f65'
                    }}
                  />

                  <div className="space-y-1.5 sm:space-y-2 pr-2.5 sm:pr-3 min-w-0">

                    <h4
                      className={`font-serif-title font-semibold text-xs sm:text-sm lg:text-base transition-colors truncate ${
                        isDarkTheme
                          ? 'text-[#e7e1d5] group-hover:text-[#6f9b7f]'
                          : 'text-[#2c3830] group-hover:text-[#1b3b2b]'
                      }`}
                    >
                      {note.title || 'Untitled Note'}
                    </h4>

                    {isChecklistNote(note.content) ? (
                      <ChecklistPreview
                        content={note.content}
                        className="max-h-[4.5rem] overflow-y-auto pr-1"
                      />
                    ) : (
                      <p
                        className={`text-[11px] sm:text-xs line-clamp-3 leading-relaxed break-words ${
                          isDarkTheme
                            ? 'text-[#aeb8ae]'
                            : 'text-[#6e7d71]'
                        }`}
                      >
                        {(note.content || '').replace(/<[^>]*>/g, '').trim()}
                      </p>
                    )}
                  </div>

                  {/* Bottom Actions */}
                  <div
                    className={`text-[10px] sm:text-[11px] pt-2 sm:pt-3 mt-2 sm:mt-3 border-t flex items-center justify-between ${
                      isDarkTheme
                        ? 'text-[#829087] border-[#34463a]'
                        : 'text-[#8a988d] border-[#e2d8c3]/60'
                    }`}
                  >
                    <span className="truncate mr-1">
                      {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'Recently'}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">

                      {isTrashView ? (
                        <>
                          {/* Restore from Trash */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              restoreNote(note.id);
                            }}
                            className={`p-1 rounded-md cursor-pointer ${
                              isDarkTheme
                                ? 'text-[#829087] hover:text-[#6f9b7f] hover:bg-[#243129]'
                                : 'text-[#738276] hover:text-[#1b3b2b] hover:bg-[#ebd3bd]/40'
                            }`}
                            title="Restore note"
                            aria-label="Restore note"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          {/* Permanent Delete */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              permanentDeleteNote(note.id);
                            }}
                            className={`p-1 rounded-md cursor-pointer ${
                              isDarkTheme
                                ? 'text-[#829087] hover:text-[#e57373] hover:bg-[#243129]'
                                : 'text-[#738276] hover:text-[#b24838] hover:bg-[#ebd3bd]/40'
                            }`}
                            title="Permanently delete"
                            aria-label="Permanently delete note"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </>
                      ) : isArchiveView ? (
                        <>
                          {/* Unarchive / Restore */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleArchive(note.id);
                            }}
                            className={`p-1 rounded-md cursor-pointer ${
                              isDarkTheme
                                ? 'text-[#829087] hover:text-[#6f9b7f] hover:bg-[#243129]'
                                : 'text-[#738276] hover:text-[#1b3b2b] hover:bg-[#ebd3bd]/40'
                            }`}
                            title="Unarchive note"
                            aria-label="Unarchive note"
                          >
                            <ArchiveRestore className="w-3.5 h-3.5" />
                          </button>

                          {/* Move to Trash */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            }}
                            className={`p-1 rounded-md cursor-pointer ${
                              isDarkTheme
                                ? 'text-[#829087] hover:text-[#e57373] hover:bg-[#243129]'
                                : 'text-[#738276] hover:text-[#b24838] hover:bg-[#ebd3bd]/40'
                            }`}
                            title="Move to trash"
                            aria-label="Move note to trash"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Favorite */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(note.id);
                            }}
                            className={`p-1 rounded-md cursor-pointer ${
                              isDarkTheme
                                ? 'text-[#829087] hover:text-[#e2c275] hover:bg-[#243129]'
                                : 'text-[#738276] hover:text-[#1b3b2b] hover:bg-[#ebd3bd]/40'
                            }`}
                            title={
                              note.isFavorite
                                ? 'Remove from favorites'
                                : 'Add to favorites'
                            }
                            aria-label={
                              note.isFavorite
                                ? 'Remove from favorites'
                                : 'Add to favorites'
                            }
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                note.isFavorite
                                  ? isDarkTheme
                                    ? 'fill-[#e2c275] text-[#e2c275]'
                                    : 'fill-[#1b3b2b] text-[#1b3b2b]'
                                  : ''
                              }`}
                            />
                          </button>

                          {/* Pin */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePin(note.id);
                            }}
                            className={`p-1 rounded-md cursor-pointer ${
                              isDarkTheme
                                ? 'text-[#829087] hover:text-[#e7e1d5] hover:bg-[#243129]'
                                : 'text-[#738276] hover:text-[#1b3b2b] hover:bg-[#ebd3bd]/40'
                            }`}
                            title={note.pinned ? 'Unpin' : 'Pin'}
                            aria-label={note.pinned ? 'Unpin' : 'Pin'}
                          >
                            <Pin
                              className={`w-3.5 h-3.5 ${
                                note.pinned
                                  ? isDarkTheme
                                    ? 'fill-[#6f9b7f] text-[#6f9b7f]'
                                    : 'fill-[#1b3b2b] text-[#1b3b2b]'
                                  : ''
                              }`}
                            />
                          </button>

                          {/* Archive */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleArchive(note.id);
                            }}
                            className={`p-1 rounded-md cursor-pointer ${
                              isDarkTheme
                                ? 'text-[#829087] hover:text-[#e7e1d5] hover:bg-[#243129]'
                                : 'text-[#738276] hover:text-[#1b3b2b] hover:bg-[#ebd3bd]/40'
                            }`}
                            title="Archive note"
                            aria-label="Archive note"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>

                          {/* Move to Trash */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            }}
                            className={`p-1 rounded-md cursor-pointer ${
                              isDarkTheme
                                ? 'text-[#829087] hover:text-[#e57373] hover:bg-[#243129]'
                                : 'text-[#738276] hover:text-[#b24838] hover:bg-[#ebd3bd]/40'
                            }`}
                            title="Move to trash"
                            aria-label="Move note to trash"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        ) : (

          /* =========================
             LIST VIEW
             ========================= */
          <div className="space-y-2.5 max-w-5xl">
            {filteredNotes.map((note) => {
              return (
                <div
                  key={note.id}
                  onClick={() => !isTrashView && openNote(note.id)}
                  className={`border rounded-xl p-3 sm:p-4 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 min-w-0 ${
                    isDarkTheme
                      ? 'bg-[#1d2821] hover:bg-[#243129] border-[#34463a] hover:border-[#405247] hover:shadow-xs'
                      : 'border-[#e5dcce] hover:border-[#cbbf9f] hover:shadow-xs'
                  }`}
                  style={{
                    backgroundColor: isDarkTheme
                      ? undefined
                      : (note.color || '#f5f0e4')
                  }}
                >

                  <div className="flex items-center gap-3 min-w-0">

                    <div
                      className="w-2.5 h-8 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          note.bookmarkColor || '#c89f65'
                      }}
                    />

                    <div className="min-w-0">
                      <h4
                        className={`font-serif-title font-semibold text-sm truncate ${
                          isDarkTheme
                            ? 'text-[#e7e1d5]'
                            : 'text-[#2c3830]'
                        }`}
                      >
                        {note.title || 'Untitled Note'}
                      </h4>

                      {isChecklistNote(note.content) ? (
                        <ChecklistPreview
                          content={note.content}
                          className="h-5 max-w-xl overflow-y-auto"
                        />
                      ) : (
                        <p
                          className={`text-xs truncate max-w-xl ${
                            isDarkTheme
                              ? 'text-[#aeb8ae]'
                              : 'text-[#6e7d71]'
                          }`}
                        >
                          {(note.content || '').replace(/<[^>]*>/g, '').trim()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex items-center justify-between sm:justify-end gap-3 text-xs shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 ${
                      isDarkTheme
                        ? 'text-[#829087] border-[#34463a]'
                        : 'text-[#8a988d] border-[#e2d8c3]/40'
                    }`}
                  >

                    <span>
                      {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'Recently'}
                    </span>

                    <div className="flex items-center gap-1">

                      {isTrashView ? (
                        <>
                          {/* Restore from Trash */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              restoreNote(note.id);
                            }}
                            className={`p-1.5 cursor-pointer ${
                              isDarkTheme ? 'text-[#829087] hover:text-[#6f9b7f]' : 'text-[#738276] hover:text-[#1b3b2b]'
                            }`}
                            title="Restore note"
                            aria-label="Restore note"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          {/* Permanent Delete */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              permanentDeleteNote(note.id);
                            }}
                            className={`p-1.5 cursor-pointer ${
                              isDarkTheme ? 'text-[#829087] hover:text-[#e57373]' : 'text-[#738276] hover:text-[#b24838]'
                            }`}
                            title="Permanently delete"
                            aria-label="Permanently delete note"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </>
                      ) : isArchiveView ? (
                        <>
                          {/* Unarchive / Restore */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleArchive(note.id);
                            }}
                            className={`p-1.5 cursor-pointer ${
                              isDarkTheme ? 'text-[#829087] hover:text-[#6f9b7f]' : 'text-[#738276] hover:text-[#1b3b2b]'
                            }`}
                            title="Unarchive note"
                            aria-label="Unarchive note"
                          >
                            <ArchiveRestore className="w-3.5 h-3.5" />
                          </button>

                          {/* Move to Trash */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            }}
                            className={`p-1.5 cursor-pointer ${
                              isDarkTheme ? 'text-[#829087] hover:text-[#e57373]' : 'text-[#738276] hover:text-[#b24838]'
                            }`}
                            title="Move to trash"
                            aria-label="Move note to trash"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Favorite */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(note.id);
                            }}
                            className={`p-1.5 cursor-pointer ${
                              isDarkTheme
                                ? 'text-[#829087] hover:text-[#e2c275]'
                                : 'text-[#738276] hover:text-[#1b3b2b]'
                            }`}
                            title={
                              note.isFavorite
                                ? 'Remove from favorites'
                                : 'Add to favorites'
                            }
                            aria-label={
                              note.isFavorite
                                ? 'Remove from favorites'
                                : 'Add to favorites'
                            }
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                note.isFavorite
                                  ? isDarkTheme
                                    ? 'fill-[#e2c275] text-[#e2c275]'
                                    : 'fill-[#1b3b2b] text-[#1b3b2b]'
                                  : ''
                              }`}
                            />
                          </button>

                          {/* Pin */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePin(note.id);
                            }}
                            className={`p-1.5 cursor-pointer ${
                              isDarkTheme
                                ? 'text-[#829087] hover:text-[#e7e1d5]'
                                : 'text-[#738276] hover:text-[#1b3b2b]'
                            }`}
                            title={note.pinned ? 'Unpin' : 'Pin'}
                            aria-label={note.pinned ? 'Unpin' : 'Pin'}
                          >
                            <Pin
                              className={`w-3.5 h-3.5 ${
                                note.pinned
                                  ? isDarkTheme
                                    ? 'fill-[#6f9b7f] text-[#6f9b7f]'
                                    : 'fill-[#1b3b2b] text-[#1b3b2b]'
                                  : ''
                              }`}
                            />
                          </button>

                          {/* Archive */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleArchive(note.id);
                            }}
                            className={`p-1.5 cursor-pointer ${
                              isDarkTheme
                                ? 'text-[#829087] hover:text-[#e7e1d5]'
                                : 'text-[#738276] hover:text-[#1b3b2b]'
                            }`}
                            title="Archive note"
                            aria-label="Archive note"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>

                          {/* Move to Trash */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            }}
                            className={`p-1.5 cursor-pointer ${
                              isDarkTheme
                                ? 'text-[#829087] hover:text-[#e57373]'
                                : 'text-[#738276] hover:text-[#b24838]'
                            }`}
                            title="Move to trash"
                            aria-label="Move note to trash"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};