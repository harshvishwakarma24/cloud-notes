import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

const notificationStyles = {
  success: {
    icon: CheckCircle2,
    light: 'bg-[#f1f7ef] border-[#b9d5bb] text-[#245337]',
    dark: 'bg-[#1d3024] border-[#426c4b] text-[#c8e3c9]'
  },
  error: {
    icon: AlertCircle,
    light: 'bg-[#fff1ef] border-[#e7b9b2] text-[#8a3f36]',
    dark: 'bg-[#351f1f] border-[#7a4545] text-[#f2c0b8]'
  },
  warning: {
    icon: TriangleAlert,
    light: 'bg-[#fff8e8] border-[#e5cf8f] text-[#76591c]',
    dark: 'bg-[#332c1c] border-[#796633] text-[#ead89d]'
  },
  info: {
    icon: Info,
    light: 'bg-[#eef5f4] border-[#b7d2d0] text-[#28565a]',
    dark: 'bg-[#1d2d30] border-[#416b6e] text-[#c3e1e0]'
  }
};

export const NotificationToast = ({ notification, onDismiss, isDarkTheme = false }) => {
  useEffect(() => {
    if (!notification) return undefined;

    const timer = window.setTimeout(onDismiss, notification.duration ?? 4000);
    return () => window.clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const style = notificationStyles[notification.type] || notificationStyles.info;
  const Icon = style.icon;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-[min(24rem,calc(100vw-2rem))] z-[70] animate-in slide-in-from-top-2 fade-in duration-200">
      <div className={`flex items-start gap-3 border rounded-2xl px-4 py-3 shadow-xl ${isDarkTheme ? style.dark : style.light}`} role="status" aria-live="polite">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">{notification.message}</p>
        <button type="button" onClick={onDismiss} className="shrink-0 p-0.5 rounded-md opacity-70 hover:opacity-100 cursor-pointer" aria-label="Dismiss notification">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
