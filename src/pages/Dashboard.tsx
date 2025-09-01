import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TrendingUp, TrendingDown, Calculator, FileText, DollarSign, Percent } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { TaxCalculation } from '../types';

interface DashboardProps {
  taxCalculation: TaxCalculation | null;
  onNavigate: (page: string) => void;
}

export function Dashboard({ taxCalculation, onNavigate }: DashboardProps) {
  const stats = taxCalculation ? [
    {
      name: 'Penghasilan Kotor Tahunan',
      value: formatCurrency(taxCalculation.grossIncome),
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Pajak yang Disarankan',
      value: formatCurrency(taxCalculation.recommendedOption === 'progressive' ? taxCalculation.progressiveTax : taxCalculation.finalTax),
      icon: Calculator,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Tarif Pajak Efektif',
      value: formatPercentage(taxCalculation.grossIncome > 0 ? (taxCalculation.recommendedOption === 'progressive' ? taxCalculation.progressiveTax : taxCalculation.finalTax) / taxCalculation.grossIncome : 0),
      icon: Percent,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Pembayaran Bulanan',
      value: formatCurrency(taxCalculation.monthlyTax),
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ] : [];

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Beranda</h1>
        <p className="text-gray-600 mt-2">
          Pantau perhitungan pajak Anda dan dapatkan wawasan untuk penghasilan freelancer & content creator
        </p>
      </div>

      {!taxCalculation ? (
        <Card className="text-center">
          <div className="py-12">
            <Calculator className="mx-auto h-16 w-16 text-gray-400 mb-6" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Mulai Perhitungan Pajak</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Atur profil pajak Anda dan tambahkan sumber penghasilan untuk melihat perhitungan pajak dan rekomendasi yang detail.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => onNavigate('onboarding')}>
                Atur Profil Pajak
              </Button>
              <Button variant="outline" onClick={() => onNavigate('income')}>
                Tambah Sumber Penghasilan
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.name} padding="sm">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Tax Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Perbandingan Opsi Pajak</h3>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${taxCalculation.recommendedOption === 'progressive' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Pajak Progresif (PPh 21)</h4>
                      <p className="text-sm text-gray-600">5% - 35% berdasarkan lapisan penghasilan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(taxCalculation.progressiveTax)}</p>
                      {taxCalculation.recommendedOption === 'progressive' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                          Disarankan
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${taxCalculation.recommendedOption === 'final' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">PPh Final UMKM</h4>
                      <p className="text-sm text-gray-600">0,5% dari penghasilan kotor</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(taxCalculation.finalTax)}</p>
                      {taxCalculation.recommendedOption === 'final' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                          Disarankan
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Potensi Penghematan:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(Math.abs(taxCalculation.progressiveTax - taxCalculation.finalTax))}
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rincian Penghasilan</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Penghasilan Kotor</span>
                  <span className="font-medium">{formatCurrency(taxCalculation.grossIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Operasional</span>
                  <span className="font-medium">-{formatCurrency(taxCalculation.operationalCosts)}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Penghasilan Bersih</span>
                  <span className="font-medium">{formatCurrency(taxCalculation.netIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PTKP (Penghasilan Tidak Kena Pajak)</span>
                  <span className="font-medium">-{formatCurrency(taxCalculation.ptkp)}</span>
                </div>
                <div className="flex justify-between border-t pt-3 font-bold">
                  <span className="text-gray-900">Penghasilan Kena Pajak</span>
                  <span>{formatCurrency(taxCalculation.taxableIncome)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={() => onNavigate('simulation')}>
                <Calculator className="mr-2 h-4 w-4" />
                Jalankan Simulasi
              </Button>
              <Button variant="outline" onClick={() => onNavigate('reports')}>
                <FileText className="mr-2 h-4 w-4" />
                Buat Laporan
              </Button>
              <Button variant="outline" onClick={() => onNavigate('income')}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Perbarui Penghasilan
              </Button>
            </div>
          </Card>
        </>
      )}
      </div>
    </div>
  );
}