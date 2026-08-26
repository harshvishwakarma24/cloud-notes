import React from 'react';
import { Cloud, Heart, ArrowRight } from 'lucide-react';
import splashscreen from '../assest/images/splashscreen.jpg'
import splashbackground from '../assest/images/sbackground.png'

export const SplashView = ({
  onEnter = () => { },
  onLoginClick = () => { }
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-[#f8f5ee] relative overflow-y-auto min-w-0">
      <div className="flex-1 relative bg-[#f8f5ee] bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url(${splashbackground})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat' 
        }}>
      {/* Top Header */}
      <div className="p-4 sm:p-6 lg:p-3 flex items-center justify-between max-w-6xl w-full mx-auto shrink-0">
        <div className="flex items-center gap-1">
          <Cloud className="w-5 sm:w-6 h-5 sm:h-6 text-[#1b3b2b]" />
          <span className="font-serif-title font-semibold text-lg sm:text-xl text-[#1b3b2b]">Cloud Notes</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onLoginClick}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-[#1b3b2b] hover:bg-[#eae3d0] rounded-full transition-all cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={onEnter}
            className="px-4 sm:px-5 py-1.5 sm:py-2 bg-[#1b3b2b] text-[#f8f5ee] text-xs font-semibold rounded-full hover:bg-[#284f3b] transition-all cursor-pointer shadow-sm"
          >
            Open Notes
          </button>
        </div>
      </div>

      {/* Main Hero Content */}
      
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6 sm:space-y-8 my-auto w-full">
        {/* Soft Cloud Logo Icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f0ebd9] border border-[#e2d8be] flex items-center justify-center shadow-sm">
          <Cloud className="w-7 h-7 sm:w-8 sm:h-8 text-[#1b3b2b]" />
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="font-serif-title text-4xl sm:text-5xl md:text-6xl font-bold text-[#1b3b2b] tracking-tight">
            Cloud Notes
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#6e7d71] font-outfit max-w-md mx-auto">
            A peaceful home for your thoughts.
          </p>
        </div>

        {/* Serene Watercolor Artwork */}
        <div
          onClick={onEnter}
          className="w-full max-w-xl h-52 sm:h-64 md:h-80 rounded-3xl overflow-hidden border border-[#e2d8be] shadow-xl bg-cover bg-center cursor-pointer hover:scale-[1.01] transition-transform duration-300 relative group"
          style={{
            backgroundImage: `url(${splashscreen})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center">
            <span className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#1b3b2b]/90 text-[#f8f5ee] rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 backdrop-blur-xs opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
              <span>Start writing</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </div>

      {/* Dark Footer Banner (Matching Screen 10) */}
      <footer className="w-full bg-[#183324] text-[#a3b8aa] px-4 sm:px-8 py-4 sm:py-5 border-t border-[#264836] flex flex-col md:flex-row items-center justify-between text-xs gap-3 sm:gap-4 shrink-0 text-center md:text-left">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-[#e2c275]" />
          <span className="font-serif-title text-sm font-semibold text-[#f0f5ea]">Cloud Notes</span>
          <span className="text-[#6e8a78] hidden sm:inline">• Thoughts shape the world.</span>
        </div>

        <div className="hidden md:block">
          <Heart className="w-4 h-4 text-[#e2c275] fill-current" />
        </div>

        <div className="font-serif-title italic text-[#d0e0d6]">
          Write beautifully. Think deeply. Live softly.
        </div>
      </footer>
    </div>
  );
};
