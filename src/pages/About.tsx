import React from 'react';
import { Card } from '../components/Card';

export function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tentang Reviotax</h1>
        <div className="prose text-gray-600">
          <p className="mb-4">
            Reviotax adalah kalkulator pajak online yang komprehensif yang dirancang khusus untuk freelancer dan content creator Indonesia.
          </p>
          <p className="mb-4">
            Platform kami membantu Anda menavigasi regulasi perpajakan Indonesia dengan mudah, menyediakan perhitungan yang akurat untuk tarif pajak progresif (PPh 21) dan opsi PPh Final UMKM.
          </p>
          <div className="bg-teal-50 p-4 rounded-lg mt-6">
            <h3 className="font-semibold text-teal-900 mb-2">Fitur Utama:</h3>
            <ul className="list-disc list-inside text-teal-800 space-y-1">
              <li>Perhitungan PTKP yang akurat berdasarkan status pernikahan</li>
              <li>Perbandingan pajak Progresif vs Final</li>
              <li>Pelacakan penghasilan multi-sumber</li>
              <li>Pengurangan biaya operasional</li>
              <li>Simulasi pajak interaktif</li>
              <li>Laporan dan ekspor siap SPT</li>
            </ul>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}