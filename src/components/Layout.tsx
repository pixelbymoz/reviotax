import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DesktopHeader } from './DesktopHeader';
import { NavigationPage } from '../types';

interface LayoutProps {
  currentPage: NavigationPage;
  onPageChange: (page: NavigationPage) => void;
  children: React.ReactNode;
}

export function Layout({ currentPage, onPageChange, children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePageChange = async (page: NavigationPage) => {
    if (page === currentPage) return;
    
    setIsTransitioning(true);
    
    // Close mobile sidebar when navigating
    setIsSidebarOpen(false);
    
    // Small delay for transition effect
    setTimeout(() => {
      onPageChange(page);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        isMobileOpen={isSidebarOpen}
        onMobileToggle={setIsSidebarOpen}
      />
      
      <main className="flex-1 overflow-auto bg-gray-50 lg:ml-64">
        {/* Desktop header */}
        <DesktopHeader currentPage={currentPage} onPageChange={handlePageChange} />
        
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <div className="bg-teal-500 rounded-lg p-1.5 flex items-center justify-center w-8 h-8">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-gray-900">Reviotax</span>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        
        {/* Page content with transition */}
        <div className={`transition-all duration-300 ease-in-out ${
          isTransitioning 
            ? 'opacity-0 transform translate-y-2' 
            : 'opacity-100 transform translate-y-0'
        }`}>
          {children}
        </div>
        </main>
    </div>
  );
}