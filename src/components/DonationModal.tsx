import React from 'react';
import { X, Heart, ExternalLink } from 'lucide-react';
import { Button } from './Button';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  if (!isOpen) return null;

  const handleSaweriaClick = () => {
    window.open('https://saweria.co/pixelbymoz', '_blank');
  };

  const handlePaypalClick = () => {
    window.open('https://paypal.me/pixelbymoz', '_blank');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-in">
        {/* Header with gradient */}
        <div className="relative h-24 bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-400 rounded-t-2xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-2 right-8 w-8 h-8 bg-white/15 rounded-full blur-sm"></div>
            <div className="absolute bottom-2 left-6 w-6 h-6 bg-white/25 rounded-full blur-sm"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Heart className="h-8 w-8 text-white/80" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Dukung Reviotax</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Donasi kamu akan membantu biaya domain & pengembangan fitur baru 🙌
            </p>
          </div>

          {/* Donation buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSaweriaClick}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
              size="lg"
            >
              <Heart className="mr-2 h-4 w-4" />
              Saweria
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>

            <Button
              onClick={handlePaypalClick}
              variant="outline"
              className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-200"
              size="lg"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a.3.3 0 0 0-.32-.32c-.14 0-.28.11-.32.25-.04.14-.04.28 0 .42.04.14.18.25.32.25.14 0 .28-.11.32-.25.04-.14.04-.28 0-.42z"/>
              </svg>
              PayPal
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Additional info */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Reviotax dibuat gratis untuk freelancer & creator Indonesia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}