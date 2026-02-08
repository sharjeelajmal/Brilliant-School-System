"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, MessageCircle, Phone } from 'lucide-react';

export const TeachersTable = ({ teachers, loading, onProfile, onContact }: any) => {
  return (
    <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden min-h-[400px]">
        <div className="grid grid-cols-12 gap-4 py-5 px-6 bg-gray-50 border-b border-gray-100">
            <div className="col-span-1 text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Sr.#</div>
            <div className="col-span-3 text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Teacher Name</div>
            <div className="col-span-2 text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Gender</div>
            <div className="col-span-3 text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Assigned Class</div>
            <div className="col-span-3 text-right text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Actions</div>
        </div>

        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
            {loading ? (
                <div className="p-20 text-center text-gray-400 font-bold animate-pulse">Loading Teachers...</div>
            ) : teachers.length === 0 ? (
                <div className="p-20 text-center text-gray-400">No teachers found.</div>
            ) : (
                teachers.map((t: any, i: number) => (
                   <motion.div 
                        key={t._id} 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        // Added cursor-pointer
                        className="grid grid-cols-12 gap-4 items-center py-4 px-6 border-b border-gray-50 hover:bg-red-50/30 transition-colors group cursor-pointer"
                   >
                        <div className="col-span-1 font-bold text-gray-400 text-sm">#{i + 1}</div>
                        <div className="col-span-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#B50104] font-bold text-xs border border-gray-200">
                                {t.firstName.charAt(0)}
                            </div>
                            <div className="font-bold text-[#191919] text-sm group-hover:text-[#B50104] transition-colors">
                                {t.firstName} {t.lastName}
                            </div>
                        </div>
                        {/* Gender ab real data show karega */}
                        <div className="col-span-2 text-xs font-bold text-gray-500">{t.gender || '-'}</div>
                        <div className="col-span-3">
                            {t.assignedClass ? (
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                                    {t.assignedClass} - {t.assignedSection}
                                </span>
                            ) : <span className="text-gray-300 text-xs italic">Not Assigned</span>}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="col-span-3 flex justify-end gap-2 opacity-80 group-hover:opacity-100">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onProfile(t._id); }} 
                                className="text-[#0073BB] text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer p-2 hover:bg-blue-50 rounded-lg transition-all"
                            >
                                <Eye size={14} /> Profile
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onContact(t); }} 
                                className="text-green-600 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer p-2 hover:bg-green-50 rounded-lg transition-all"
                            >
                                <MessageCircle size={14} /> Contact
                            </button>
                        </div>
                   </motion.div>
                ))
            )}
        </div>
    </div>
  );
};