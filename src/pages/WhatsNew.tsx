import React from 'react';
import { Card } from '../components/Card';
import { UpdateItem } from '../types';
import { Sparkles, Plus, RefreshCw, Bug, Calendar, Tag } from 'lucide-react';

export function WhatsNew() {
  const updates: UpdateItem[] = [
    {
      id: '1',
      version: '1.0.0',
      date: '2025-09-02',
      status: 'new',
      title: 'Peluncuran Reviotax',
      description: 'Kalkulator pajak online pertama yang dirancang khusus untuk freelancer dan content creator Indonesia.',
      features: [
        'Perhitungan PTKP yang akurat berdasarkan status pernikahan',
        'Perbandingan pajak Progresif vs Final',
        'Pelacakan penghasilan multi-sumber',
        'Pengurangan biaya operasional',
        'Simulasi pajak interaktif',
        'Laporan dan ekspor siap SPT'
      ]
    }
  ];

  const getStatusConfig = (status: UpdateItem['status']) => {
    switch (status) {
      case 'new':
        return {
          icon: Plus,
          label: 'Baru',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'updated':
        return {
          icon: RefreshCw,
          label: 'Diperbarui',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
      case 'fixed':
        return {
          icon: Bug,
          label: 'Diperbaiki',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          borderColor: 'border-orange-200'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-2">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">What's New</h1>
          </div>
          <p className="text-gray-600">
            Temukan fitur-fitur terbaru dan pembaruan yang telah kami lakukan untuk meningkatkan pengalaman Anda menggunakan Reviotax.
          </p>
        </div>

        <div className="space-y-6">
          {updates.map((update) => {
            const statusConfig = getStatusConfig(update.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={update.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                        <StatusIcon className="mr-1.5 h-3 w-3" />
                        {statusConfig.label}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        <Tag className="mr-1 h-3 w-3" />
                        v{update.version}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {update.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {update.description}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 flex-shrink-0">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDate(update.date)}
                  </div>
                </div>

                {/* Features List */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
                    Fitur & Pembaruan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {update.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="flex-shrink-0 w-1.5 h-1.5 bg-teal-400 rounded-full mt-2"></div>
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty state for future updates */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8">
            <Sparkles className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Pantau Terus Update Terbaru
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Kami terus mengembangkan Reviotax dengan fitur-fitur baru yang akan membantu mengelola pajak Anda dengan lebih mudah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}