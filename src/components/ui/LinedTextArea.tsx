"use client";
import React from 'react';

interface LinedProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const LinedTextArea = ({ value, onChange, placeholder }: LinedProps) => {
  return (
    <div className="relative w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[400px] bg-transparent resize-none outline-none text-[#3C3C3C] text-lg font-medium leading-[50px] p-0"
        style={{
          backgroundImage: "repeating-linear-gradient(transparent, transparent 49px, #CCCCCC 50px)",
          backgroundAttachment: "local",
          lineHeight: "50px",
          paddingTop: "10px" // Adjust to align text on line
        }}
      />
    </div>
  );
};