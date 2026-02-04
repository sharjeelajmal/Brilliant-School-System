"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface RowProps {
  student: any;
  obtainedMarks: string;
  totalMarks: string;
  passingMarks: string;
  onMarkChange: (id: string, value: string) => void;
  index: number;
}

export const TestReportRow = ({ 
  student, obtainedMarks, totalMarks, passingMarks, onMarkChange, index 
}: RowProps) => {
  
  // --- Auto Calculations ---
  const obtained = parseFloat(obtainedMarks) || 0;
  const total = parseFloat(totalMarks) || 0;
  const passing = parseFloat(passingMarks) || 0;

  const percentage = total > 0 ? ((obtained / total) * 100).toFixed(1) + '%' : '-';
  
  // Status Logic
  let status = '-';
  let statusColor = 'text-gray-400';
  
  if (total > 0 && obtainedMarks !== '') {
    if (obtained >= passing) {
      status = 'Pass';
      statusColor = 'text-green-600 bg-green-50 px-2 py-1 rounded-md';
    } else {
      status = 'Fail';
      statusColor = 'text-red-600 bg-red-50 px-2 py-1 rounded-md';
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors px-4"
    >
      <div className="col-span-1 text-gray-400 font-bold text-xs">{String(index + 1).padStart(2, '0')}</div>
      <div className="col-span-2 font-bold text-[#191919] text-sm truncate">{student.firstName}</div>
      <div className="col-span-2 font-medium text-gray-500 text-sm truncate">{student.fatherName}</div>
      
      {/* Obtained Marks Input */}
      <div className="col-span-3 flex justify-center">
        <input 
          type="number" 
          value={obtainedMarks}
          onChange={(e) => onMarkChange(student.id, e.target.value)}
          className="w-24 h-10 border border-gray-300 rounded-lg text-center outline-none focus:border-[#B70003] font-bold text-[#191919] transition-all bg-white"
          placeholder="00"
        />
      </div>

      {/* Percentage (Auto) */}
      <div className="col-span-2 text-center font-medium text-gray-600 text-sm">
        {percentage}
      </div>

      {/* Status (Auto) */}
      <div className="col-span-2 text-center text-xs font-bold flex justify-center">
        <span className={statusColor}>{status}</span>
      </div>
    </motion.div>
  );
};