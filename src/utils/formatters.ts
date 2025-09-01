// Utility functions for number formatting
export function formatNumberInput(value: string): string {
  // Remove all non-digit characters
  const numericValue = value.replace(/[^\d]/g, '');
  
  // Add thousand separators
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function parseNumberInput(value: string): number {
  // Remove all non-digit characters and convert to number
  const numericValue = value.replace(/[^\d]/g, '');
  return parseInt(numericValue) || 0;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercentage(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}