import React from 'react';
import { formatNumberInput, parseNumberInput } from '../utils/formatters';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  prefix?: string;
}

export function NumberInput({ 
  value, 
  onChange, 
  placeholder = "0", 
  className = "",
  label,
  prefix = ""
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = React.useState(
    value > 0 ? formatNumberInput(value.toString()) : ''
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Format the display value
    const formatted = formatNumberInput(inputValue);
    setDisplayValue(formatted);
    
    // Parse and send the numeric value
    const numericValue = parseNumberInput(inputValue);
    onChange(numericValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select all text when focused for easy editing
    e.target.select();
  };

  React.useEffect(() => {
    // Update display value when prop value changes
    if (value === 0 && displayValue !== '') {
      setDisplayValue('');
    } else if (value > 0) {
      setDisplayValue(formatNumberInput(value.toString()));
    }
  }, [value]);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label.includes('*') ? (
            <>
              {label.replace(' *', '')} <span className="text-red-500">*</span>
            </>
          ) : (
            label
          )}
        </label>
      )}
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${className}`}
      />
    </div>
  );
}