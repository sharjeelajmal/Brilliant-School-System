"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  index: number;
  student: any;
  obtainedMarks: string | number;
  totalMarks: string | number;
  passingMarks: string | number;
  onMarkChange: (id: string, value: string) => void;
}

export const TestReportRow = ({ index, student, obtainedMarks, totalMarks, passingMarks, onMarkChange }: Props) => {
  
  // Percentage Calculation
  const obtained = Number(obtainedMarks) || 0;
  const total = Number(totalMarks) || 100;
  const percentage = Math.round((obtained / total) * 100);
  
  // Status Logic
  const isPassed = obtained >= Number(passingMarks);
  const statusColor = isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="grid grid-cols-12 gap-4 items-center py-4 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
       <div className="col-span-1 font-bold text-gray-400 text-xs">#{student.rollNo}</div>
       <div className="col-span-2 font-bold text-[#191919] text-sm">{student.firstName} {student.lastName}</div>
       <div className="col-span-2 text-xs text-gray-500 font-medium">{student.parentFirstName}</div>
       
       {/* OBTAINED MARKS INPUT (FIXED) */}
       <div className="col-span-3 flex justify-center">
          <input 
            type="number" 
            value={obtainedMarks}
            onChange={(e) => onMarkChange(student._id, e.target.value)} // <--- YE LINE ZAROORI HAI
            placeholder="0"
            className={`w-24 h-10 text-center font-bold border-2 rounded-lg outline-none focus:border-[#B70003] transition-all
                ${isPassed ? 'border-gray-200 text-[#191919]' : 'border-red-200 text-red-600 bg-red-50'}
            `}
          />
       </div>

       <div className="col-span-2 text-center">
           <span className="font-black text-gray-700">{percentage}%</span>
       </div>

       <div className="col-span-2 text-center">
           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusColor}`}>
               {isPassed ? "Pass" : "Fail"}
           </span>
       </div>
    </motion.div>
  );
};