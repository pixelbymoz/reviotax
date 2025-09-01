import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { UserProfile } from '../types';
import { User, Heart, Users } from 'lucide-react';

interface OnboardingProps {
  profile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
}

export function Onboarding({ profile, onSaveProfile }: OnboardingProps) {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: profile?.name || '',
    maritalStatus: profile?.maritalStatus || 'single',
    dependentsCount: profile?.dependentsCount || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name) {
      const newProfile: UserProfile = {
        id: profile?.id || Date.now().toString(),
        name: formData.name,
        maritalStatus: formData.maritalStatus!,
        dependentsCount: formData.dependentsCount || 0,
        ptkp: 0 // Will be calculated
      };
      onSaveProfile(newProfile);
    }
  };

  const maritalOptions = [
    { value: 'single', label: 'Lajang', icon: User, description: 'Belum menikah' },
    { value: 'married', label: 'Menikah', icon: Heart, description: 'Menikah tanpa tanggungan' },
    { value: 'married_with_dependents', label: 'Menikah + Tanggungan', icon: Users, description: 'Menikah dengan tanggungan' }
  ];

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Profil Pajak</h1>
        <p className="text-gray-600 mt-2">
          Atur profil pajak Anda untuk mendapatkan perhitungan PTKP (Penghasilan Tidak Kena Pajak) yang akurat
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="Masukkan nama lengkap Anda"
              required
            />
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Status Pernikahan <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {maritalOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.maritalStatus === option.value
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="maritalStatus"
                      value={option.value}
                      checked={formData.maritalStatus === option.value}
                      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className={`h-5 w-5 ${formData.maritalStatus === option.value ? 'text-teal-500' : 'text-gray-400'}`} />
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                    <span className="text-sm text-gray-600">{option.description}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Dependents Count */}
          {formData.maritalStatus === 'married_with_dependents' && (
            <div>
              <label htmlFor="dependentsCount" className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Tanggungan <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="dependentsCount"
                min="1"
                max="10"
                value={formData.dependentsCount}
                onChange={(e) => setFormData({ ...formData, dependentsCount: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="Masukkan jumlah tanggungan"
              />
              <p className="mt-2 text-sm text-gray-600">
                Setiap tanggungan menambah Rp 4.500.000 ke PTKP (Penghasilan Tidak Kena Pajak) Anda
              </p>
            </div>
          )}

          {/* PTKP Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Estimasi PTKP (Penghasilan Tidak Kena Pajak) Anda</h3>
            <p className="text-sm text-blue-800">
              {formData.maritalStatus === 'single' && 'Rp 54.000.000 per tahun'}
              {formData.maritalStatus === 'married' && 'Rp 58.500.000 per tahun'}
              {formData.maritalStatus === 'married_with_dependents' && 
                `Rp ${(58500000 + (formData.dependentsCount || 0) * 4500000).toLocaleString('id-ID')} per tahun`
              }
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Jumlah ini akan dikurangkan dari penghasilan kena pajak Anda
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Simpan Profil Pajak
            </Button>
          </div>
        </form>
      </Card>
      </div>
    </div>
  );
}