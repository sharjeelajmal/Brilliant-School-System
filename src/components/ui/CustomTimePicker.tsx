"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check } from 'lucide-react';

interface TimeProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
}

export const CustomTimePicker = ({ label, name, value, onChange }: TimeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parseTime = (val: string) => {
    if (!val) return { hour: '12', minute: '00', period: 'AM' };
    const [time, period] = val.split(' ');
    const [hour, minute] = time.split(':');
    return { hour, minute, period };
  };

  const [selected, setSelected] = useState(parseTime(value));

  useEffect(() => {
    if (value) setSelected(parseTime(value));
  }, [value]);

  const triggerChange = (newTimeStr: string) => {
    onChange({
      target: {
        name: name,
        value: newTimeStr
      }
    });
  };

  const handleOpen = () => {
    if (!isOpen && !value) {
      const defaultTime = "12:00 PM";
      setSelected(parseTime(defaultTime));
      triggerChange(defaultTime);
    }
    setIsOpen(!isOpen);
  };

  const updateTime = (key: 'hour' | 'minute' | 'period', val: string) => {
    const newTime = { ...selected, [key]: val };
    setSelected(newTime);
    const timeString = `${newTime.hour}:${newTime.minute} ${newTime.period}`;
    triggerChange(timeString);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  return (
    <div 
      className="relative w-full mt-2" 
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <div 
        onClick={handleOpen}
        tabIndex={0}
        // FIX: Border Red sirf tab hoga jab isOpen=true ho. Value hone par Gray rahega.
        className={`w-full h-[55px] border ${isOpen ? 'border-[#B70003]' : 'border-gray-300'} rounded-[12px] px-4 flex items-center justify-between cursor-pointer bg-white relative transition-all hover:border-[#B70003] outline-none focus:border-[#B70003]`}
      >
         <span className={`text-sm font-medium pt-2 ${value ? 'text-[#191919]' : 'text-transparent'}`}>
           {value || "Select Time"}
         </span>
         {/* Icon Color bhi sirf Open hone par Red hoga */}
         <Clock size={18} className={`transition-colors ${isOpen ? 'text-[#B70003]' : 'text-gray-400'}`} />
         
         {/* Label Color bhi fix kar diya hai (Open=Red, Closed=Gray) */}
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
             initial={{ opacity: 0, scale: 0.95, y: 10 }} 
             animate={{ opacity: 1, scale: 1, y: 0 }} 
             exit={{ opacity: 0, scale: 0.95, y: 10 }}
             className="absolute top-[65px] left-0 w-full bg-white border border-gray-100 shadow-2xl rounded-[16px] z-50 p-0 font-['Montserrat'] overflow-hidden flex flex-col"
          >
            <div className="flex justify-between h-[150px] p-2 gap-1">
                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center gap-1 border-r border-gray-50">
                   <span className="text-[9px] font-bold text-gray-300 mb-1 sticky top-0 bg-white w-full text-center py-1">HR</span>
                   {hours.map(h => (
                     <div key={h} onClick={(e) => { e.stopPropagation(); updateTime('hour', h); }} 
                       className={`w-full text-center py-1.5 rounded-md cursor-pointer text-xs font-bold transition-all ${selected.hour === h ? 'bg-[#B70003] text-white shadow-md' : 'hover:bg-red-50 text-gray-600'}`}>
                       {h}
                     </div>
                   ))}
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center gap-1 border-r border-gray-50">
                   <span className="text-[9px] font-bold text-gray-300 mb-1 sticky top-0 bg-white w-full text-center py-1">MIN</span>
                   {minutes.map(m => (
                     <div key={m} onClick={(e) => { e.stopPropagation(); updateTime('minute', m); }} 
                       className={`w-full text-center py-1.5 rounded-md cursor-pointer text-xs font-bold transition-all ${selected.minute === m ? 'bg-[#B70003] text-white shadow-md' : 'hover:bg-red-50 text-gray-600'}`}>
                       {m}
                     </div>
                   ))}
                </div>

                <div className="flex-1 flex flex-col items-center justify-center gap-2 p-1">
                   {['AM', 'PM'].map(p => (
                     <div key={p} onClick={(e) => { e.stopPropagation(); updateTime('period', p); }} 
                       className={`w-full text-center py-2 rounded-lg cursor-pointer text-xs font-bold transition-all border ${selected.period === p ? 'bg-[#B70003] text-white border-[#B70003] shadow-md' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-red-200'}`}>
                       {p}
                     </div>
                   ))}
                </div>
            </div>

            <div className="p-2 border-t border-gray-100 bg-gray-50">
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                    className="w-full py-2 bg-[#191919] hover:bg-[#B70003] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                    Set Time <Check size={14} />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};