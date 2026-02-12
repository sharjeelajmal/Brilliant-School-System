"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, MessageCircle, UserX, AlertTriangle, X } from 'lucide-react';

export const TeachersTable = ({ teachers, loading, onProfile, onContact, onFire }: any) => {
    const [fireTarget, setFireTarget] = useState<any>(null);

    const handleConfirmFire = () => {
        if (fireTarget && onFire) {
            onFire(fireTarget._id, `${fireTarget.firstName} ${fireTarget.lastName}`);
        }
        setFireTarget(null);
    };

    return (
        <>
            {/* Fire Confirmation Modal */}
            <AnimatePresence>
                {fireTarget && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[24px] shadow-2xl w-full max-w-[400px] overflow-hidden font-['Montserrat']">
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle size={32} className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-black text-[#191919] mb-2">Remove Teacher?</h3>
                                <p className="text-sm text-gray-500 font-medium mb-1">
                                    Kya aap <span className="font-bold text-[#B50104]">{fireTarget.firstName} {fireTarget.lastName}</span> ko remove karna chahte hain?
                                </p>
                                <p className="text-xs text-gray-400 font-medium">Ye action undo nahi ho sakta.</p>
                            </div>
                            <div className="px-6 pb-6 flex gap-3">
                                <button onClick={() => setFireTarget(null)} className="flex-1 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer text-sm">Cancel</button>
                                <button onClick={handleConfirmFire} className="flex-1 py-3.5 bg-[#B50104] text-white font-bold rounded-xl hover:bg-[#900000] shadow-lg shadow-red-200 transition-all cursor-pointer text-sm flex items-center justify-center gap-2 active:scale-95">
                                    <UserX size={16} /> Yes, Remove
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden min-h-[400px]">
                <div className="grid grid-cols-12 gap-4 py-5 px-6 bg-gray-50 border-b border-gray-100">
                    <div className="col-span-1 text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Sr.#</div>
                    <div className="col-span-3 text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Teacher Name</div>
                    <div className="col-span-2 text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Gender</div>
                    <div className="col-span-2 text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Assigned Class</div>
                    <div className="col-span-4 text-right text-[#3C3C3C] font-bold text-xs uppercase tracking-wider">Actions</div>
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
                                <div className="col-span-2 text-xs font-bold text-gray-500">{t.gender || '-'}</div>
                                <div className="col-span-2">
                                    {t.assignedClass ? (
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                                            {t.assignedClass} - {t.assignedSection}
                                        </span>
                                    ) : <span className="text-gray-300 text-xs italic">Not Assigned</span>}
                                </div>

                                {/* Action Buttons */}
                                <div className="col-span-4 flex justify-end gap-2 opacity-80 group-hover:opacity-100">
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
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setFireTarget(t); }}
                                        className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer p-2 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <UserX size={14} /> Fire / Left
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};