"use client";
import React from 'react';

interface CustomInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  suffix?: string;
  disabled?: boolean;
}

export const CustomInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  placeholder, 
  suffix,
  disabled = false
}: CustomInputProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // --- FIX: Logic Update ---
    // Agar type "number" hai to sirf numbers allow kro
    if (type === 'number') {
        // Sirf digits aur dot allow karein (decimals ke liye)
        if (!/^\d*\.?\d*$/.test(val)) return;
    }
    
    // NOTE: Agar type "text" hai to hum kuch bhi allow kar rahe hain 
    // (Numbers + Alphabets) taake Class Name (e.g., "Class 10") likha ja sakay.
    
    // Agar future ma sirf alphabets chahiye hon (Names ke liye), 
    // to hum alag prop bana lenge. Abhi ke liye ye open hai.

    onChange(e);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className={`flex items-center border border-gray-200 rounded-xl bg-white focus-within:border-[#B70003] focus-within:ring-1 focus-within:ring-[#B70003]/20 transition-all h-[50px] overflow-hidden ${disabled ? 'bg-gray-100 opacity-70 cursor-not-allowed' : ''}`}>
        <input
          type={type === 'number' ? 'text' : type} // "number" type ko text rakh ke regex se control krte hain taake arrows na ayen
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-full px-4 outline-none text-sm font-bold text-[#191919] placeholder:text-gray-300 bg-transparent"
        />
        {suffix && (
          <div className="bg-gray-50 h-full flex items-center px-4 border-l border-gray-100 text-xs font-bold text-gray-500 uppercase">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};