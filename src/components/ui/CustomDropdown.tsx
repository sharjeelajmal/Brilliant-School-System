"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (name: string, value: string) => void;
  disabled?: boolean; // FIX: Added disabled prop here
}

export const CustomDropdown = ({ label, options, value, onChange, name, disabled }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mt-4 group" ref={containerRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)} // FIX: Disable click if disabled
        className={`w-full h-[55px] border ${isOpen ? 'border-[#B70003]' : 'border-gray-300'} rounded-[12px] px-4 flex items-center justify-between bg-white relative transition-all 
        ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'cursor-pointer hover:border-[#B70003]'}`}
      >
        <span className={`text-sm font-medium pt-2 ${value ? 'text-[#191919]' : 'text-transparent'}`}>
          {value || "Select"}
        </span>
        <ChevronDown size={18} className={`transition-transform text-gray-400 ${isOpen ? 'rotate-180 text-[#B70003]' : ''}`} />

        <label className={`absolute left-3 transition-all pointer-events-none px-1
           ${(value || isOpen)
            ? `-top-2.5 text-[12px] ${isOpen ? 'text-[#B70003]' : 'text-gray-400'} bg-white`
            : 'top-4 text-gray-400 text-sm bg-transparent'
          }`}>
          {label}
        </label>
      </div>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-[60px] left-0 w-full bg-white border border-gray-100 shadow-xl rounded-[12px] z-50 overflow-hidden max-h-[200px] overflow-y-auto"
          >
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => { onChange(name, opt); setIsOpen(false); }}
                className="px-4 py-3 hover:bg-red-50 text-sm cursor-pointer text-gray-600 hover:text-[#B70003] transition-colors border-b border-gray-50 last:border-none"
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};