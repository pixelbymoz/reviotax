import React from 'react';
import { Shield, Lock } from 'lucide-react';

export function PrivacyDisclaimer() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="bg-green-100 rounded-full p-2">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Lock className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-semibold text-green-800">Privasi & Keamanan Data</h3>
          </div>
          <p className="text-sm text-green-700">
            <strong>Data hanya diproses di browser Anda, tidak disimpan di server.</strong> 
           Semua perhitungan pajak dilakukan secara lokal untuk menjaga kerahasiaan informasi keuangan Anda.
          </p>
        </div>
      </div>
    </div>
  );
}