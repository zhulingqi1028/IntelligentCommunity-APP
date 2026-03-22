import React from 'react';
import { ViewState } from '../types';
import { Home, Users, Grid, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  // Determine if we should show the bottom nav
  const showNav = [ViewState.HOME, ViewState.COMMUNITY, ViewState.SERVICES, ViewState.PROFILE].includes(currentView);

  const navItems = [
    { view: ViewState.HOME, label: '首页', icon: Home },
    { view: ViewState.COMMUNITY, label: '邻里', icon: Users },
    { view: ViewState.SERVICES, label: '服务', icon: Grid },
    { view: ViewState.PROFILE, label: '我的', icon: UserIcon },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 overflow-hidden relative">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {children}
      </div>

      {showNav && (
        <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 pb-2 z-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onChangeView(item.view)}
                className={`flex flex-col items-center justify-center w-full h-full ${
                  isActive ? 'text-brand-500' : 'text-gray-400'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};