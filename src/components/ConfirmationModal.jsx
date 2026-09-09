import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmationModal = ({
  confirmation,
  onCancel,
  onConfirm,
  isDarkTheme = false
}) => {
  if (!confirmation) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`relative w-full max-w-md border rounded-2xl p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkTheme ? 'bg-[#1b251f] border-[#344239] text-[#e7e1d5]' : 'bg-[#f8f5ee] border-[#e2d8be] text-[#2c3830]'}`} role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
        <button type="button" onClick={onCancel} className={`absolute top-3 right-3 p-1.5 rounded-full cursor-pointer ${isDarkTheme ? 'text-[#aeb8ae] hover:bg-[#202c25]' : 'text-[#738276] hover:bg-[#eee7d8]'}`} aria-label="Close confirmation">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className={`p-2 rounded-xl shrink-0 ${isDarkTheme ? 'bg-[#3b2d21] text-[#e5bd78]' : 'bg-[#f5ead0] text-[#8a6b2a]'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="confirmation-title" className="font-serif-title text-lg font-bold">{confirmation.title || 'Please confirm'}</h2>
            <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${isDarkTheme ? 'text-[#aeb8ae]' : 'text-[#6e7d71]'}`}>{confirmation.message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 mt-6">
          <button type="button" onClick={onCancel} className={`px-4 py-2 rounded-full border text-xs font-medium cursor-pointer ${isDarkTheme ? 'border-[#344239] text-[#aeb8ae] hover:bg-[#202c25]' : 'border-[#d8ceb3] text-[#526156] hover:bg-[#eee7d8]'}`}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 rounded-full bg-[#a8473b] text-[#fff8f3] text-xs font-medium hover:bg-[#8f3b32] cursor-pointer">
            {confirmation.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
