"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, TrendingUp, Calendar, FileText, CheckCircle, Receipt, XCircle, AlertCircle, Award
} from 'lucide-react';
import { toast } from 'sonner';

interface SummaryProps {
    studentId: string;
    studentName: string;
    parentName: string;
}

export const StudentAcademicSummary = ({ studentId, studentName, parentName }: SummaryProps) => {
    const [activeTab, setActiveTab] = useState('fees');
    const [loading, setLoading] = useState(true);

    const [fees, setFees] = useState<any[]>([]);
    const [tests, setTests] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<any[]>([]);

    useEffect(() => {
        if (!studentId) return;

        const loadData = async () => {
            setLoading(true);
            try {
                const [feeRes, testRes, attRes] = await Promise.all([
                    fetch(`/api/fees?studentId=${studentId}`).then(r => r.json()),
                    fetch(`/api/test-report?studentId=${studentId}`).then(r => r.json()),
                    fetch(`/api/attendance?studentId=${studentId}`).then(r => r.json())
                ]);

                if (feeRes.success) setFees(feeRes.data);
                if (testRes.success) setTests(testRes.data);
                if (attRes.success) setAttendance(attRes.data);

            } catch (error) {
                console.error(error);
                toast.error("Failed to load academic records");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [studentId]);

    // Derived Progress Stats
    const totalPaid = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
    const totalTests = tests.length;
    const avgScore = totalTests > 0 
        ? Math.round(tests.reduce((sum, t) => sum + ((t.obtainedMarks / t.totalMarks) * 100), 0) / totalTests) 
        : 0;

    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status?.toLowerCase() === 'present').length;
    const absents = attendance.filter(a => a.status?.toLowerCase() === 'absent').length;
    const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    const tabs = [
        { id: 'fees', label: 'Fee History', icon: Wallet },
        { id: 'tests', label: 'Test Results', icon: FileText },
        { id: 'attendance', label: 'Attendance', icon: Calendar },
        { id: 'progress', label: 'Overall Progress', icon: TrendingUp },
    ];

    if (loading) {
        return (
            <div className="bg-white rounded-[24px] p-10 flex items-center justify-center border border-gray-100 shadow-sm mt-6">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-[#B50104] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm mt-6 overflow-hidden flex flex-col group">
            {/* Header Tabs */}
            <div className="flex overflow-x-auto custom-scrollbar border-b border-gray-100 bg-gray-50/50 p-2 gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-white text-[#B50104] shadow-sm border border-gray-200' 
                            : 'text-gray-500 hover:text-[#191919] hover:bg-gray-100'
                        }`}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-[#B50104]' : 'text-gray-400'} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8 min-h-[300px]">
                <AnimatePresence mode="wait">

                    {/* FEES TAB */}
                    {activeTab === 'fees' && (
                        <motion.div key="fees" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            {fees.length === 0 ? (
                                <EmptyState icon={Wallet} message="No fee payment history found" />
                            ) : (
                                <div className="space-y-4">
                                    {fees.map((fee, idx) => (
                                        <div key={fee._id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#B50104] font-black">
                                                    {String(fees.length - idx).padStart(2, '0')}
                                                </div>
                                                <div>
                                                    <h4 className="text-[#191919] font-bold text-sm">{fee.feeType}</h4>
                                                    <p className="text-xs text-gray-500 font-medium">For {fee.month} {fee.year}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <span className="block text-lg font-black text-[#B50104]">{fee.amount?.toLocaleString()} <span className="text-[10px] text-gray-400">PKR</span></span>
                                                    <span className="text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{fee.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* TESTS TAB */}
                    {activeTab === 'tests' && (
                        <motion.div key="tests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            {tests.length === 0 ? (
                                <EmptyState icon={FileText} message="No test records documented yet" />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {tests.map(test => {
                                        const percentage = Math.round((test.obtainedMarks / test.totalMarks) * 100);
                                        const isPass = test.obtainedMarks >= test.passingMarks;
                                        return (
                                            <div key={test._id} className={`p-5 rounded-2xl border ${isPass ? 'bg-green-50/30 border-green-100' : 'bg-red-50/30 border-red-100'} flex items-start justify-between`}>
                                                <div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isPass ? 'text-green-600' : 'text-red-500'}`}>{test.testType} • {test.date}</span>
                                                    <h4 className="text-lg font-black text-[#191919] mt-1">{test.subject}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-[#191919]">{test.obtainedMarks}<span className="text-sm text-gray-400">/{test.totalMarks}</span></div>
                                                    <div className={`text-xs font-bold ${isPass ? 'text-green-600' : 'text-red-600'}`}>{percentage}% ({isPass ? 'PASS' : 'FAIL'})</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ATTENDANCE TAB */}
                    {activeTab === 'attendance' && (
                        <motion.div key="attendance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            {attendance.length === 0 ? (
                                <EmptyState icon={Calendar} message="No attendance data tracked" />
                            ) : (
                                <div>
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex-1 bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center justify-between">
                                            <div><p className="text-xs font-bold text-gray-500 uppercase">Present</p><h3 className="text-2xl font-black text-green-600">{presentDays}</h3></div>
                                            <CheckCircle size={24} className="text-green-400" />
                                        </div>
                                        <div className="flex-1 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between">
                                            <div><p className="text-xs font-bold text-gray-500 uppercase">Absent</p><h3 className="text-2xl font-black text-red-600">{absents}</h3></div>
                                            <XCircle size={24} className="text-red-400" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                        {attendance.map(att => (
                                            <div key={att._id} className="bg-white border border-gray-100 rounded-xl p-3 text-center flex flex-col items-center gap-2 hover:border-[#B50104] transition-colors">
                                                <span className="text-[10px] font-bold text-gray-400">{att.date.split('-').slice(1).join('/')}</span>
                                                {att.status?.toLowerCase() === 'present' ? <CheckCircle size={16} className="text-green-500" /> :
                                                 att.status?.toLowerCase() === 'absent' ? <XCircle size={16} className="text-red-500" /> :
                                                 <AlertCircle size={16} className="text-orange-500" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* PROGRESS TAB */}
                    {activeTab === 'progress' && (
                        <motion.div key="progress" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className="bg-gradient-to-br from-[#191919] to-[#2a2a2a] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full" />
                                <Award size={32} className="text-yellow-400 mb-4" />
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Academic Excellence</p>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <h3 className="text-5xl font-black">{avgScore}%</h3>
                                    <span className="text-sm text-gray-400 font-medium">Avg Test Score</span>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full mt-6 overflow-hidden">
                                    <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${avgScore}%` }} />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-[#B50104] to-[#800000] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 flex items-center justify-center rotate-12 -mr-10 -mt-10 rounded-3xl">
                                    <Calendar size={64} className="text-white/20" />
                                </div>
                                <Calendar size={32} className="text-red-200 mb-4" />
                                <p className="text-sm font-bold text-red-200 uppercase tracking-widest">Punctuality Score</p>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <h3 className="text-5xl font-black">{attendancePercent}%</h3>
                                    <span className="text-sm text-red-200 font-medium">Attendance</span>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full mt-6 overflow-hidden">
                                    <div className="bg-white h-full rounded-full" style={{ width: `${attendancePercent}%` }} />
                                </div>
                            </div>
                            
                            <div className="md:col-span-2 bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Fees Collected</p>
                                    <h3 className="text-3xl font-black text-[#191919] mt-1">{totalPaid.toLocaleString()} <span className="text-sm text-gray-400">PKR</span></h3>
                                </div>
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <Wallet size={24} />
                                </div>
                            </div>

                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

const EmptyState = ({ icon: Icon, message }: { icon: any, message: string }) => (
    <div className="py-16 flex flex-col items-center justify-center text-center opacity-60">
        <Icon size={48} className="text-gray-300 mb-4" />
        <h3 className="text-lg font-black text-gray-400">{message}</h3>
    </div>
);
