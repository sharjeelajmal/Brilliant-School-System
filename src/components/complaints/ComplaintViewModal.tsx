"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, User, BookOpen, Quote } from 'lucide-react';

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const ComplaintViewModal = ({ isOpen, onClose, data }: ViewModalProps) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
        className="bg-white rounded-[20px] shadow-2xl w-full max-w-[400px] overflow-hidden font-['Montserrat'] relative flex flex-col max-h-[90vh]"
      >
        {/* Header - Compact & Stylish */}
        <div className="bg-[#B70003] px-5 py-3 text-white flex justify-between items-center shrink-0">
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Complaint ID</span>
                <span className="font-mono text-sm font-bold">#{String(data.rollNo).padStart(3, '0')}</span>
            </div>
            <button 
                onClick={onClose} 
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer active:scale-90"
            >
                <X size={16} />
            </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar">
            
            {/* Student Profile Row */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#B70003] to-orange-400">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#B70003] font-black text-lg">
                        {data.studentName.charAt(0)}
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-[#191919] text-base leading-tight">{data.studentName}</h3>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                           <BookOpen size={10} /> {data.className} - {data.section}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                           <Calendar size={10} /> {data.date}
                        </span>
                    </div>
                </div>
            </div>

            {/* Complaint Content */}
            <div className="space-y-2">
                 <h4 className="text-sm font-bold text-[#B70003] uppercase tracking-wide">{data.title}</h4>
                 <div className="relative bg-red-50/50 p-4 rounded-xl border border-red-100">
                     <Quote size={16} className="text-red-200 absolute top-2 left-2 transform -scale-x-100" />
                     <p className="text-sm text-gray-700 font-medium leading-relaxed relative z-10 pl-2">
                        {data.description}
                     </p>
                 </div>
            </div>

        </div>

        {/* Footer - Teacher & Action */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden border border-white shadow-sm">
                    <img src={`https://ui-avatars.com/api/?name=${data.teacherName || 'Admin'}&background=random`} alt="admin" />
                </div>
                <div className="text-[10px] leading-tight">
                    <p className="text-gray-400 font-bold uppercase">Reported By</p>
                    <p className="font-bold text-[#191919]">{data.teacherName || "Admin"}</p>
                </div>
            </div>
            <button 
                onClick={onClose} 
                className="px-5 py-2 bg-[#191919] text-white text-xs font-bold rounded-lg shadow-lg hover:bg-black transition-transform active:scale-95 cursor-pointer"
            >
                Close
            </button>
        </div>
      </motion.div>
    </div>
  );
};