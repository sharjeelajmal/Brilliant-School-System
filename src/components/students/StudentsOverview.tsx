"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, Filter, ChevronDown, Check, X,
    User, MessageCircle, Eye, Calendar, Trash2, AlertTriangle
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

// --- IMPORT EXISTING PROFILE COMPONENT ---
import { StudentProfile } from '@/components/dashboard/StudentProfile';

// --- 1. DELETE MODAL ---
const DeleteModal = ({ isOpen, onClose, onConfirm }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[24px] shadow-2xl w-full max-w-[320px] p-6 text-center font-['Montserrat']"
            >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#B50104]">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-lg font-black text-[#191919] mb-2">Delete Student?</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">Are you sure? This action will permanently remove the student record.</p>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-[#B50104] text-white font-bold rounded-xl hover:bg-[#900000] shadow-lg shadow-red-200 transition-colors cursor-pointer">
                        Delete
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// --- 2. MODERN DROPDOWN COMPONENT ---
const ModernDropdown = ({ label, value, options, onChange, icon: Icon }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<any>(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={ref}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between h-[50px] bg-white border rounded-xl px-4 cursor-pointer transition-all hover:shadow-sm ${isOpen || value ? 'border-[#B50104] ring-1 ring-[#B50104]/20' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-1.5 rounded-md ${value ? 'bg-red-50 text-[#B50104]' : 'bg-gray-100 text-gray-400'}`}>
                        <Icon size={16} />
                    </div>
                    <span className={`text-sm font-bold truncate ${value ? 'text-[#191919]' : 'text-gray-400'}`}>
                        {value || label}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-[56px] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                    >
                        <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                            {value && (
                                <div onClick={() => { onChange(''); setIsOpen(false); }} className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg cursor-pointer mb-1">
                                    <X size={14} /> Clear Selection
                                </div>
                            )}
                            {options.map((opt: string) => (
                                <div
                                    key={opt}
                                    onClick={() => { onChange(opt); setIsOpen(false); }}
                                    className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-colors mb-0.5 ${value === opt ? 'bg-[#B50104] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {opt}
                                    {value === opt && <Check size={14} />}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- 3. STAT CARD ---
const RedStatCard = ({ label, value, delay }: { label: string, value: number, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}
        className="relative h-[130px] rounded-[16px] overflow-hidden bg-[#B50104] shadow-xl flex flex-col justify-center px-6 group cursor-default"
    >
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#C60205] opacity-60 rounded-full group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute right-12 bottom-[-20px] w-20 h-20 bg-[#C60205] opacity-60 rounded-full" />
        <div className="relative z-10 text-white">
            <h3 className="text-5xl font-black tracking-tighter mb-1">{value}</h3>
            <p className="text-sm font-medium opacity-90 uppercase tracking-widest">{label}</p>
        </div>
    </motion.div>
);

// --- 4. MAIN COMPONENT ---
export const StudentsOverview = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // STATE FOR PROFILE VIEW & DELETE
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [attendanceFilter, setAttendanceFilter] = useState('');

    const [classes, setClasses] = useState<string[]>([]);
    const [stats, setStats] = useState({ total: 0, boys: 0, girls: 0, sections: 0 });

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const sRes = await fetch('/api/students');
            const sData = await sRes.json();
            const cRes = await fetch('/api/classes');
            const cData = await cRes.json();

            if (sData.success) {
                const allStudents = sData.data;
                setStudents(allStudents);
                setFilteredStudents(allStudents);

                // Calculate Global Stats
                setStats({
                    total: allStudents.length,
                    boys: allStudents.filter((s: any) => s.gender === 'Boy').length,
                    girls: allStudents.filter((s: any) => s.gender === 'Girl').length,
                    sections: new Set(allStudents.map((s: any) => `${s.classJoining}-${s.section}`)).size
                });
            }
            if (cData.data) setClasses(cData.data.map((c: any) => c.name));

        } catch (error) { toast.error("Failed to load students"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    // Filter Logic
    useEffect(() => {
        let temp = [...students];
        if (search) temp = temp.filter(s => (s.firstName + ' ' + s.lastName).toLowerCase().includes(search.toLowerCase()) || (s.rollNo?.toString().includes(search)));
        if (genderFilter) temp = temp.filter(s => s.gender === genderFilter);
        if (classFilter) temp = temp.filter(s => s.classJoining === classFilter);
        if (attendanceFilter) {
            temp = temp.filter(s => {
                const total = s.attendanceStats?.total || 0;
                const present = s.attendanceStats?.present || 0;
                const percentage = total === 0 ? 0 : (present / total) * 100;
                if (attendanceFilter.includes("Excellent")) return percentage >= 90;
                if (attendanceFilter.includes("Average")) return percentage >= 50 && percentage < 90;
                if (attendanceFilter.includes("Poor")) return percentage < 50;
                return true;
            });
        }
        setFilteredStudents(temp);
    }, [search, genderFilter, classFilter, attendanceFilter, students]);

    // Handle Contact
    const handleContact = (student: any) => {
        const number = student.whatsappNo || student.mobileNo;
        if (!number) { toast.error("No contact number found!"); return; }
        let cleanNum = number.replace(/[^0-9]/g, '');
        if (cleanNum.startsWith('03')) cleanNum = '92' + cleanNum.substring(1);
        window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(`Assalam-o-Alaikum, regarding ${student.firstName} ${student.lastName}.`)}`, '_blank');
    };

    // Handle Delete
    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/students?id=${deleteId}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Student Deleted Successfully!");
                // Remove from local state immediately for speed
                setStudents(prev => prev.filter(s => s._id !== deleteId));
                setFilteredStudents(prev => prev.filter(s => s._id !== deleteId));
                setStats(prev => ({ ...prev, total: prev.total - 1 }));
            } else {
                toast.error("Failed to delete student");
            }
        } catch (error) { toast.error("Error deleting student"); }
        finally { setDeleteId(null); }
    };

    // --- SHOW SHARED PROFILE ---
    if (selectedStudentId) {
        return <StudentProfile studentId={selectedStudentId} onBack={() => setSelectedStudentId(null)} />;
    }

    return (
        <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <Toaster position="top-center" richColors />

            {/* DELETE MODAL */}
            <AnimatePresence>
                {deleteId && <DeleteModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} />}
            </AnimatePresence>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#B50104] uppercase tracking-tighter mb-1">Students</h1>
                    <p className="text-gray-400 font-bold text-sm">Overview of all registered students</p>
                </div>
                <button onClick={() => onNavigate('forms')} className="h-[50px] px-8 bg-[#B50104] text-white font-bold rounded-xl shadow-lg hover:bg-[#900000] hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer">
                    <Plus size={20} /> Add Student
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <RedStatCard label="Total Students" value={stats.total} delay={0} />
                <RedStatCard label="Total Boys" value={stats.boys} delay={0.1} />
                <RedStatCard label="Total Girls" value={stats.girls} delay={0.2} />
                <RedStatCard label="Total Sections" value={stats.sections} delay={0.3} />
            </div>

            {/* FILTERS */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">

                <div className="relative w-full">
                    <input
                        type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-[50px] border border-gray-200 rounded-xl pl-12 pr-4 outline-none focus:border-[#B50104] focus:ring-1 focus:ring-[#B50104]/20 transition-all text-sm font-bold bg-gray-50/50 focus:bg-white text-[#191919]"
                    />
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                <ModernDropdown label="All Genders" value={genderFilter} onChange={setGenderFilter} options={["Boy", "Girl"]} icon={User} />
                <ModernDropdown label="All Classes" value={classFilter} onChange={setClassFilter} options={classes} icon={Filter} />

                <ModernDropdown
                    label="Attendance Status"
                    value={attendanceFilter}
                    onChange={setAttendanceFilter}
                    options={["Excellent (>90%)", "Average (50-90%)", "Poor (<50%)"]}
                    icon={Calendar}
                />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden min-h-[400px]">
                <div className="grid grid-cols-12 gap-4 py-5 px-6 bg-gray-50 border-b border-gray-100 font-bold text-xs uppercase tracking-wider text-[#3C3C3C]">
                    <div className="col-span-1">Sr No</div>
                    <div className="col-span-3">Full Name</div>
                    <div className="col-span-1">Gender</div>
                    <div className="col-span-2">Class & Sec</div>
                    <div className="col-span-2">Attendance</div>
                    <div className="col-span-1">Progress</div>
                    <div className="col-span-2 text-right">Action</div>
                </div>

                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-20 text-center text-gray-400 font-bold animate-pulse">Loading Students...</div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="p-20 text-center text-gray-400">No students found.</div>
                    ) : (
                        filteredStudents.map((s, i) => {
                            const totalAtt = s.attendanceStats?.total || 0;
                            const presentAtt = s.attendanceStats?.present || 0;
                            const attPercentage = totalAtt === 0 ? 0 : Math.round((presentAtt / totalAtt) * 100);
                            const attColor = attPercentage >= 90 ? 'text-green-600' : attPercentage >= 50 ? 'text-orange-500' : 'text-red-500';

                            const marks = Math.round(s.avgPerformance || 0);
                            const marksColor = marks >= 80 ? 'text-green-600' : marks >= 50 ? 'text-blue-600' : 'text-red-500';

                            return (
                                <motion.div
                                    key={s._id}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                    className="grid grid-cols-12 gap-4 items-center py-4 px-6 border-b border-gray-50 hover:bg-red-50/30 transition-colors group"
                                >
                                    <div className="col-span-1 font-bold text-gray-400 text-sm">#{(students.indexOf(s) + 1).toString().padStart(2, '0')}</div>

                                    <div className="col-span-3 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#B50104] font-bold text-xs border border-gray-200">
                                            {s.firstName.charAt(0)}
                                        </div>
                                        <div className="font-bold text-[#191919] text-sm group-hover:text-[#B50104] transition-colors">
                                            {s.firstName} {s.lastName}
                                        </div>
                                    </div>

                                    <div className="col-span-1 text-xs font-bold text-gray-500">{s.gender}</div>
                                    <div className="col-span-2"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold border border-gray-200">{s.classJoining} - {s.section}</span></div>

                                    {/* Real Stats */}
                                    <div className={`col-span-2 text-xs font-bold ${attColor}`}>{attPercentage}% ({presentAtt}/{totalAtt})</div>
                                    <div className={`col-span-1 text-xs font-bold ${marksColor}`}>{marks}%</div>

                                    {/* Actions */}
                                    <div className="col-span-2 flex justify-end gap-2 opacity-80 group-hover:opacity-100">
                                        <button
                                            onClick={() => setSelectedStudentId(s._id)}
                                            className="bg-blue-50 text-[#0073BB] p-2 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer" title="View Profile"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleContact(s)}
                                            className="bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100 transition-colors cursor-pointer" title="Contact Parent"
                                        >
                                            <MessageCircle size={16} />
                                        </button>
                                        {/* DELETE BUTTON ADDED */}
                                        <button
                                            onClick={() => setDeleteId(s._id)}
                                            className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors cursor-pointer" title="Delete Student"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};