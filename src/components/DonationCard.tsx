import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Heart } from 'lucide-react';

export function DonationCard() {
  const handleDonateClick = () => {
    window.open('https://saweria.co/pixelbymoz', '_blank');
  };

  return (
    <Card className="overflow-hidden p-0 bg-white border border-gray-200 shadow-sm">
      {/* Compact gradient section */}
      <div className="h-12 sm:h-16 bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-400 relative overflow-hidden">
        {/* Simplified abstract shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-1 right-2 w-6 h-6 bg-white/15 rounded-full blur-sm"></div>
          <div className="absolute bottom-1 left-2 w-4 h-4 bg-white/25 rounded-full blur-sm"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white/70" />
          </div>
        </div>
      </div>


      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Dukung Reviotax</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Donasi kamu akan membantu biaya domain & pengembangan fitur baru 🙌
        </p>
        <Button 
          onClick={handleDonateClick} 
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
          size="sm"
        >
          <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">Donasi</span>
        </Button>
      </div>
    </Card>
  );
}