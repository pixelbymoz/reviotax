import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { NumberInput } from '../components/NumberInput';
import { TaxCalculation, IncomeSource, OperationalCost, UserProfile } from '../types';
import { calculateTax } from '../utils/taxCalculations';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { Calculator, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface SimulationProps {
  profile: UserProfile | null;
  incomeSources: IncomeSource[];
  operationalCosts: OperationalCost[];
  originalCalculation: TaxCalculation | null;
}

export function Simulation({ profile, incomeSources, operationalCosts, originalCalculation }: SimulationProps) {
  const [simulationIncome, setSimulationIncome] = useState<number>(
    originalCalculation?.grossIncome || 0
  );
  const [simulationCosts, setSimulationCosts] = useState<number>(
    originalCalculation?.operationalCosts || 0
  );

  if (!profile) {
    return (
      <div className="p-8">
        <Card className="text-center">
          <Calculator className="mx-auto h-16 w-16 text-gray-400 mb-6" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Atur Profil Anda Terlebih Dahulu</h2>
          <p className="text-gray-600">
            Silakan lengkapi pengaturan profil pajak Anda untuk menggunakan fitur simulasi.
          </p>
        </Card>
      </div>
    );
  }

  // Create simulation calculation
  const simulationCalculation = calculateTax(
    profile,
    [{ id: 'simulation', type: 'other', name: 'Simulation Income', amount: simulationIncome, frequency: 'annual' }],
    [{ id: 'simulation', type: 'other', name: 'Simulation Costs', amount: simulationCosts, frequency: 'annual' }]
  );

  const scenarios = [
    { name: 'Saat Ini', income: originalCalculation?.grossIncome || 0, costs: originalCalculation?.operationalCosts || 0 },
    { name: '+25% Penghasilan', income: (originalCalculation?.grossIncome || 0) * 1.25, costs: originalCalculation?.operationalCosts || 0 },
    { name: '+50% Penghasilan', income: (originalCalculation?.grossIncome || 0) * 1.5, costs: originalCalculation?.operationalCosts || 0 },
    { name: '2x Penghasilan', income: (originalCalculation?.grossIncome || 0) * 2, costs: originalCalculation?.operationalCosts || 0 },
  ];

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Simulasi Pajak</h1>
        <p className="text-gray-600 mt-2">
          Jelajahi berbagai skenario penghasilan dan lihat bagaimana pengaruhnya terhadap kewajiban pajak Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simulation Controls */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Parameter Simulasi</h2>
          
          <div className="space-y-6">
            <div>
              <NumberInput
                label="Penghasilan Kotor Tahunan *"
                value={simulationIncome}
                onChange={setSimulationIncome}
                placeholder="0"
              />
              <p className="mt-1 text-sm text-gray-500">
                Saat ini: {formatCurrency(originalCalculation?.grossIncome || 0)}
              </p>
            </div>

            <div>
              <NumberInput
                label="Biaya Operasional Tahunan"
                value={simulationCosts}
                onChange={setSimulationCosts}
                placeholder="0"
              />
              <p className="mt-1 text-sm text-gray-500">
                Saat ini: {formatCurrency(originalCalculation?.operationalCosts || 0)}
              </p>
            </div>

            {/* Quick Scenarios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Skenario Cepat
              </label>
              <div className="grid grid-cols-2 gap-2">
                {scenarios.map((scenario) => (
                  <Button
                    key={scenario.name}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSimulationIncome(scenario.income);
                      setSimulationCosts(scenario.costs);
                    }}
                  >
                    {scenario.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Simulation Results */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Hasil Simulasi</h2>
          
          {simulationIncome > 0 ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Penghasilan Bersih</p>
                  <p className="text-lg font-bold text-blue-900">
                    {formatCurrency(simulationCalculation.netIncome)}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Pajak yang Disarankan</p>
                  <p className="text-lg font-bold text-purple-900">
                    {formatCurrency(
                      simulationCalculation.recommendedOption === 'progressive' 
                        ? simulationCalculation.progressiveTax 
                        : simulationCalculation.finalTax
                    )}
                  </p>
                </div>
              </div>

              {/* Tax Comparison */}
              <div className="space-y-3">
                <div className={`p-4 rounded-lg border-2 ${simulationCalculation.recommendedOption === 'progressive' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Pajak Progresif</h4>
                      <p className="text-sm text-gray-600">PPh 21 (5% - 35%)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(simulationCalculation.progressiveTax)}</p>
                      {simulationCalculation.recommendedOption === 'progressive' && (
                        <span className="text-xs text-teal-600">Disarankan</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${simulationCalculation.recommendedOption === 'final' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">PPh Final UMKM</h4>
                      <p className="text-sm text-gray-600">0,5% dari penghasilan kotor</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(simulationCalculation.finalTax)}</p>
                      {simulationCalculation.recommendedOption === 'final' && (
                        <span className="text-xs text-teal-600">Disarankan</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Effective Tax Rate */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tarif Pajak Efektif:</span>
                  <span className="font-bold">
                    {formatPercentage(
                      simulationCalculation.grossIncome > 0 
                        ? (simulationCalculation.recommendedOption === 'progressive' 
                           ? simulationCalculation.progressiveTax 
                           : simulationCalculation.finalTax) / simulationCalculation.grossIncome 
                        : 0
                    )}
                  </span>
                </div>
              </div>

              {/* Monthly Payment */}
              <div className="bg-teal-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-teal-700 font-medium">Pembayaran Pajak Bulanan:</span>
                  <span className="font-bold text-teal-900">
                    {formatCurrency(simulationCalculation.monthlyTax)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Masukkan jumlah penghasilan untuk melihat hasil simulasi</p>
            </div>
          )}

        </Card>
      </div>

      {/* Comparison with Current */}
      {originalCalculation && simulationIncome > 0 && (
        <Card className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Perbandingan dengan Saat Ini</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {simulationCalculation.grossIncome > originalCalculation.grossIncome ? (
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                ) : simulationCalculation.grossIncome < originalCalculation.grossIncome ? (
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                ) : null}
                <span className="text-sm text-gray-600">Perubahan Penghasilan</span>
              </div>
              <p className="text-lg font-bold">
                {formatCurrency(simulationCalculation.grossIncome - originalCalculation.grossIncome)}
              </p>
              <p className="text-sm text-gray-500">
                {formatPercentage(originalCalculation.grossIncome > 0 ? (simulationCalculation.grossIncome - originalCalculation.grossIncome) / originalCalculation.grossIncome : 0)}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {(simulationCalculation.recommendedOption === 'progressive' ? simulationCalculation.progressiveTax : simulationCalculation.finalTax) > 
                 (originalCalculation.recommendedOption === 'progressive' ? originalCalculation.progressiveTax : originalCalculation.finalTax) ? (
                  <TrendingUp className="h-5 w-5 text-red-500 mr-2" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-green-500 mr-2" />
                )}
                <span className="text-sm text-gray-600">Perubahan Pajak</span>
              </div>
              <p className="text-lg font-bold">
                {formatCurrency(
                  (simulationCalculation.recommendedOption === 'progressive' ? simulationCalculation.progressiveTax : simulationCalculation.finalTax) -
                  (originalCalculation.recommendedOption === 'progressive' ? originalCalculation.progressiveTax : originalCalculation.finalTax)
                )}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-sm text-gray-600">Perubahan Penghasilan Setelah Pajak</span>
              </div>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(
                  (simulationCalculation.netIncome - (simulationCalculation.recommendedOption === 'progressive' ? simulationCalculation.progressiveTax : simulationCalculation.finalTax)) -
                  (originalCalculation.netIncome - (originalCalculation.recommendedOption === 'progressive' ? originalCalculation.progressiveTax : originalCalculation.finalTax))
                )}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Disclaimer untuk hasil simulasi - hanya tampil saat ada input */}
      {simulationIncome > 0 && (
        <div className="mt-6">
          <p className="text-xs text-gray-500 italic text-center">
            ⚠️ Hasil perhitungan ini bersifat simulasi. Untuk pelaporan resmi tetap mengikuti aturan DJP yang berlaku.
          </p>
        </div>
      )}
      </div>
    </div>
  );
}