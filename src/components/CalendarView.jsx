import React, { useState } from 'react';
import { Calendar as CalendarIcon, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarView = ({
  notes = [],
  openNote = () => {},
  isDarkTheme = false
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Group active notes (not deleted and not archived) by YYYY-MM-DD
  const activeNotes = notes.filter(n => !n.isDeleted && !n.isArchived);

  const notesByDate = activeNotes.reduce((acc, note) => {
    const rawDate = note.updatedAt || note.createdAt;
    let dateStr = '';

    try {
      dateStr = new Date(rawDate).toISOString().split('T')[0];
    } catch {
      dateStr = new Date().toISOString().split('T')[0];
    }

    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(note);
    return acc;
  }, {});

  const datesWithNotes = Object.keys(notesByDate).sort().reverse();
  const selectedDayNotes = notesByDate[selectedDate] || [];

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 max-w-5xl mx-auto w-full min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isDarkTheme ? 'bg-[#202c25] text-[#6f9b7f]' : 'bg-[#f0ebd9] text-[#1b3b2b]'}`}>
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`font-serif-title text-xl sm:text-2xl font-bold ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
              Mindful Calendar
            </h2>
            <p className={`text-xs mt-0.5 ${isDarkTheme ? 'text-[#829087]' : 'text-[#738276]'}`}>
              Track your thoughts and entries across time.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dates with Entries Column */}
        <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
          isDarkTheme ? 'bg-[#1b251f] border-[#344239]' : 'bg-[#f5f0e4] border-[#e5dcce]'
        }`}>
          <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDarkTheme ? 'text-[#829087]' : 'text-[#738276]'}`}>
            Dates with Entries ({datesWithNotes.length})
          </h3>

          {datesWithNotes.length === 0 ? (
            <p className={`text-xs py-6 text-center ${isDarkTheme ? 'text-[#829087]' : 'text-[#8a988d]'}`}>
              No dated entries found yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {datesWithNotes.map((dateStr) => {
                const count = notesByDate[dateStr].length;
                const isSelected = dateStr === selectedDate;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? (isDarkTheme ? 'bg-[#26332b] border-[#6f9b7f] text-[#e7e1d5]' : 'bg-[#f8f5ee] border-[#1b3b2b] text-[#1b3b2b] shadow-xs')
                        : (isDarkTheme ? 'bg-[#202c25] border-[#344239] text-[#aeb8ae] hover:bg-[#26332b]' : 'bg-[#f2ece0] border-[#e2d8be] text-[#2c3830] hover:bg-[#eae2ce]')
                    }`}
                  >
                    <span>{new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isSelected
                        ? (isDarkTheme ? 'bg-[#163c2b] text-[#6f9b7f]' : 'bg-[#1b3b2b] text-[#f8f5ee]')
                        : (isDarkTheme ? 'bg-[#26332b] text-[#829087]' : 'bg-[#e5dcce] text-[#738276]')
                    }`}>
                      {count} {count === 1 ? 'note' : 'notes'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notes for Selected Date Column */}
        <div className={`lg:col-span-2 p-4 sm:p-5 rounded-2xl border space-y-4 ${
          isDarkTheme ? 'bg-[#1b251f] border-[#344239]' : 'bg-[#f5f0e4] border-[#e5dcce]'
        }`}>
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className={`text-sm font-semibold ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
              Entries for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <span className={`text-xs ${isDarkTheme ? 'text-[#829087]' : 'text-[#8a988d]'}`}>
              {selectedDayNotes.length} {selectedDayNotes.length === 1 ? 'note' : 'notes'}
            </span>
          </div>

          {selectedDayNotes.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <FileText className={`w-8 h-8 mx-auto ${isDarkTheme ? 'text-[#6f9b7f]' : 'text-[#a3b8aa]'}`} />
              <p className={`text-xs ${isDarkTheme ? 'text-[#829087]' : 'text-[#8a988d]'}`}>
                No entries created on this date.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => openNote(note.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isDarkTheme
                      ? 'bg-[#202c25] hover:bg-[#26332b] border-[#344239]'
                      : 'bg-[#f8f5ee] hover:bg-[#eee7d8] border-[#e2d8be]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <h4 className={`font-serif-title font-semibold text-sm truncate ${isDarkTheme ? 'text-[#e7e1d5]' : 'text-[#2c3830]'}`}>
                      {note.title || 'Untitled Note'}
                    </h4>
                    <p className={`text-xs line-clamp-1 mt-0.5 ${isDarkTheme ? 'text-[#aeb8ae]' : 'text-[#6e7d71]'}`}>
                      {note.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] ${isDarkTheme ? 'text-[#829087]' : 'text-[#8a988d]'}`}>
                      {new Date(note.updatedAt || note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
