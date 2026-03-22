import React, { useEffect } from 'react';
import { ViewState } from '../types';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  useEffect(() => {
    // Show splash screen for 2.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-full bg-[#fdfaf6] flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in duration-500">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center animate-in slide-in-from-bottom-8 fade-in duration-1000">
        {/* Logo Container */}
        <div className="w-64 h-64 mb-8 relative flex items-center justify-center">
          <img 
            src="./images/APPlogo.png" 
            alt="APP Logo" 
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold text-gray-800 tracking-wider mb-3">望山云居</h1>
        <div className="h-px w-12 bg-brand-500 mb-4 rounded-full"></div>
        <p className="text-gray-500 tracking-widest text-sm font-medium">让社区生活更智慧！</p>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
