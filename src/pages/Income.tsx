import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { NumberInput } from '../components/NumberInput';
import { IncomeSource, OperationalCost } from '../types';
import { Plus, Trash2, Youtube, Instagram, DollarSign, Monitor, Wifi, Car } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface IncomeProps {
  incomeSources: IncomeSource[];
  operationalCosts: OperationalCost[];
  onUpdateIncome: (incomeSources: IncomeSource[], operationalCosts: OperationalCost[]) => void;
}

export function Income({ incomeSources, operationalCosts, onUpdateIncome }: IncomeProps) {
  const [newIncomeSource, setNewIncomeSource] = useState<Partial<IncomeSource>>({
    type: 'adsense',
    name: '',
    amount: 0,
    frequency: 'monthly'
  });

  const [newOperationalCost, setNewOperationalCost] = useState<Partial<OperationalCost>>({
    type: 'internet',
    name: '',
    amount: 0,
    frequency: 'monthly'
  });

  const incomeTypeOptions = [
    { value: 'adsense', label: 'AdSense / YouTube', icon: Youtube },
    { value: 'tiktok', label: 'TikTok Creator Fund', icon: Monitor },
    { value: 'instagram', label: 'Instagram / Meta', icon: Instagram },
    { value: 'sponsor', label: 'Sponsorship / Brand Deal', icon: DollarSign },
    { value: 'freelance', label: 'Proyek Freelance', icon: Monitor },
    { value: 'other', label: 'Penghasilan Lainnya', icon: DollarSign }
  ];

  const costTypeOptions = [
    { value: 'internet', label: 'Internet / Data', icon: Wifi },
    { value: 'software', label: 'Software / Alat', icon: Monitor },
    { value: 'equipment', label: 'Peralatan', icon: Monitor },
    { value: 'transportation', label: 'Transportasi', icon: Car },
    { value: 'other', label: 'Biaya Lainnya', icon: DollarSign }
  ];

  const addIncomeSource = () => {
    if (newIncomeSource.name && newIncomeSource.amount) {
      const incomeSource: IncomeSource = {
        id: Date.now().toString(),
        type: newIncomeSource.type!,
        name: newIncomeSource.name,
        amount: newIncomeSource.amount,
        frequency: newIncomeSource.frequency!
      };
      
      onUpdateIncome([...incomeSources, incomeSource], operationalCosts);
      setNewIncomeSource({ type: 'adsense', name: '', amount: 0, frequency: 'monthly' });
    }
  };

  const addOperationalCost = () => {
    if (newOperationalCost.name && newOperationalCost.amount) {
      const operationalCost: OperationalCost = {
        id: Date.now().toString(),
        type: newOperationalCost.type!,
        name: newOperationalCost.name,
        amount: newOperationalCost.amount,
        frequency: newOperationalCost.frequency!
      };
      
      onUpdateIncome(incomeSources, [...operationalCosts, operationalCost]);
      setNewOperationalCost({ type: 'internet', name: '', amount: 0, frequency: 'monthly' });
    }
  };

  const removeIncomeSource = (id: string) => {
    onUpdateIncome(incomeSources.filter(source => source.id !== id), operationalCosts);
  };

  const removeOperationalCost = (id: string) => {
    onUpdateIncome(incomeSources, operationalCosts.filter(cost => cost.id !== id));
  };

  const totalAnnualIncome = incomeSources.reduce((total, source) => {
    return total + (source.frequency === 'monthly' ? source.amount * 12 : source.amount);
  }, 0);

  const totalAnnualCosts = operationalCosts.reduce((total, cost) => {
    return total + (cost.frequency === 'monthly' ? cost.amount * 12 : cost.amount);
  }, 0);

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Penghasilan & Biaya</h1>
        <p className="text-gray-600 mt-2">
          Tambahkan sumber penghasilan dan biaya operasional untuk perhitungan pajak yang akurat
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card padding="sm">
          <h3 className="text-sm font-medium text-gray-600">Total Penghasilan Tahunan</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAnnualIncome)}</p>
        </Card>
        <Card padding="sm">
          <h3 className="text-sm font-medium text-gray-600">Total Biaya Tahunan</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalAnnualCosts)}</p>
        </Card>
        <Card padding="sm">
          <h3 className="text-sm font-medium text-gray-600">Penghasilan Bersih Tahunan</h3>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAnnualIncome - totalAnnualCosts)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Sources */}
        <div>
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sumber Penghasilan</h2>
            
            {/* Add New Income Source */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis</label>
                <select
                  value={newIncomeSource.type}
                  onChange={(e) => setNewIncomeSource({ ...newIncomeSource, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  {incomeTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newIncomeSource.name}
                  onChange={(e) => setNewIncomeSource({ ...newIncomeSource, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="contoh: Pendapatan Channel YouTube"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah (Rp) <span className="text-red-500">*</span></label>
                  <NumberInput
                    value={newIncomeSource.amount}
                    onChange={(value) => setNewIncomeSource({ ...newIncomeSource, amount: value })}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frekuensi</label>
                  <select
                    value={newIncomeSource.frequency}
                    onChange={(e) => setNewIncomeSource({ ...newIncomeSource, frequency: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="monthly">Bulanan</option>
                    <option value="annual">Tahunan</option>
                  </select>
                </div>
              </div>
              
              <Button onClick={addIncomeSource}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Sumber Penghasilan
              </Button>
            </div>

            {/* Income Sources List */}
            <div className="space-y-3">
              {incomeSources.map(source => {
                const typeOption = incomeTypeOptions.find(opt => opt.value === source.type);
                const Icon = typeOption?.icon || DollarSign;
                
                return (
                  <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{source.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(source.amount)} {source.frequency}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeIncomeSource(source.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              
              {incomeSources.length === 0 && (
                <p className="text-gray-500 text-center py-8">Belum ada sumber penghasilan yang ditambahkan</p>
              )}
            </div>
          </Card>
        </div>

        {/* Operational Costs */}
        <div>
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Biaya Operasional</h2>
            
            {/* Add New Operational Cost */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis</label>
                <select
                  value={newOperationalCost.type}
                  onChange={(e) => setNewOperationalCost({ ...newOperationalCost, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  {costTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newOperationalCost.name}
                  onChange={(e) => setNewOperationalCost({ ...newOperationalCost, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="contoh: Langganan Internet Bulanan"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah (Rp) <span className="text-red-500">*</span></label>
                  <NumberInput
                    value={newOperationalCost.amount}
                    onChange={(value) => setNewOperationalCost({ ...newOperationalCost, amount: value })}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frekuensi</label>
                  <select
                    value={newOperationalCost.frequency}
                    onChange={(e) => setNewOperationalCost({ ...newOperationalCost, frequency: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="monthly">Bulanan</option>
                    <option value="annual">Tahunan</option>
                  </select>
                </div>
              </div>
              
              <Button onClick={addOperationalCost} variant="secondary">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Biaya Operasional
              </Button>
            </div>

            {/* Operational Costs List */}
            <div className="space-y-3">
              {operationalCosts.map(cost => {
                const typeOption = costTypeOptions.find(opt => opt.value === cost.type);
                const Icon = typeOption?.icon || DollarSign;
                
                return (
                  <div key={cost.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{cost.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(cost.amount)} {cost.frequency}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeOperationalCost(cost.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              
              {operationalCosts.length === 0 && (
                <p className="text-gray-500 text-center py-8">Belum ada biaya operasional yang ditambahkan</p>
              )}
            </div>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}