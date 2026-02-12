"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Calendar, ChevronDown, CheckCircle, Eye, Wallet,
    MessageCircle, Users,
    Filter, RefreshCw, X
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

// --- STAT CARD (Same as Student List Page) ---
const RedStatCard = ({ label, value, delay }: { label: string, value: string, delay: number }) => (
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

// --- MONTHS LIST ---
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// --- CUSTOM DROPDOWN ---
const Dropdown = ({ label, value, options, onChange, icon: Icon }: any) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="w-full h-[48px] bg-white border border-gray-200 rounded-xl px-4 flex items-center justify-between cursor-pointer hover:border-[#B50104] transition-all shadow-sm hover:shadow-md text-sm font-bold text-gray-600 group"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-gray-400 group-hover:text-[#B50104] transition-colors" />}
                    <span className={value ? 'text-[#191919]' : 'text-gray-400'}>{value || label}</span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180 text-[#B50104]' : ''}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-[54px] left-0 w-full bg-white border border-gray-100 shadow-2xl rounded-xl z-50 overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar"
                        >
                            {options.map((opt: string) => (
                                <div
                                    key={opt}
                                    onClick={() => { onChange(opt); setOpen(false); }}
                                    className="px-4 py-3 hover:bg-red-50 cursor-pointer text-sm font-bold text-gray-600 hover:text-[#B50104] transition-colors flex items-center justify-between"
                                >
                                    {opt}
                                    {value === opt && <CheckCircle size={14} className="text-[#B50104]" />}
                                </div>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- STATUS BADGE ---
const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'Paid': 'bg-green-50 text-green-600 border-green-100',
        'Unpaid': 'bg-red-50 text-red-600 border-red-100',
        'Partial Paid': 'bg-orange-50 text-orange-600 border-orange-100',
    };
    return (
        <span className={`px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border ${styles[status] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
            {status}
        </span>
    );
};

// === MAIN COMPONENT ===
export const MonthlyFeeCollection = () => {
    const now = new Date();
    const [month, setMonth] = useState(MONTHS[now.getMonth()]);
    const [year, setYear] = useState(now.getFullYear());
    const [status, setStatus] = useState('All');
    const [search, setSearch] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>({ totalFee: 0, collectedFee: 0, remainingFee: 0, studentsUnpaid: 0 });
    const [loading, setLoading] = useState(true);

    // Fetch Data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                summary: 'true',
                month,
                year: String(year),
                ...(status !== 'All' && { status }),
                ...(search && { search })
            });
            const res = await fetch(`/api/fees?${params}`);
            const data = await res.json();
            if (data.success) {
                setStudents(data.data);
                setSummary(data.summary);
            }
        } catch (error) {
            toast.error("Fee data load karne mein masla hua");
        } finally {
            setLoading(false);
        }
    }, [month, year, status, search]);

    useEffect(() => {
        const debounce = setTimeout(fetchData, 300);
        return () => clearTimeout(debounce);
    }, [fetchData]);

    // WhatsApp Contact
    const handleWhatsApp = (student: any) => {
        let number = (student.whatsappNo || student.mobileNo || '').replace(/[^0-9]/g, '');
        if (!number) return toast.error("No contact number found");
        if (number.startsWith('03')) number = '92' + number.substring(1);
        window.open(`https://wa.me/${number}?text=Assalam-o-Alaikum, Dear Parent. Your child ${student.studentName}'s fee for ${month} ${year} is pending. Please submit at the earliest. JazakAllah.`, '_blank');
    };

    // Month Index for display
    const monthIdx = MONTHS.indexOf(month);
    const mmYyyy = `${String(monthIdx + 1).padStart(2, '0')}/${year}`;

    // Available years
    const years = Array.from({ length: 5 }, (_, i) => String(now.getFullYear() - 2 + i));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 font-['Montserrat'] pb-10"
        >
            <Toaster position="top-center" richColors />

            {/* === TITLE SECTION === */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl md:text-4xl font-black text-[#B50104] tracking-tight"
                    >
                        MONTHLY FEE COLLECTION
                    </motion.h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 80 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="h-1.5 bg-[#B50104] rounded-full mt-2"
                    />
                </div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative w-full lg:w-[350px]"
                >
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search Parent or Student..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-[48px] bg-white border border-gray-200 rounded-xl pl-11 pr-10 text-sm font-bold text-[#191919] outline-none focus:border-[#B50104] focus:shadow-lg focus:shadow-red-500/10 transition-all placeholder:text-gray-300"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B50104] cursor-pointer">
                            <X size={16} />
                        </button>
                    )}
                </motion.div>
            </div>

            {/* === STAT CARDS - Same as Student List Page === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <RedStatCard label="Total Fee" value={summary.totalFee?.toLocaleString() || '0'} delay={0} />
                <RedStatCard label="Collected Fee" value={summary.collectedFee?.toLocaleString() || '0'} delay={0.1} />
                <RedStatCard label="Remaining Fee" value={summary.remainingFee?.toLocaleString() || '0'} delay={0.2} />
                <RedStatCard label="Students Unpaid" value={String(summary.studentsUnpaid || '0')} delay={0.3} />
            </div>

            {/* === MONTH/YEAR DISPLAY === */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3"
            >
                <Calendar size={20} className="text-[#B50104]" />
                <span className="text-2xl font-black text-[#191919] tracking-tight">{mmYyyy}</span>
                <button
                    onClick={fetchData}
                    className="ml-2 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#B50104] hover:bg-red-50 transition-all cursor-pointer active:scale-90"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </motion.div>

            {/* === FILTERS === */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <Dropdown
                    label="Status"
                    value={status}
                    options={['All', 'Paid', 'Unpaid', 'Partial Paid']}
                    onChange={setStatus}
                    icon={Filter}
                />
                <Dropdown
                    label="Select Month"
                    value={month}
                    options={MONTHS}
                    onChange={setMonth}
                    icon={Calendar}
                />
                <Dropdown
                    label="Select Year"
                    value={String(year)}
                    options={years}
                    onChange={(v: string) => setYear(parseInt(v))}
                    icon={Calendar}
                />
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-[48px] bg-gray-50 border border-gray-100 rounded-xl px-4 flex items-center gap-2 text-sm font-bold text-gray-500">
                        <Users size={16} className="text-gray-400" />
                        <span>{summary.totalStudents || 0} Students</span>
                    </div>
                </div>
            </motion.div>

            {/* === DATA TABLE === */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                {/* Table Header */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Roll No.#</th>
                                <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Student Name</th>
                                <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Parents/Guardians</th>
                                <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Total Fee</th>
                                <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Due Date</th>
                                <th className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="border-b border-gray-50">
                                        {Array.from({ length: 7 }).map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : students.length > 0 ? (
                                students.map((student: any, index: number) => (
                                    <motion.tr
                                        key={student.studentId}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.03 }}
                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-gray-300 group-hover:text-[#B50104] transition-colors">
                                                {String(student.rollNo || index + 1).padStart(2, '0')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-[#191919]">{student.studentName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500 font-medium">{student.parentName || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-[#191919]">{(student.totalFee || 0).toLocaleString()} PKR</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-400 font-medium">{student.dueDate}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={student.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {student.status === 'Paid' ? (
                                                    <button className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer group/btn">
                                                        View Receipt
                                                        <Eye size={13} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                ) : (
                                                    <button className="flex items-center gap-1.5 text-[11px] font-bold text-[#B50104] hover:text-[#900000] transition-colors cursor-pointer group/btn">
                                                        Collect Fee
                                                        <Wallet size={13} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                )}
                                                <span className="text-gray-200 mx-1">|</span>
                                                <button
                                                    onClick={() => handleWhatsApp(student)}
                                                    className="flex items-center gap-1.5 text-[11px] font-bold text-green-600 hover:text-green-800 transition-colors cursor-pointer group/btn"
                                                >
                                                    Contact
                                                    <MessageCircle size={13} className="group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-16">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center gap-3"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                                                <Users size={28} className="text-gray-300" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-300">No students found for this filter</p>
                                        </motion.div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer - Count */}
                {!loading && students.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-400">
                            Showing <span className="text-[#191919]">{students.length}</span> of <span className="text-[#191919]">{summary.totalStudents || 0}</span> students
                        </p>
                        <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500" /> Paid: {students.filter((s: any) => s.status === 'Paid').length}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500" /> Unpaid: {students.filter((s: any) => s.status === 'Unpaid').length}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-orange-500" /> Partial: {students.filter((s: any) => s.status === 'Partial Paid').length}
                            </span>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};
