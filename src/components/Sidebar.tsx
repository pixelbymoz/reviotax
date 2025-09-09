import React from 'react';
import { 
  Home, 
  UserCheck, 
  DollarSign, 
  FileText, 
  Bell, 
  Info,
  Calculator,
  X,
  Heart,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { DonationModal } from './DonationModal';
import { NavigationPage } from '../types';

interface SidebarProps {
  currentPage: NavigationPage;
  onPageChange: (page: NavigationPage) => void;
  isMobileOpen: boolean;
  onMobileToggle: (open: boolean) => void;
}

const navigation = [
  { id: 'dashboard' as NavigationPage, name: 'Beranda', icon: Home },
  { id: 'onboarding' as NavigationPage, name: 'Profil Pajak', icon: UserCheck },
  { id: 'income' as NavigationPage, name: 'Penghasilan', icon: DollarSign },
  { id: 'simulation' as NavigationPage, name: 'Simulasi', icon: Calculator },
  { id: 'reports' as NavigationPage, name: 'Laporan Pajak', icon: FileText },
//  { id: 'reminders' as NavigationPage, name: 'Pengingat', icon: Bell },
//  { id: 'feedback' as NavigationPage, name: 'Feedback', icon: MessageSquare },
  { id: 'about' as NavigationPage, name: 'Tentang', icon: Info },
];

export function Sidebar({ currentPage, onPageChange, isMobileOpen, onMobileToggle }: SidebarProps) {
  const [isDonationModalOpen, setIsDonationModalOpen] = React.useState(false);

  return (
    <>
      <div className={`flex h-screen w-64 flex-col bg-white border-r border-gray-200 fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          {/* Mobile close button */}
          <button
            onClick={() => onMobileToggle(false)}
            className="lg:hidden absolute right-4 top-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-teal-500 rounded-lg p-2 flex items-center justify-center w-10 h-10">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Reviotax</h1>
              <p className="text-xs text-gray-500">Kalkulator Pajak Online</p>
            </div>
          </div>
        </div>


        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 ${
                      isActive
                        ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-500 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-teal-500' : 'text-gray-400'}`} />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        
        {/* What's New Section - Mobile Only */}
        <div className="lg:hidden mt-6 pt-4 pb-4 border-t border-gray-200">
          <button
            onClick={() => onPageChange('whats-new')}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 ${
              currentPage === 'whats-new'
                ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Sparkles className={`mr-3 h-5 w-5 transition-colors ${currentPage === 'whats-new' ? 'text-purple-500' : 'text-gray-400'}`} />
            What's New
            <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              New
            </span>
          </button>
        </div>
        
        {/* Separator and Donation Button */}
        <div className="px-4 pb-4 mt-auto">
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={() => setIsDonationModalOpen(true)}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
            >
              <Heart className="mr-3 h-4 w-4" />
              Dukung Reviotax
            </button>
          </div>
        </div>
        </nav>
      </div>
      {/* Donation Modal */}
      <DonationModal 
        isOpen={isDonationModalOpen} 
        onClose={() => setIsDonationModalOpen(false)} 
      />
    </>
  );
}