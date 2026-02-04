"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Phone, Users, Plus } from 'lucide-react';

interface SmartInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  mobileValue: string;
  emergencyValue: string;
}

export const SmartPhoneInput = ({ label, name, value, onChange, mobileValue, emergencyValue }: SmartInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click Outside to Close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    if (option === 'mobile') onChange(name, mobileValue);
    if (option === 'emergency') onChange(name, emergencyValue);
    if (option === 'new') onChange(name, ''); // Clear for typing
    setIsOpen(false);
  };

  return (
    <div className="relative w-full mt-2 group" ref={containerRef}>
      
      {/* Input Field */}
      <div 
        onClick={() => setIsOpen(true)}
        className={`w-full h-[55px] border ${isOpen ? 'border-[#B70003]' : 'border-gray-300'} rounded-[12px] px-4 flex items-center justify-between cursor-pointer bg-white relative transition-all hover:border-[#B70003]`}
      >
         <input 
            type="number"
            name={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            className="w-full h-full bg-transparent outline-none text-[#191919] font-medium pt-2 text-sm placeholder-transparent"
            placeholder=" "
         />
         <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-[#B70003]' : ''}`} />

         <label className={`absolute left-3 transition-all pointer-events-none bg-white px-1
           ${(value || isOpen) 
             ? '-top-2.5 text-[12px] text-[#B70003]' 
             : 'top-4 text-gray-400 text-sm'
           }`}>
           {label}
         </label>
      </div>

      {/* Custom Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
             initial={{ opacity: 0, y: 10, scale: 0.95 }} 
             animate={{ opacity: 1, y: 0, scale: 1 }} 
             exit={{ opacity: 0, y: 10, scale: 0.95 }}
             className="absolute top-[60px] left-0 w-full bg-white border border-gray-100 shadow-2xl rounded-[16px] z-50 p-2 font-['Montserrat'] overflow-hidden"
          >
             <div className="flex flex-col gap-1">
                
                {/* Option 1: Same as Mobile */}
                <button 
                  onClick={() => handleSelect('mobile')}
                  disabled={!mobileValue}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                   <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Phone size={14} /></div>
                   <div>
                      <p className="text-xs font-bold text-[#191919]">Same as Mobile No.</p>
                      <p className="text-[10px] text-gray-400">{mobileValue || "Not entered yet"}</p>
                   </div>
                </button>

                {/* Option 2: Same as Emergency */}
                <button 
                  onClick={() => handleSelect('emergency')}
                  disabled={!emergencyValue}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                   <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><Users size={14} /></div>
                   <div>
                      <p className="text-xs font-bold text-[#191919]">Same as Emergency No.</p>
                      <p className="text-[10px] text-gray-400">{emergencyValue || "Not entered yet"}</p>
                   </div>
                </button>

                <div className="h-[1px] bg-gray-100 my-1"></div>

                {/* Option 3: Add New */}
                <button 
                  onClick={() => handleSelect('new')}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                   <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"><Plus size={14} /></div>
                   <p className="text-xs font-bold text-[#191919]">Type New Number</p>
                </button>

             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};