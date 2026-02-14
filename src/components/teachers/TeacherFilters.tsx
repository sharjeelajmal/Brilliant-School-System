"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, ChevronDown, Check, X, User, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ModernDropdown = ({ label, value, options, onChange, icon: Icon }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<any>(null);
    useEffect(() => {
        const handleClick = (e: any) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="relative w-full" ref={ref}>
            <div onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-between h-[50px] bg-white border rounded-xl px-4 cursor-pointer hover:shadow-sm transition-all ${isOpen || value ? 'border-[#B50104] ring-1 ring-[#B50104]/20' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-1.5 rounded-md ${value ? 'bg-red-50 text-[#B50104]' : 'bg-gray-100 text-gray-400'}`}><Icon size={16} /></div>
                    <span className={`text-sm font-bold truncate ${value ? 'text-[#191919]' : 'text-gray-400'}`}>{value || label}</span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-[56px] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden p-1 max-h-[250px] overflow-y-auto custom-scrollbar">
                        {value && <div onClick={() => { onChange(''); setIsOpen(false); }} className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"><X size={14} /> Clear</div>}
                        {options.map((opt: string) => (
                            <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer ${value === opt ? 'bg-[#B50104] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{opt} {value === opt && <Check size={14} />}</div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const TeacherFilters = ({ search, setSearch, gender, setGender, designation, setDesignation, designationsList }: any) => {
    return (
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="relative w-full">
                <input type="text" placeholder="Search teacher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-[50px] border border-gray-200 rounded-xl pl-12 pr-4 outline-none focus:border-[#B50104] focus:ring-1 focus:ring-[#B50104]/20 transition-all text-sm font-bold bg-gray-50/50 focus:bg-white text-[#191919]" />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <ModernDropdown label="All Genders" value={gender} onChange={setGender} options={["Male", "Female"]} icon={User} />
            <ModernDropdown label="All Designations" value={designation} onChange={setDesignation} options={designationsList} icon={BookOpen} />
        </div>
    );
};