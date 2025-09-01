import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TaxCalculation, UserProfile } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { Download, FileText, Calculator, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

interface ReportsProps {
  profile: UserProfile | null;
  taxCalculation: TaxCalculation | null;
}

export function Reports({ profile, taxCalculation }: ReportsProps) {
  const generatePDFReport = async () => {
    if (!profile || !taxCalculation) return;

    try {
      // Get the report content element
      const reportElement = document.getElementById('tax-report-content');
      if (!reportElement) return;

      // Create canvas from the report content
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add first page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      const fileName = `Laporan_Pajak_${profile.name.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF dari Reviotax. Silakan coba lagi.');
    }
  };

  const generateExcelReport = () => {
    if (!profile || !taxCalculation) return;

    try {
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Sheet 1: Tax Summary
      const taxSummaryData = [
        ['LAPORAN PAJAK TAHUNAN 2024'],
        [''],
        ['INFORMASI WAJIB PAJAK'],
        ['Nama', profile.name],
        ['Status Pernikahan', 
          profile.maritalStatus === 'single' ? 'Lajang' :
          profile.maritalStatus === 'married' ? 'Menikah' :
          `Menikah + ${profile.dependentsCount} Tanggungan`
        ],
        ['PTKP', taxCalculation.ptkp],
        [''],
        ['RINCIAN PENGHASILAN'],
        ['Penghasilan Kotor Tahunan', taxCalculation.grossIncome],
        ['Biaya Operasional', taxCalculation.operationalCosts],
        ['Penghasilan Bersih', taxCalculation.netIncome],
        ['PTKP (Bebas Pajak)', taxCalculation.ptkp],
        ['Penghasilan Kena Pajak (PKP)', taxCalculation.taxableIncome],
        [''],
        ['OPSI PAJAK'],
        ['Pajak Progresif (PPh 21)', taxCalculation.progressiveTax],
        ['PPh Final UMKM (0.5%)', taxCalculation.finalTax],
        ['Opsi yang Disarankan', taxCalculation.recommendedOption === 'progressive' ? 'Pajak Progresif' : 'PPh Final UMKM'],
        [''],
        ['JADWAL PEMBAYARAN'],
        ['Angsuran Bulanan', taxCalculation.monthlyTax],
        ['Total Tahunan', taxCalculation.recommendedOption === 'progressive' ? taxCalculation.progressiveTax : taxCalculation.finalTax],
        [''],
        ['INDIKATOR KINERJA'],
        ['Tarif Pajak Efektif (%)', 
          taxCalculation.grossIncome > 0 
            ? ((taxCalculation.recommendedOption === 'progressive' ? taxCalculation.progressiveTax : taxCalculation.finalTax) / taxCalculation.grossIncome * 100).toFixed(2)
            : 0
        ],
        ['Penghasilan Setelah Pajak', 
          taxCalculation.netIncome - (taxCalculation.recommendedOption === 'progressive' ? taxCalculation.progressiveTax : taxCalculation.finalTax)
        ],
        ['Rasio Beban Pajak (%)', 
          taxCalculation.netIncome > 0 
            ? ((taxCalculation.recommendedOption === 'progressive' ? taxCalculation.progressiveTax : taxCalculation.finalTax) / taxCalculation.netIncome * 100).toFixed(2)
            : 0
        ]
      ];

      const ws1 = XLSX.utils.aoa_to_sheet(taxSummaryData);
      
      // Set column widths
      ws1['!cols'] = [
        { width: 30 },
        { width: 20 }
      ];

      // Add formatting for headers
      ws1['A1'].s = {
        font: { bold: true, sz: 14 },
        alignment: { horizontal: 'center' }
      };

      XLSX.utils.book_append_sheet(wb, ws1, 'Ringkasan Pajak');

      // Sheet 2: Tax Brackets (if progressive)
      if (taxCalculation.recommendedOption === 'progressive' && taxCalculation.taxBreakdown.length > 0) {
        const taxBracketData = [
          ['RINCIAN PAJAK PROGRESIF'],
          [''],
          ['Lapisan', 'Tarif (%)', 'Jumlah Pajak']
        ];

        taxCalculation.taxBreakdown.forEach((bracket, index) => {
          taxBracketData.push([
            `${bracket.min.toLocaleString('id-ID')} ${bracket.max ? `- ${bracket.max.toLocaleString('id-ID')}` : '+'}`,
            (bracket.rate * 100).toFixed(1),
            bracket.amount
          ]);
        });

        const ws2 = XLSX.utils.aoa_to_sheet(taxBracketData);
        ws2['!cols'] = [
          { width: 25 },
          { width: 15 },
          { width: 20 }
        ];

        XLSX.utils.book_append_sheet(wb, ws2, 'Rincian Pajak Progresif');
      }

      // Sheet 3: SPT Summary
      const sptData = [
        ['RINGKASAN SPT TAHUNAN'],
        [''],
        ['KOLOM FORMULIR 1770S'],
        ['Penghasilan Kotor (Baris 1)', taxCalculation.grossIncome],
        ['Biaya yang Dapat Dikurangkan (Baris 2)', taxCalculation.operationalCosts],
        ['Penghasilan Bersih (Baris 3)', taxCalculation.netIncome],
        ['PTKP (Baris 4)', taxCalculation.ptkp],
        ['Penghasilan Kena Pajak (Baris 5)', taxCalculation.taxableIncome],
        [''],
        ['PERHITUNGAN PAJAK'],
        ['PPh 21 (Progresif)', taxCalculation.progressiveTax],
        ['Alternatif PPh Final', taxCalculation.finalTax],
        ['Pajak Terutang yang Disarankan', 
          taxCalculation.recommendedOption === 'progressive' ? taxCalculation.progressiveTax : taxCalculation.finalTax
        ]
      ];

      const ws3 = XLSX.utils.aoa_to_sheet(sptData);
      ws3['!cols'] = [
        { width: 35 },
        { width: 20 }
      ];

      XLSX.utils.book_append_sheet(wb, ws3, 'Ringkasan SPT');

      // Generate filename and save
      const fileName = `Laporan_Pajak_${profile.name.replace(/\s+/g, '_')}_${new Date().getFullYear()}.xlsx`;
      XLSX.writeFile(wb, fileName);

    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Terjadi kesalahan saat membuat file Excel. Silakan coba lagi.');
    }
  };

  if (!profile || !taxCalculation) {
    return (
      <div className="p-8">
        <Card className="text-center">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-6" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Tidak Tersedia</h2>
          <p className="text-gray-600">
            Lengkapi pengaturan profil dan tambahkan sumber penghasilan untuk membuat laporan pajak.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Laporan Pajak</h1>
        <p className="text-gray-600 mt-2">
          Buat laporan pajak dan ringkasan yang komprehensif untuk catatan Anda
        </p>
      </div>

      {/* Export Actions */}
      <div className="flex gap-4 mb-8">
        <Button onClick={generatePDFReport}>
          <Download className="mr-2 h-4 w-4" />
          Ekspor sebagai PDF
        </Button>
        <Button variant="outline" onClick={generateExcelReport}>
          <Download className="mr-2 h-4 w-4" />
          Ekspor sebagai Excel
        </Button>
      </div>

      {/* Annual Tax Summary */}
      <div id="tax-report-content">
        <Card className="mb-8">
          <div className="flex items-center mb-6">
            <Calendar className="h-6 w-6 text-teal-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Ringkasan Pajak Tahunan 2024</h2>
          </div>

          {/* Taxpayer Information */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Informasi Wajib Pajak</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-600">Nama:</span>
                <span className="ml-2 font-medium">{profile.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Status Pernikahan:</span>
                <span className="ml-2 font-medium">
                  {profile.maritalStatus === 'single' && 'Lajang'}
                  {profile.maritalStatus === 'married' && 'Menikah'}
                  {profile.maritalStatus === 'married_with_dependents' && `Menikah + ${profile.dependentsCount} Tanggungan`}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Jumlah PTKP:</span>
                <span className="ml-2 font-medium">{formatCurrency(taxCalculation.ptkp)}</span>
              </div>
            </div>
          </div>

          {/* Income Summary */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Ringkasan Penghasilan & Pajak</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Rincian Penghasilan</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Penghasilan Kotor Tahunan:</span>
                    <span className="font-medium">{formatCurrency(taxCalculation.grossIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Operasional:</span>
                    <span className="font-medium">({formatCurrency(taxCalculation.operationalCosts)})</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Penghasilan Bersih:</span>
                    <span className="font-medium">{formatCurrency(taxCalculation.netIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PTKP (Bebas Pajak):</span>
                    <span className="font-medium">({formatCurrency(taxCalculation.ptkp)})</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Penghasilan Kena Pajak (PKP):</span>
                    <span>{formatCurrency(taxCalculation.taxableIncome)}</span>
                  </div>
                </div>
              </div>

              {/* Tax Calculation */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Opsi Pajak</h4>
                <div className="space-y-2 text-sm">
                  <div className={`p-3 rounded ${taxCalculation.recommendedOption === 'progressive' ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Pajak Progresif (PPh 21):</span>
                      <span className="font-bold">{formatCurrency(taxCalculation.progressiveTax)}</span>
                    </div>
                    {taxCalculation.recommendedOption === 'progressive' && (
                      <span className="text-xs text-teal-600">✓ Disarankan</span>
                    )}
                  </div>
                  
                  <div className={`p-3 rounded ${taxCalculation.recommendedOption === 'final' ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">PPh Final UMKM (0,5%):</span>
                      <span className="font-bold">{formatCurrency(taxCalculation.finalTax)}</span>
                    </div>
                    {taxCalculation.recommendedOption === 'final' && (
                      <span className="text-xs text-teal-600">✓ Disarankan</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Brackets (if progressive) */}
          {taxCalculation.recommendedOption === 'progressive' && taxCalculation.taxBreakdown.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">Rincian Pajak Progresif</h3>
              <div className="overflow-x-auto">
                <div className="space-y-2 min-w-full">
                  {taxCalculation.taxBreakdown.map((bracket, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {formatPercentage(bracket.rate)} on {formatCurrency(bracket.min)} 
                        {bracket.max ? ` - ${formatCurrency(bracket.max)}` : '+'}:
                      </span>
                      <span className="font-medium">{formatCurrency(bracket.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Payment Schedule */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Jadwal Pembayaran yang Disarankan</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 font-medium">Angsuran Bulanan:</span>
                  <p className="text-lg font-bold text-blue-900">{formatCurrency(taxCalculation.monthlyTax)}</p>
                  <p className="text-xs text-blue-600">Jatuh tempo tanggal 15 setiap bulan</p>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Total Tahunan:</span>
                  <p className="text-lg font-bold text-blue-900">
                    {formatCurrency(
                      taxCalculation.recommendedOption === 'progressive' 
                        ? taxCalculation.progressiveTax 
                        : taxCalculation.finalTax
                    )}
                  </p>
                  <p className="text-xs text-blue-600">Batas waktu SPT: 31 Maret</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Indikator Kinerja Utama</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-green-600">Tarif Pajak Efektif</p>
                <p className="text-xl font-bold text-green-900">
                  {formatPercentage(
                    taxCalculation.grossIncome > 0 
                      ? (taxCalculation.recommendedOption === 'progressive' 
                         ? taxCalculation.progressiveTax 
                         : taxCalculation.finalTax) / taxCalculation.grossIncome 
                      : 0
                  )}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-purple-600">Penghasilan Setelah Pajak</p>
                <p className="text-xl font-bold text-purple-900">
                  {formatCurrency(
                    taxCalculation.netIncome - (taxCalculation.recommendedOption === 'progressive' 
                      ? taxCalculation.progressiveTax 
                      : taxCalculation.finalTax)
                  )}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-sm text-orange-600">Rasio Beban Pajak</p>
                <p className="text-xl font-bold text-orange-900">
                  {formatPercentage(
                    taxCalculation.netIncome > 0 
                      ? (taxCalculation.recommendedOption === 'progressive' 
                         ? taxCalculation.progressiveTax 
                         : taxCalculation.finalTax) / taxCalculation.netIncome 
                      : 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* SPT Draft Summary */}
        <Card>
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-teal-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Ringkasan SPT Tahunan</h2>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Catatan:</strong> Ringkasan ini menyediakan angka-angka kunci untuk SPT Tahunan Anda (Formulir 1770/1770S). 
              Silakan konsultasi dengan profesional pajak atau gunakan software pajak resmi untuk pengajuan final.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Kolom Formulir 1770S</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Penghasilan Kotor (Baris 1):</span>
                  <span className="font-mono">{formatCurrency(taxCalculation.grossIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya yang Dapat Dikurangkan (Baris 2):</span>
                  <span className="font-mono">{formatCurrency(taxCalculation.operationalCosts)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Penghasilan Bersih (Baris 3):</span>
                  <span className="font-mono">{formatCurrency(taxCalculation.netIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PTKP (Baris 4):</span>
                  <span className="font-mono">{formatCurrency(taxCalculation.ptkp)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Penghasilan Kena Pajak (Baris 5):</span>
                  <span className="font-mono">{formatCurrency(taxCalculation.taxableIncome)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Perhitungan Pajak</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">PPh 21 (Progresif):</span>
                  <span className="font-mono">{formatCurrency(taxCalculation.progressiveTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alternatif PPh Final:</span>
                  <span className="font-mono">{formatCurrency(taxCalculation.finalTax)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Pajak Terutang yang Disarankan:</span>
                  <span className="font-mono">
                    {formatCurrency(
                      taxCalculation.recommendedOption === 'progressive' 
                        ? taxCalculation.progressiveTax 
                        : taxCalculation.finalTax
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      </div>

    </div>
  );
}