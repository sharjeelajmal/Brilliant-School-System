"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Circle } from 'lucide-react';

interface RowProps {
  student: any;
  status: 'present' | 'absent' | 'leave' | null;
  onStatusChange: (id: string, status: 'present' | 'absent' | 'leave') => void;
  index: number;
}

export const AttendanceRow = ({ student, status, onStatusChange, index }: RowProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors px-4"
    >
      <div className="col-span-1 text-gray-400 font-bold text-xs">{String(index + 1).padStart(2, '0')}</div>
      <div className="col-span-3 font-bold text-[#191919] text-sm">{student.firstName}</div>
      <div className="col-span-3 font-medium text-gray-500 text-sm">{student.fatherName || student.lastName}</div>
      
      {/* Status Buttons */}
      <div className="col-span-5 flex justify-end gap-6">
        
        {/* Present */}
        <label className={`cursor-pointer flex items-center gap-2 text-xs font-bold transition-all ${status === 'present' ? 'text-green-600' : 'text-gray-300 hover:text-green-400'}`}>
          <div 
            onClick={() => onStatusChange(student.id, 'present')}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${status === 'present' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
          >
            {status === 'present' && <Check size={12} strokeWidth={4} />}
          </div>
          Present
        </label>

        {/* Absent */}
        <label className={`cursor-pointer flex items-center gap-2 text-xs font-bold transition-all ${status === 'absent' ? 'text-red-600' : 'text-gray-300 hover:text-red-400'}`}>
          <div 
            onClick={() => onStatusChange(student.id, 'absent')}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${status === 'absent' ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          >
            {status === 'absent' && <X size={12} strokeWidth={4} />}
          </div>
          Absent
        </label>

        {/* Leave */}
        <label className={`cursor-pointer flex items-center gap-2 text-xs font-bold transition-all ${status === 'leave' ? 'text-yellow-600' : 'text-gray-300 hover:text-yellow-400'}`}>
          <div 
            onClick={() => onStatusChange(student.id, 'leave')}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${status === 'leave' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300'}`}
          >
            {status === 'leave' && <Circle size={8} fill="currentColor" />}
          </div>
          Leave
        </label>

      </div>
    </motion.div>
  );
};