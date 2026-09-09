import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Share2,
  MoreHorizontal,
  Sparkles,
  X,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Heading1,
  Heading2,
  Check,
  Send
} from 'lucide-react';

export const NoteEditor = ({
  note,
  onUpdateNote = () => {},
  onTogglePin = () => {},
  onToggleFavorite = () => {},
  onToggleArchive = () => {},
  onDeleteNote = () => {},
  onNotify = () => {},
  onBack = () => {},
  isDarkTheme = false
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [saveStatus, setSaveStatus] = useState('saved');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [shareNotification, setShareNotification] = useState('');

  // Refs for tracking active note and debounce timer
  const currentNoteIdRef = useRef(null);
  const saveTimerRef = useRef(null);
  const pendingSaveRef = useRef(null);
  const onUpdateNoteRef = useRef(onUpdateNote);
  const editorRef = useRef(null);

  onUpdateNoteRef.current = onUpdateNote;

  const syncChecklistInputs = () => {
    editorRef.current?.querySelectorAll('[data-checklist-item]').forEach((item) => {
      const checkbox = item.querySelector('.checklist-checkbox');
      if (checkbox) {
        checkbox.checked = item.dataset.checked === 'true';
      }
    });
  };

  /*
   * Synchronize local state ONLY when switching to a different note ID.
   * This is critical: parent rerenders while typing will NOT overwrite
   * local title or content, completely preventing cursor jump or focus loss.
   */
  useEffect(() => {
    if (note?.id && note.id !== currentNoteIdRef.current) {
      // Flush the previous note's latest draft before switching notes.
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      if (pendingSaveRef.current) {
        onUpdateNoteRef.current(pendingSaveRef.current);
        pendingSaveRef.current = null;
      }

      currentNoteIdRef.current = note.id;
      setTitle(note.title || '');
      setContent(note.content || '');
      if (editorRef.current) {
        editorRef.current.innerHTML = note.content || '';
        syncChecklistInputs();
      }
      setSaveStatus('saved');
    }
  }, [note?.id]);

  /*
   * Clean up timer on unmount
   */
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      if (pendingSaveRef.current) {
        onUpdateNoteRef.current(pendingSaveRef.current);
      }
    };
  }, []);

  /*
   * Debounced save to Supabase via parent onUpdateNote.
   * Updates after 600ms of typing inactivity.
   */
  const scheduleSave = useCallback((newTitle, newContent) => {
    setSaveStatus('saving');

    const pendingSave = {
      ...note,
      title: newTitle,
      content: newContent
    };
    pendingSaveRef.current = pendingSave;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      onUpdateNote(pendingSave);
      setSaveStatus('saved');
      saveTimerRef.current = null;
      pendingSaveRef.current = null;
    }, 600);
  }, [note, onUpdateNote]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    scheduleSave(newTitle, content);
  };

  const handleContentChange = (e) => {
    const newContent = e.currentTarget.innerHTML;
    setContent(newContent);
    scheduleSave(title, newContent);
  };

  const saveEditorContent = () => {
    if (!editorRef.current) return;
    const newContent = editorRef.current.innerHTML;
    setContent(newContent);
    scheduleSave(title, newContent);
  };

  const focusChecklistText = (item) => {
    const text = item.querySelector('[data-checklist-text]');
    if (!text || !editorRef.current) return;

    const range = document.createRange();
    range.selectNodeContents(text);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    editorRef.current.focus();
  };

  const createChecklistItem = (afterItem = null) => {
    const item = document.createElement('div');
    item.className = 'checklist-item';
    item.dataset.checklistItem = 'true';
    item.dataset.checked = 'false';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checklist-checkbox';
    checkbox.setAttribute('aria-label', 'Toggle checklist item');

    const text = document.createElement('span');
    text.dataset.checklistText = 'true';
    text.contentEditable = 'true';
    text.appendChild(document.createElement('br'));

    item.append(checkbox, text);

    if (afterItem) {
      afterItem.after(item);
    } else {
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      const currentItem = selection?.anchorNode?.parentElement?.closest?.('[data-checklist-item]');
      if (currentItem) {
        currentItem.after(item);
      } else if (range && editorRef.current.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        range.insertNode(item);
      } else {
        editorRef.current.append(item);
      }
    }

    focusChecklistText(item);
    saveEditorContent();
  };

  const handleChecklistClick = (e) => {
    if (!e.target.matches('.checklist-checkbox')) return;

    const item = e.target.closest('[data-checklist-item]');
    if (!item) return;

    item.dataset.checked = e.target.checked ? 'true' : 'false';
    saveEditorContent();
  };

  const exitChecklistItem = (item) => {
    const normalBlock = document.createElement('div');
    normalBlock.appendChild(document.createElement('br'));
    item.replaceWith(normalBlock);

    const range = document.createRange();
    range.selectNodeContents(normalBlock);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    editorRef.current.focus();
    saveEditorContent();
  };

  const handleEditorKeyDown = (e) => {
    const selection = window.getSelection();
    const anchor = selection?.anchorNode;
    const item = anchor?.parentElement?.closest?.('[data-checklist-item]');
    if (!item || !selection?.isCollapsed) return;

    const text = item.querySelector('[data-checklist-text]');
    const isEmpty = !text?.textContent?.trim();

    if (e.key === 'Enter') {
      e.preventDefault();
      if (isEmpty) {
        exitChecklistItem(item);
      } else {
        createChecklistItem(item);
      }
    }

    if (e.key === 'Backspace' && isEmpty) {
      e.preventDefault();
      exitChecklistItem(item);
    }
  };

  /*
   * Back button: flush pending save immediately before navigating back.
   */
  const handleBackClick = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
      onUpdateNote(pendingSaveRef.current || {
        ...note,
        title,
        content
      });
      pendingSaveRef.current = null;
    }
    onBack();
  };

  const applyFormat = (command, value = null) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    document.execCommand(command, false, value);
    const newContent = editorRef.current.innerHTML;
    setContent(newContent);
    scheduleSave(title, newContent);
  };

  /*
   * Native Share / Clipboard fallback
   */
  const handleShare = async () => {
    const shareText = `${title}\n\n${content}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: title || 'Cloud Note', text: shareText });
        return;
      } catch {
        // User cancelled or share unavailable, fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setShareNotification('Copied to clipboard!');
      setTimeout(() => setShareNotification(''), 2500);
    } catch (err) {
      console.error('Failed to copy note share text:', err);
      onNotify('error', 'Could not copy the note. Please try again.');
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-hidden relative ${
        isDarkTheme ? 'bg-[#18201b]' : 'bg-[#f8f5ee]'
      }`}
    >
      {/* Top Header Navigation Bar */}
      <div
        className={`px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 flex items-center justify-between border-b shrink-0 gap-2 backdrop-blur-xs ${
          isDarkTheme
            ? 'bg-[#1b251f]/90 border-[#344239]'
            : 'bg-[#f8f5ee]/90 border-[#e5dcce]'
        }`}
      >
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={handleBackClick}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
              isDarkTheme
                ? 'text-[#aeb8ae] hover:bg-[#202c25]'
                : 'text-[#526156] hover:bg-[#eae3d0]'
            }`}
            aria-label="Back to notes"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 sm:gap-2 text-xs min-w-0 truncate">
            <span
              className={`shrink-0 font-medium hidden xs:inline ${
                isDarkTheme ? 'text-[#829087]' : 'text-[#738276]'
              }`}
            >
              Notes
            </span>
            <span className={`shrink-0 hidden xs:inline ${isDarkTheme ? 'text-[#829087]' : 'text-[#738276]'}`}>
              /
            </span>
            <span
              className={`font-semibold truncate ${
                isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'
              }`}
            >
              {title || 'Untitled Note'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 relative">
          {shareNotification && (
            <span className="text-[11px] font-medium text-[#6f9b7f] animate-in fade-in">
              {shareNotification}
            </span>
          )}

          <span
            className={`text-[11px] hidden md:flex items-center gap-1 ${
              isDarkTheme ? 'text-[#829087]' : 'text-[#8a988d]'
            }`}
          >
            {saveStatus === 'saving' ? (
              'Saving...'
            ) : (
              <>
                <Check className="w-3 h-3" />
                Saved
              </>
            )}
          </span>



          <button
            onClick={handleShare}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 bg-[#1b3b2b] text-[#f8f5ee] rounded-full text-xs font-medium hover:bg-[#284f3b] transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Share</span>
          </button>

          {/* More Options Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`p-1.5 rounded-lg cursor-pointer ${
                isDarkTheme
                  ? 'text-[#829087] hover:bg-[#202c25]'
                  : 'text-[#738276] hover:bg-[#eae3d0]'
              }`}
              aria-label="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div className={`absolute right-0 top-full mt-2 w-48 border rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 ${
                isDarkTheme ? 'bg-[#1b251f] border-[#344239]' : 'bg-[#f8f5ee] border-[#e2d8be]'
              }`}>
                <button
                  onClick={() => { setShowMoreMenu(false); onTogglePin(note?.id); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer ${
                    isDarkTheme ? 'text-[#e7e1d5] hover:bg-[#202c25]' : 'text-[#2c3830] hover:bg-[#eee7d8]'
                  }`}
                >
                  {note?.pinned ? 'Unpin Note' : 'Pin Note'}
                </button>

                <button
                  onClick={() => { setShowMoreMenu(false); onToggleFavorite(note?.id); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer ${
                    isDarkTheme ? 'text-[#e7e1d5] hover:bg-[#202c25]' : 'text-[#2c3830] hover:bg-[#eee7d8]'
                  }`}
                >
                  {note?.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
                </button>

                <button
                  onClick={() => { setShowMoreMenu(false); onToggleArchive(note?.id); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer ${
                    isDarkTheme ? 'text-[#e7e1d5] hover:bg-[#202c25]' : 'text-[#2c3830] hover:bg-[#eee7d8]'
                  }`}
                >
                  {note?.isArchived ? 'Unarchive Note' : 'Archive Note'}
                </button>

                <button
                  onClick={() => { setShowMoreMenu(false); onDeleteNote(note?.id); onBack(); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 text-red-500 cursor-pointer ${
                    isDarkTheme ? 'hover:bg-[#202c25]' : 'hover:bg-[#eee7d8]'
                  }`}
                >
                  Move to Trash
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Main Canvas Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-3xl mx-auto w-full flex flex-col relative min-w-0 h-full">

          {/* Note Title Input */}
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Title..."
            className={`w-full font-serif-title font-bold text-xl sm:text-2xl lg:text-3xl outline-none bg-transparent break-words min-w-0 shrink-0 pb-1 ${
              isDarkTheme
                ? 'text-[#e7e1d5] placeholder-[#829087]'
                : 'text-[#2c3830]'
            }`}
          />

          {/* Formatting Toolbar */}
          <div
            className={`flex items-center flex-wrap gap-1 sm:gap-1.5 pb-2.5 sm:pb-3 border-b text-xs py-1 shrink-0 mt-2 sm:mt-3 ${
              isDarkTheme
                ? 'border-[#344239] text-[#aeb8ae]'
                : 'border-[#e5dcce] text-[#6e7d71]'
            }`}
          >
            {/* H1 */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat('formatBlock', 'h1')}
              className={`p-1.5 rounded-lg font-bold cursor-pointer shrink-0 ${isDarkTheme ? 'hover:bg-[#202c25] hover:text-[#e7e1d5]' : 'hover:bg-[#eae3d0]'}`}
              title="Heading 1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>

            {/* H2 */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat('formatBlock', 'h2')}
              className={`p-1.5 rounded-lg cursor-pointer shrink-0 ${isDarkTheme ? 'hover:bg-[#202c25] hover:text-[#e7e1d5]' : 'hover:bg-[#eae3d0]'}`}
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>

            <div className={`w-px h-4 shrink-0 ${isDarkTheme ? 'bg-[#344239]' : 'bg-[#d8ceb3]'}`} />

            {/* Bold */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat('bold')}
              className={`p-1.5 rounded-lg font-bold cursor-pointer shrink-0 ${isDarkTheme ? 'hover:bg-[#202c25] hover:text-[#e7e1d5]' : 'hover:bg-[#eae3d0]'}`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            {/* Italic */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat('italic')}
              className={`p-1.5 rounded-lg italic cursor-pointer shrink-0 ${isDarkTheme ? 'hover:bg-[#202c25] hover:text-[#e7e1d5]' : 'hover:bg-[#eae3d0]'}`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            {/* Underline */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat('underline')}
              className={`p-1.5 rounded-lg underline cursor-pointer shrink-0 ${isDarkTheme ? 'hover:bg-[#202c25] hover:text-[#e7e1d5]' : 'hover:bg-[#eae3d0]'}`}
              title="Underline"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>

            {/* Strikethrough */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat('strikeThrough')}
              className={`p-1.5 rounded-lg line-through cursor-pointer shrink-0 ${isDarkTheme ? 'hover:bg-[#202c25] hover:text-[#e7e1d5]' : 'hover:bg-[#eae3d0]'}`}
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>

            <div className={`w-px h-4 shrink-0 ${isDarkTheme ? 'bg-[#344239]' : 'bg-[#d8ceb3]'}`} />

            {/* Bulleted List */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat('insertUnorderedList')}
              className={`p-1.5 rounded-lg cursor-pointer shrink-0 ${isDarkTheme ? 'hover:bg-[#202c25] hover:text-[#e7e1d5]' : 'hover:bg-[#eae3d0]'}`}
              title="Bulleted list"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat('insertOrderedList')}
              className={`p-1.5 rounded-lg cursor-pointer shrink-0 ${isDarkTheme ? 'hover:bg-[#202c25] hover:text-[#e7e1d5]' : 'hover:bg-[#eae3d0]'}`}
              title="Numbered list"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            {/* Quote */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat('formatBlock', 'blockquote')}
              className={`p-1.5 rounded-lg cursor-pointer shrink-0 ${isDarkTheme ? 'hover:bg-[#202c25] hover:text-[#e7e1d5]' : 'hover:bg-[#eae3d0]'}`}
              title="Blockquote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            {/* Checklist */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => createChecklistItem()}
              className={`p-1.5 rounded-lg cursor-pointer shrink-0 ${isDarkTheme ? 'hover:bg-[#202c25] hover:text-[#e7e1d5]' : 'hover:bg-[#eae3d0]'}`}
              title="Checklist"
              aria-label="Insert checklist item"
            >
              <ListChecks className="w-3.5 h-3.5" />
            </button>


          </div>

          {/* Main Content Area — uncontrolled editor keeps the cursor stable while typing */}
          <div className="flex-1 flex flex-col min-w-0 font-outfit text-sm leading-relaxed mt-3 sm:mt-5 pb-6">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleContentChange}
              onClick={handleChecklistClick}
              onKeyDown={handleEditorKeyDown}
              data-placeholder="Begin writing your mindful thoughts..."
              role="textbox"
              aria-label="Note content"
              aria-multiline="true"
              className={`rich-editor ${isDarkTheme ? 'rich-editor-dark' : ''} flex-1 w-full bg-transparent outline-none font-outfit text-sm sm:text-base leading-relaxed min-h-[350px] break-words ${
                isDarkTheme
                  ? 'text-[#e7e1d5] placeholder-[#829087]'
                  : 'text-[#2c3830] placeholder-[#8a988d]'
              }`}
            />
          </div>


        </div>
      </div>
    </div>
  );
};