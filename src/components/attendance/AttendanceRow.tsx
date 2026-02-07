"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';

interface Props {
  index: number;
  student: any;
  status: 'present' | 'absent' | 'leave' | null;
  onStatusChange: (id: string, status: string) => void;
}

export const AttendanceRow = ({ index, student, status, onStatusChange }: Props) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`grid grid-cols-12 gap-4 items-center py-4 px-4 border-b border-gray-100 transition-colors ${status === 'absent' ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}
    >
       <div className="col-span-1 font-bold text-gray-400 text-xs">#{student.rollNo}</div>
       <div className="col-span-3 font-bold text-[#191919] text-sm">{student.firstName} {student.lastName}</div>
       <div className="col-span-3 text-xs text-gray-500 font-medium">{student.parentFirstName}</div>

       {/* ATTENDANCE OPTIONS */}
       <div className="col-span-5 flex justify-end gap-2 md:gap-4">
           
           {/* 1. PRESENT BUTTON */}
           <div 
             onClick={() => onStatusChange(student._id, 'present')}
             className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border transition-all select-none
                ${status === 'present' ? 'bg-green-100 border-green-200 text-green-700' : 'border-gray-200 text-gray-400 hover:border-green-200 hover:text-green-600'}
             `}
           >
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${status === 'present' ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300'}`}>
                  {status === 'present' && <Check size={12} strokeWidth={4} />}
              </div>
              <span className="text-xs font-bold uppercase hidden md:inline-block">Present</span>
           </div>

           {/* 2. ABSENT BUTTON */}
           <div 
             onClick={() => onStatusChange(student._id, 'absent')}
             className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border transition-all select-none
                ${status === 'absent' ? 'bg-red-100 border-red-200 text-red-700' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-600'}
             `}
           >
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${status === 'absent' ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-300'}`}>
                  {status === 'absent' && <X size={12} strokeWidth={4} />}
              </div>
              <span className="text-xs font-bold uppercase hidden md:inline-block">Absent</span>
           </div>

           {/* 3. LEAVE BUTTON */}
           <div 
             onClick={() => onStatusChange(student._id, 'leave')}
             className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border transition-all select-none
                ${status === 'leave' ? 'bg-yellow-100 border-yellow-200 text-yellow-700' : 'border-gray-200 text-gray-400 hover:border-yellow-200 hover:text-yellow-600'}
             `}
           >
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${status === 'leave' ? 'bg-yellow-500 border-yellow-500 text-white' : 'bg-white border-gray-300'}`}>
                  {status === 'leave' && <Clock size={12} strokeWidth={4} />}
              </div>
              <span className="text-xs font-bold uppercase hidden md:inline-block">Leave</span>
           </div>

       </div>
    </motion.div>
  );
};