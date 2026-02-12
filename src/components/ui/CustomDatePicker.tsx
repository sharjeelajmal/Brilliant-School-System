"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  disableFuture?: boolean;
  align?: 'left' | 'right';
}

export const CustomDatePicker = ({ label, value, onChange, name, disableFuture = false, align = 'left' }: DateProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(value ? new Date(value) : new Date());

  const [showMonthList, setShowMonthList] = useState(false);
  const [showYearList, setShowYearList] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowMonthList(false);
        setShowYearList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentYear = today.getFullYear();
  const startYear = disableFuture ? currentYear : currentYear + 10;
  const years = Array.from({ length: 100 }, (_, i) => startYear - i);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleDayClick = (d: number) => {
    const selectedDate = new Date(date.getFullYear(), date.getMonth(), d);
    if (disableFuture && selectedDate > today) return;

    const dateString = selectedDate.toLocaleDateString('en-CA');
    onChange(name, dateString);
    setIsOpen(false); // Close on select
  };

  // ... (Year/Month change handlers same as before) ...
  const changeYear = (year: number) => { setDate(new Date(year, date.getMonth(), 1)); setShowYearList(false); };
  const changeMonth = (monthIndex: number) => { setDate(new Date(date.getFullYear(), monthIndex, 1)); setShowMonthList(false); };
  const handlePrevMonth = (e: React.MouseEvent) => { e.stopPropagation(); setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1)); };
  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    if (disableFuture && nextMonth > new Date(today.getFullYear(), today.getMonth() + 1, 0)) return;
    setDate(nextMonth);
  };

  return (
    <div className="relative w-full mt-2" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        // FIX: Border Logic Updated
        className={`w-full h-[55px] border ${isOpen ? 'border-[#B70003]' : 'border-gray-300'} rounded-[12px] px-4 flex items-center justify-between cursor-pointer bg-white relative transition-all hover:border-[#B70003]`}
      >
        <span className={`text-sm font-medium pt-2 ${value ? 'text-[#191919]' : 'text-transparent'}`}>
          {value || "Select Date"}
        </span>
        <CalIcon size={18} className={`transition-colors ${isOpen ? 'text-[#B70003]' : 'text-gray-400'}`} />

        {/* FIX: Label Color Logic Updated */}
        <label className={`absolute left-3 transition-all pointer-events-none bg-white px-1
           ${(value || isOpen)
            ? `-top-2.5 text-[12px] ${isOpen ? 'text-[#B70003]' : 'text-gray-400'}`
            : 'top-4 text-gray-400 text-sm'
          }`}>
          {label}
        </label>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`absolute top-[65px] ${align === 'right' ? 'right-0' : 'left-0'} w-[320px] bg-white border border-gray-100 shadow-2xl rounded-[16px] z-50 p-5 font-['Montserrat']`}
          >
            {/* ... Calendar Internal UI same as before ... */}
            <div className="flex justify-between items-center mb-4 relative z-20">
              <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><ChevronLeft size={20} /></button>
              <div className="flex gap-2">
                <div className="relative">
                  <button type="button" onClick={() => { setShowMonthList(!showMonthList); setShowYearList(false); }} className="flex items-center gap-1 font-bold text-[#191919] hover:text-[#B70003] transition-colors text-sm bg-gray-50 px-2 py-1 rounded-md">{months[date.getMonth()]} <ChevronDown size={14} /></button>
                  {showMonthList && (<div className="absolute top-full left-0 mt-1 w-[120px] bg-white border border-gray-100 shadow-xl rounded-lg max-h-[200px] overflow-y-auto z-50">{months.map((m, i) => (<div key={m} onClick={() => changeMonth(i)} className={`px-3 py-2 text-xs font-medium cursor-pointer hover:bg-red-50 hover:text-[#B70003] ${i === date.getMonth() ? 'text-[#B70003] bg-red-50' : 'text-gray-600'}`}>{m}</div>))}</div>)}
                </div>
                <div className="relative">
                  <button type="button" onClick={() => { setShowYearList(!showYearList); setShowMonthList(false); }} className="flex items-center gap-1 font-bold text-[#191919] hover:text-[#B70003] transition-colors text-sm bg-gray-50 px-2 py-1 rounded-md">{date.getFullYear()} <ChevronDown size={14} /></button>
                  {showYearList && (<div className="absolute top-full right-0 mt-1 w-[80px] bg-white border border-gray-100 shadow-xl rounded-lg max-h-[200px] overflow-y-auto z-50">{years.map((y) => (<div key={y} onClick={() => changeYear(y)} className={`px-3 py-2 text-xs font-medium cursor-pointer hover:bg-red-50 hover:text-[#B70003] ${y === date.getFullYear() ? 'text-[#B70003] bg-red-50' : 'text-gray-600'}`}>{y}</div>))}</div>)}
                </div>
              </div>
              <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-500"><ChevronRight size={20} /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] mb-2 text-gray-400 font-bold uppercase tracking-wide">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}</div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay(date.getFullYear(), date.getMonth()) }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth(date.getFullYear(), date.getMonth()) }).map((_, i) => {
                const d = i + 1;
                const currentDayDate = new Date(date.getFullYear(), date.getMonth(), d);
                const isSelected = value === currentDayDate.toLocaleDateString('en-CA');
                const isFuture = disableFuture && currentDayDate > today;
                return (<div key={d} onClick={(e) => { e.stopPropagation(); if (!isFuture) handleDayClick(d); }} className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-medium transition-all ${isFuture ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:bg-red-50 hover:text-[#B70003] text-gray-700'} ${isSelected ? 'bg-[#B70003] text-white hover:bg-[#950002] hover:text-white shadow-md' : ''}`}>{d}</div>)
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};