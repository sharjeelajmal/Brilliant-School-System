"use client";
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface MultiInputProps {
  label: string;
  name: string;
  // Value will be comma separated string "0300123, 0321456"
  value: string; 
  onChange: (name: string, value: string) => void;
  type?: "number" | "text";
}

export const MultiInput = ({ label, name, value, onChange, type = "number" }: MultiInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Convert comma string to array
  const items = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    const newItems = [...items, inputValue.trim()];
    onChange(name, newItems.join(', '));
    setInputValue("");
  };

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(name, newItems.join(', '));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="relative w-full mt-2 group">
      <div className={`min-h-[55px] border ${isFocused ? 'border-[#B70003]' : 'border-gray-300'} rounded-[12px] px-3 py-2 bg-white flex flex-wrap gap-2 items-center transition-all`}>
        
        {/* Render Tags */}
        {items.map((item, idx) => (
          <span key={idx} className="bg-red-50 text-[#B70003] px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 border border-red-100">
            {item}
            <X size={12} className="cursor-pointer hover:text-red-700" onClick={() => handleRemove(idx)} />
          </span>
        ))}

        {/* Input Field */}
        <input 
          type={type}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent outline-none text-[#191919] font-medium text-sm h-8 min-w-[100px]"
          placeholder=" "
        />

        {/* Add Button */}
        {inputValue && (
          <button onClick={(e) => {e.preventDefault(); handleAdd();}} className="bg-[#B70003] text-white p-1 rounded-full hover:scale-110 transition-transform">
            <Plus size={14} />
          </button>
        )}
      </div>

      <label className={`absolute left-3 transition-all pointer-events-none bg-white px-1
         ${(isFocused || items.length > 0 || inputValue) 
           ? '-top-2.5 text-[12px] text-[#B70003]' 
           : 'top-4 text-gray-400 text-sm'
         }`}>
         {label} <span className="text-[10px] text-gray-300">(Type & Enter)</span>
      </label>
    </div>
  );
};