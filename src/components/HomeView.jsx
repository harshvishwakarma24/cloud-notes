import React, { useState } from 'react';
import { 
  PenTool, 
  Mic, 
  Image as ImageIcon, 
  Layout, 
  Trash2, 
  Plus, 
  CheckSquare, 
  Square, 
  ArrowUpRight 
} from 'lucide-react';

export const HomeView = ({
  notes = [],
  tasks = [],
  openNote = () => {},
  createNewNote = () => {},
  toggleTask = () => {},
  addTask = () => {},
  setActiveTab = () => {}
}) => {
  const [quickCaptureText, setQuickCaptureText] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const pinnedNotes = notes.filter(n => n.pinned).slice(0, 4);
  const recentNotes = notes.slice(0, 4);

  const handleQuickCaptureSubmit = (e) => {
    e.preventDefault();
    if (!quickCaptureText.trim()) return;
    createNewNote();
    setQuickCaptureText('');
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(newTaskText.trim());
    setNewTaskText('');
    setIsAddingTask(false);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      {/* Quick Capture Input Bar */}
      <div className="bg-[#f2ece0] border border-[#e3dac8] rounded-2xl p-3 sm:p-4 shadow-sm hover:border-[#d4c8b2] transition-all">
        <form onSubmit={handleQuickCaptureSubmit} className="flex flex-col gap-2.5 sm:gap-3">
          <textarea
            value={quickCaptureText}
            onChange={(e) => setQuickCaptureText(e.target.value)}
            placeholder="Quick capture..."
            rows={2}
            className="w-full bg-transparent resize-none outline-none text-xs sm:text-sm text-[#2c3830] placeholder-[#8a988d] font-outfit"
          />
          <div className="flex items-center justify-between border-t border-[#e2d8c3] pt-2.5 sm:pt-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3 text-[#738276] overflow-x-auto py-0.5">
              <button type="button" className="hover:text-[#1b3b2b] transition-colors p-1 cursor-pointer" title="Draw">
                <PenTool className="w-4 h-4" />
              </button>
              <button type="button" className="hover:text-[#1b3b2b] transition-colors p-1 cursor-pointer" title="Voice note">
                <Mic className="w-4 h-4" />
              </button>
              <button type="button" className="hover:text-[#1b3b2b] transition-colors p-1 cursor-pointer" title="Add image">
                <ImageIcon className="w-4 h-4" />
              </button>
              <button type="button" className="hover:text-[#1b3b2b] transition-colors p-1 cursor-pointer" title="Templates">
                <Layout className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={() => setQuickCaptureText('')}
                className="hover:text-[#1b3b2b] transition-colors p-1 cursor-pointer" 
                title="Discard"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              type="submit"
              disabled={!quickCaptureText.trim()}
              className="p-2 rounded-full bg-[#1b3b2b] text-[#f8f5ee] disabled:opacity-40 hover:bg-[#284f3b] transition-all cursor-pointer shrink-0 ml-auto"
              title="Save or dictate"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Pinned Notes Section */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#738276] flex items-center gap-1.5">
            <span>📌 Pinned</span>
          </h3>
          <button 
            onClick={() => setActiveTab('notes')}
            className="text-xs text-[#526156] hover:text-[#1b3b2b] font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View all</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {pinnedNotes.map((note) => (
            <div 
              key={note.id}
              onClick={() => openNote(note.id)}
              className="group relative bg-[#f5f0e4] border border-[#e5dcce] rounded-2xl p-4 sm:p-5 hover:border-[#cbbf9f] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[140px] min-w-0"
              style={{ backgroundColor: note.color || '#f5f0e4' }}
            >
              {/* Bookmark tab */}
              <div 
                className="absolute top-0 right-4 w-3.5 h-6 rounded-b-sm shadow-xs"
                style={{ backgroundColor: note.bookmarkColor || '#c89f65' }}
              />

              <div className="space-y-2 pr-4 min-w-0">
                <h4 className="font-serif-title font-semibold text-sm sm:text-base text-[#2c3830] group-hover:text-[#1b3b2b] transition-colors truncate">
                  {note.title}
                </h4>
                <p className="text-xs text-[#6e7d71] line-clamp-2 leading-relaxed break-words">
                  {note.content}
                </p>
              </div>

              <div className="text-[11px] text-[#8a988d] pt-3 mt-2 border-t border-[#e2d8c3]/60 flex items-center justify-between">
                <span>{note.updatedAt}</span>
                <span className="text-[10px] text-[#738276] font-medium">{note.space}</span>
              </div>
            </div>
          ))}

          {/* Plus Add Note Card */}
          <div 
            onClick={() => createNewNote()}
            className="border-2 border-dashed border-[#dbd1ba] rounded-2xl p-5 hover:border-[#1b3b2b] hover:bg-[#f3edd9]/50 transition-all cursor-pointer flex items-center justify-center min-h-[140px] group text-[#8a988d] hover:text-[#1b3b2b]"
          >
            <div className="flex flex-col items-center gap-1.5">
              <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">New note</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Grid: Recent Notes, Tasks, and Inspiration Quote */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Notes List */}
        <div className="bg-[#f5f0e4] border border-[#e5dcce] rounded-2xl p-4 sm:p-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#738276] flex items-center gap-1.5">
            <span>≡ Recent Notes</span>
          </h3>

          <div className="space-y-2.5">
            {recentNotes.map((note) => (
              <div 
                key={note.id}
                onClick={() => openNote(note.id)}
                className="p-2 sm:p-2.5 rounded-xl hover:bg-[#ebd3bd]/40 transition-colors cursor-pointer group flex items-start gap-2.5 min-w-0"
              >
                <div className="w-2 h-2 rounded-full bg-[#1b3b2b] mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-xs text-[#2c3830] group-hover:text-[#1b3b2b] truncate">
                    {note.title}
                  </h5>
                  <span className="text-[10px] text-[#8a988d] block mt-0.5">
                    {note.updatedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today Tasks */}
        <div className="bg-[#f5f0e4] border border-[#e5dcce] rounded-2xl p-4 sm:p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#738276] mb-3">
              Today
            </h3>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-2.5 text-xs text-[#38453c] cursor-pointer hover:text-[#1b3b2b] transition-colors p-1 rounded-lg hover:bg-[#ebd3bd]/30"
                >
                  {task.completed ? (
                    <CheckSquare className="w-4 h-4 text-[#1b3b2b] shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[#9aa89d] shrink-0" />
                  )}
                  <span className={`truncate ${task.completed ? 'line-through text-[#8a988d]' : ''}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Task Control */}
          <div>
            {isAddingTask ? (
              <form onSubmit={handleTaskSubmit} className="flex items-center gap-2 pt-2 border-t border-[#e2d8c3]">
                <input
                  type="text"
                  autoFocus
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Task title..."
                  className="w-full bg-transparent text-xs text-[#2c3830] outline-none border-b border-[#1b3b2b] py-1"
                />
                <button type="submit" className="text-xs font-semibold text-[#1b3b2b] px-2 py-1">Add</button>
              </form>
            ) : (
              <button 
                onClick={() => setIsAddingTask(true)}
                className="text-xs font-medium text-[#738276] hover:text-[#1b3b2b] flex items-center gap-1.5 pt-2 border-t border-[#e2d8c3] w-full cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add a task</span>
              </button>
            )}
          </div>
        </div>

        {/* Inspiration Quote Card with Watercolor Aesthetic */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#f2edd8] via-[#e8e0cc] to-[#ded5be] border border-[#e0d6bd] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs md:col-span-2 lg:col-span-1 min-h-[160px]">
          {/* Soft mountain watercolor image background */}
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-bottom mix-blend-multiply pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80')`
            }}
          />

          <div className="relative z-10 space-y-3">
            <span className="text-3xl sm:text-4xl text-[#1b3b2b]/30 font-serif leading-none block">“</span>
            <p className="font-serif-title italic text-base sm:text-lg text-[#253229] leading-relaxed">
              The quieter you become, the more you can hear.
            </p>
          </div>

          <div className="relative z-10 pt-3 text-xs font-medium text-[#6e7d71] border-t border-[#1b3b2b]/10">
            — Ram Dass
          </div>
        </div>
      </div>
    </div>
  );
};
