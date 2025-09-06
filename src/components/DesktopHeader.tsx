import React from 'react';
import { Sparkles, Bell } from 'lucide-react';
import { NavigationPage } from '../types';

interface DesktopHeaderProps {
  currentPage: NavigationPage;
  onPageChange: (page: NavigationPage) => void;
}

export function DesktopHeader({ currentPage, onPageChange }: DesktopHeaderProps) {
  return (
    <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Left side - can be used for breadcrumbs or page title in the future */}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => onPageChange('whats-new')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 ${
              currentPage === 'whats-new'
                ? 'bg-purple-50 text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Sparkles className={`mr-2 h-4 w-4 ${currentPage === 'whats-new' ? 'text-purple-500' : 'text-gray-400'}`} />
            What's New
            {/* New indicator badge */}
            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              New
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}