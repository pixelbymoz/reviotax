import React from 'react';
import { Sidebar } from './Sidebar';
import { NavigationPage } from '../types';

interface LayoutProps {
  currentPage: NavigationPage;
  onPageChange: (page: NavigationPage) => void;
  children: React.ReactNode;
}

export function Layout({ currentPage, onPageChange, children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
        <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
    </div>
  );
}