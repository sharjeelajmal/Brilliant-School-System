"use client";
import React from 'react';

interface InputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  // New Type: 'alphanumeric' for addresses/classes (allows text + numbers + symbols)
  type?: "text" | "number" | "cnic" | "alphanumeric"; 
  suffix?: string;
}

export const CustomInput = ({ label, name, value, onChange, placeholder, className = "", type = "text", suffix }: InputProps) => {
  
  const handleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Strict Alphabet Only (Names)
    if (type === "text" && !/^[a-zA-Z\s]*$/.test(val)) return;
    
    // Numeric Only (Fees etc)
    if (type === "number" && !/^\d*\.?\d*$/.test(val)) return;
    
    // CNIC
    if (type === "cnic" && !/^[0-9-]*$/.test(val)) return;

    // Alphanumeric (Address, Class etc - Allows everything essentially)
    if (type === "alphanumeric") {
      // No validation, allow everything
    }

    onChange(e);
  };

  const paddingRight = suffix ? `${suffix.length * 8 + 20}px` : '16px';

  return (
    <div className={`relative w-full group mt-2 ${className}`}>
      <input 
        type={type === "number" ? "text" : "text"}
        name={name}
        value={value}
        onChange={handleValidation}
        placeholder={placeholder || " "} 
        style={{ paddingRight: paddingRight }}
        className={`peer w-full h-[55px] bg-transparent border border-gray-300 rounded-[12px] pl-4 text-[#191919] font-medium outline-none focus:border-[#B70003] transition-all pt-2 placeholder-transparent`}
      />
      <label className="absolute left-3 top-4 text-gray-400 text-sm transition-all peer-focus:-top-2.5 peer-focus:text-[12px] peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#B70003] peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 pointer-events-none">
        {label}
      </label>
      
      {suffix && (
        <span className="absolute right-4 top-[18px] text-xs font-bold text-gray-400 pointer-events-none bg-white pl-2">
          {suffix}
        </span>
      )}
    </div>
  );
};