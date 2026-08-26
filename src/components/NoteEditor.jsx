import React, { useState, useEffect } from 'react';
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
  Image as ImageIcon, 
  Quote, 
  Plus, 
  Wand2, 
  Languages, 
  Check, 
  Send,
  Heading1,
  Heading2,
  FileText
} from 'lucide-react';

export const NoteEditor = ({
  note,
  onUpdateNote = () => {},
  onBack = () => {},
  aiCompanionOpen = false,
  setAiCompanionOpen = () => {}
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [imageUrl, setImageUrl] = useState(note?.imageUrl || '');
  
  // Selection state & AI popups
  const [selectedText, setSelectedText] = useState('Creativity is not about being perfect.');
  const [showAiModal, setShowAiModal] = useState(true); // Open initially to match screen 1 mockup
  const [aiSuggestion, setAiSuggestion] = useState("Creativity is not about perfection; It's about authenticity.");
  const [loadingAi, setLoadingAi] = useState(false);

  // AI Companion Panel state
  const [companionSummary, setCompanionSummary] = useState("A reflection on slowing down and choosing clarity over distraction.");
  const [companionImproved, setCompanionImproved] = useState("Some days are for rushing, and some days are for remembering what truly matters. Today, I choose clarity over noise.");
  const [companionShorter, setCompanionShorter] = useState("Some days rush. Today, I choose clarity.");
  const [companionQuery, setCompanionQuery] = useState('');
  const [companionMessages, setCompanionMessages] = useState([]);

  // Page switcher within the journal space
  const [activePage, setActivePage] = useState("Today's thoughts");

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setImageUrl(note.imageUrl || '');
    }
  }, [note]);

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    onUpdateNote({ ...note, title: newTitle, updatedAt: 'Just now' });
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    onUpdateNote({ ...note, content: newContent, updatedAt: 'Just now' });
  };

  // AI Action Call (Fix grammar, Make longer, Change tone, Translate)
  const triggerAiAction = async (action) => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          text: selectedText || content.slice(0, 100),
        }),
      });
      const data = await res.json();
      if (data.result) {
        setAiSuggestion(data.result);
      }
    } catch (err) {
      console.error('Error fetching AI suggestion:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  // Handle Replace AI Suggestion
  const handleReplaceSuggestion = () => {
    if (!aiSuggestion) return;
    if (selectedText && content.includes(selectedText)) {
      handleContentChange(content.replace(selectedText, aiSuggestion));
    } else {
      handleContentChange(content + '\n\n' + aiSuggestion);
    }
    setShowAiModal(false);
  };

  // Handle Insert Below AI Suggestion
  const handleInsertBelowSuggestion = () => {
    if (!aiSuggestion) return;
    handleContentChange(content + '\n\n' + aiSuggestion);
    setShowAiModal(false);
  };

  // Handle AI Companion Query
  const handleSendCompanionQuery = async (e) => {
    e.preventDefault();
    if (!companionQuery.trim()) return;

    const userMsg = companionQuery.trim();
    setCompanionMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setCompanionQuery('');

    try {
      const res = await fetch('/api/ai/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteTitle: title,
          noteContent: content,
          userQuery: userMsg,
        }),
      });
      const data = await res.json();
      if (data.answer) {
        setCompanionMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
      }
    } catch (err) {
      console.error('Error in AI companion query:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f5ee] overflow-hidden relative">
      {/* Top Header Navigation Bar */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between border-b border-[#e5dcce] bg-[#f8f5ee]/90 backdrop-blur-xs shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-lg text-[#526156] hover:bg-[#eae3d0] transition-colors cursor-pointer shrink-0"
            aria-label="Back to notes"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#738276] truncate">
            <span className="shrink-0">{note?.space || 'Journal'}</span>
            <span className="shrink-0">/</span>
            <span className="font-semibold text-[#2c3830] truncate">{title || 'Untitled'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
          <span className="text-[11px] text-[#8a988d] hidden md:inline">Saved just now</span>
          
          <button 
            onClick={() => setAiCompanionOpen(!aiCompanionOpen)}
            className={`p-2 rounded-full border border-[#d8ceb3] transition-all cursor-pointer ${
              aiCompanionOpen ? 'bg-[#1b3b2b] text-[#e2c275]' : 'bg-[#f0ebd9] text-[#526156] hover:bg-[#e8e1cb]'
            }`}
            title="Toggle AI Companion"
            aria-label="Toggle AI Companion"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-[#1b3b2b] text-[#f8f5ee] rounded-full text-xs font-medium hover:bg-[#284f3b] transition-all cursor-pointer">
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Share</span>
          </button>

          <button 
            className="p-1.5 rounded-lg text-[#738276] hover:bg-[#eae3d0] cursor-pointer"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sub Sidebar Pages Navigation (md and up) */}
        <div className="hidden md:flex w-44 lg:w-48 border-r border-[#e5dcce] p-4 flex-col gap-1 shrink-0 bg-[#f5f0e4]/50 overflow-y-auto">
          <div className="text-xs font-semibold text-[#2c3830] mb-2 flex items-center justify-between">
            <span>Personal Journal</span>
          </div>

          {["Today's thoughts", "Gratitude", "Dreams", "Ideas"].map((pg) => (
            <button
              key={pg}
              onClick={() => setActivePage(pg)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer truncate ${
                activePage === pg 
                  ? 'bg-[#e8decb] text-[#1b3b2b] font-semibold' 
                  : 'text-[#6e7d71] hover:bg-[#eee7d8]'
              }`}
            >
              {pg}
            </button>
          ))}

          <button 
            onClick={() => setActivePage('New Page')}
            className="flex items-center gap-2 px-3 py-2 mt-2 text-xs font-medium text-[#738276] hover:text-[#1b3b2b] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New page</span>
          </button>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-4 sm:space-y-6 relative min-w-0">
          {/* Note Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Title..."
            className="w-full font-serif-title font-bold text-2xl sm:text-3xl text-[#2c3830] outline-none bg-transparent"
          />

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 sm:gap-1.5 pb-3 border-b border-[#e5dcce] text-[#6e7d71] text-xs overflow-x-auto scrollbar-none py-1">
            <button type="button" className="p-1.5 rounded-lg hover:bg-[#eae3d0] font-bold cursor-pointer shrink-0" title="Heading 1"><Heading1 className="w-3.5 h-3.5" /></button>
            <button type="button" className="p-1.5 rounded-lg hover:bg-[#eae3d0] cursor-pointer shrink-0" title="Heading 2"><Heading2 className="w-3.5 h-3.5" /></button>
            <div className="w-px h-4 bg-[#d8ceb3] shrink-0" />
            <button type="button" className="p-1.5 rounded-lg hover:bg-[#eae3d0] font-bold cursor-pointer shrink-0" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
            <button type="button" className="p-1.5 rounded-lg hover:bg-[#eae3d0] italic cursor-pointer shrink-0" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
            <button type="button" className="p-1.5 rounded-lg hover:bg-[#eae3d0] underline cursor-pointer shrink-0" title="Underline"><Underline className="w-3.5 h-3.5" /></button>
            <button type="button" className="p-1.5 rounded-lg hover:bg-[#eae3d0] line-through cursor-pointer shrink-0" title="Strikethrough"><Strikethrough className="w-3.5 h-3.5" /></button>
            <div className="w-px h-4 bg-[#d8ceb3] shrink-0" />
            <button type="button" className="p-1.5 rounded-lg hover:bg-[#eae3d0] cursor-pointer shrink-0" title="Bulleted list"><List className="w-3.5 h-3.5" /></button>
            <button type="button" className="p-1.5 rounded-lg hover:bg-[#eae3d0] cursor-pointer shrink-0" title="Numbered list"><ListOrdered className="w-3.5 h-3.5" /></button>
            <button type="button" className="p-1.5 rounded-lg hover:bg-[#eae3d0] cursor-pointer shrink-0" title="Insert image"><ImageIcon className="w-3.5 h-3.5" /></button>
            <button type="button" className="p-1.5 rounded-lg hover:bg-[#eae3d0] cursor-pointer shrink-0" title="Quote"><Quote className="w-3.5 h-3.5" /></button>
            
            <button 
              type="button"
              onClick={() => setShowAiModal(true)}
              className="ml-auto flex items-center gap-1 px-2.5 py-1 bg-[#1b3b2b] text-[#f8f5ee] rounded-full text-[11px] font-medium shrink-0 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-[#e2c275]" />
              <span>AI Tools</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="space-y-4 font-outfit text-sm text-[#2c3830] leading-relaxed">
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={12}
              className="w-full bg-transparent outline-none resize-none font-outfit text-sm sm:text-base text-[#2c3830] leading-relaxed min-h-[220px]"
              placeholder="Begin writing your mindful thoughts..."
            />

            {/* Embedded Watercolor Artwork Image */}
            {imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-[#e2d8be] shadow-sm my-4 sm:my-6">
                <img 
                  src={imageUrl} 
                  alt="Watercolor landscape artwork" 
                  className="w-full h-48 sm:h-64 object-cover"
                />
              </div>
            )}
          </div>

          {/* Floating AI Suggestion Modal & Context Menu (Matching Screen 1) */}
          {showAiModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/30 backdrop-blur-xs">
              <div className="relative flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* AI Suggestion Box */}
                <div className="bg-[#f8f5ee] border border-[#e2d8be] rounded-2xl p-4 sm:p-5 shadow-2xl flex-1 space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-[#e5dcce] pb-2">
                    <span className="text-xs font-semibold text-[#1b3b2b] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#e2c275]" />
                      AI Suggestion
                    </span>
                    <button 
                      onClick={() => setShowAiModal(false)}
                      className="text-[#8a988d] hover:text-[#1b3b2b] p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-[#f2ece0] p-3 sm:p-3.5 rounded-xl text-xs text-[#2c3830] font-outfit border border-[#e2d8be] min-h-[60px]">
                    {loadingAi ? (
                      <div className="flex items-center gap-2 text-[#738276] py-2">
                        <Sparkles className="w-4 h-4 animate-spin text-[#1b3b2b]" />
                        <span>Refining with Gemini AI...</span>
                      </div>
                    ) : (
                      aiSuggestion
                    )}
                  </div>

                  <div className="flex items-center gap-2 justify-end pt-1">
                    <button 
                      onClick={handleReplaceSuggestion}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#f8f5ee] hover:bg-[#eee7d8] border border-[#d8ceb3] rounded-xl text-xs font-medium text-[#2c3830] transition-all cursor-pointer"
                    >
                      Replace
                    </button>
                    <button 
                      onClick={handleInsertBelowSuggestion}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1b3b2b] hover:bg-[#284f3b] text-[#f8f5ee] rounded-xl text-xs font-medium transition-all cursor-pointer"
                    >
                      Insert below
                    </button>
                  </div>
                </div>

                {/* Floating More Actions Context Menu */}
                <div className="bg-[#f8f5ee] border border-[#e2d8be] rounded-2xl p-3 shadow-2xl w-full sm:w-52 space-y-1 self-start animate-in fade-in slide-in-from-left-4">
                  <div className="text-[11px] font-semibold text-[#8a988d] px-2 py-1 uppercase tracking-wider">
                    More actions
                  </div>

                  <button 
                    onClick={() => triggerAiAction('fix-grammar')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#2c3830] hover:bg-[#eee7d8] transition-colors text-left cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-[#1b3b2b] shrink-0" />
                    <span>Fix grammar</span>
                  </button>

                  <button 
                    onClick={() => triggerAiAction('make-longer')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#2c3830] hover:bg-[#eee7d8] transition-colors text-left cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#1b3b2b] shrink-0" />
                    <span>Make it longer</span>
                  </button>

                  <button 
                    onClick={() => triggerAiAction('change-tone')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#2c3830] hover:bg-[#eee7d8] transition-colors text-left cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#1b3b2b] shrink-0" />
                    <span>Change tone</span>
                  </button>

                  <button 
                    onClick={() => triggerAiAction('translate')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#2c3830] hover:bg-[#eee7d8] transition-colors text-left cursor-pointer"
                  >
                    <Languages className="w-3.5 h-3.5 text-[#1b3b2b] shrink-0" />
                    <span>Translate</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Slide-Over AI Companion Drawer (Responsive: Drawer on small screens, sidebar on lg) */}
        {aiCompanionOpen && (
          <div className="fixed inset-y-0 right-0 z-40 lg:relative lg:inset-auto w-80 max-w-[85vw] border-l border-[#e5dcce] bg-[#f8f5ee] p-4 sm:p-5 flex flex-col justify-between shrink-0 shadow-2xl lg:shadow-none h-full overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between border-b border-[#e5dcce] pb-3">
                <span className="text-xs font-semibold text-[#1b3b2b] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#e2c275]" />
                  AI Companion
                </span>
                <button 
                  onClick={() => setAiCompanionOpen(false)}
                  className="text-[#8a988d] hover:text-[#1b3b2b] p-1 cursor-pointer"
                  aria-label="Close AI Companion"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Summary Section */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-[#738276] uppercase tracking-wider">
                  Summary
                </div>
                <p className="text-xs text-[#2c3830] bg-[#f2ece0] p-3 rounded-xl border border-[#e2d8be] leading-relaxed">
                  {companionSummary}
                </p>
              </div>

              {/* Improve writing Section */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-[#738276] uppercase tracking-wider">
                  Improve writing
                </div>
                <p className="text-xs text-[#2c3830] bg-[#f2ece0] p-3 rounded-xl border border-[#e2d8be] leading-relaxed">
                  {companionImproved}
                </p>
              </div>

              {/* Make it shorter Section */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-[#738276] uppercase tracking-wider">
                  Make it shorter
                </div>
                <p className="text-xs text-[#2c3830] bg-[#f2ece0] p-3 rounded-xl border border-[#e2d8be] leading-relaxed">
                  {companionShorter}
                </p>
              </div>

              {/* Conversation Messages */}
              {companionMessages.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#e2d8be]">
                  {companionMessages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`p-2.5 rounded-xl text-xs ${
                        msg.role === 'user' 
                          ? 'bg-[#1b3b2b] text-[#f8f5ee] ml-4' 
                          : 'bg-[#f2ece0] text-[#2c3830] mr-4 border border-[#e2d8be]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Input Field */}
            <form onSubmit={handleSendCompanionQuery} className="pt-4 border-t border-[#e5dcce] mt-4">
              <div className="flex items-center gap-2 bg-[#f2ece0] border border-[#e2d8be] rounded-full px-3 py-1.5">
                <input
                  type="text"
                  value={companionQuery}
                  onChange={(e) => setCompanionQuery(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-transparent text-xs text-[#2c3830] outline-none"
                />
                <button 
                  type="submit" 
                  className="p-1 rounded-full bg-[#1b3b2b] text-[#f8f5ee] cursor-pointer hover:bg-[#284f3b]"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
