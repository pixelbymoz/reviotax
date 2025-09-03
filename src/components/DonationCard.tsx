import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Heart } from 'lucide-react';

export function DonationCard() {
  const handleDonateClick = () => {
    window.open('https://example.com/donate', '_blank');
  };

  return (
    <Card className="overflow-hidden p-0 bg-white border border-gray-200 shadow-sm">
      {/* Top gradient section inspired by the uploaded design */}
      <div className="h-20 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 relative overflow-hidden">
        {/* Abstract shapes for visual interest */}
        <div className="absolute inset-0">
          <div className="absolute top-2 right-4 w-12 h-12 bg-white/20 rounded-full blur-sm"></div>
          <div className="absolute bottom-2 left-4 w-8 h-8 bg-white/30 rounded-full blur-sm"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Heart className="h-8 w-8 text-white/80" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Dukung Reviotax</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Reviotax dibuat gratis untuk freelancer & creator Indonesia.
          Donasi kamu akan membantu biaya domain & pengembangan fitur baru 🙌
        </p>
        <Button 
          onClick={handleDonateClick} 
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
          size="sm"
        >
          Donasi Sekarang
        </Button>
      </div>
    </Card>
  );
}