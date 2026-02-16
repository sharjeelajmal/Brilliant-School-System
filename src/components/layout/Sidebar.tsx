"use client";
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileText, Users, Wallet, Settings, LogOut,
  ChevronLeft, ChevronRight, UserPlus, BookOpen, MessageSquare,
  ClipboardList, FileBarChart2, User, GraduationCap, Briefcase // NEW ICONS IMPORTED
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  role?: string; // NEW PROP FOR ROLE
}

export const Sidebar = ({ isOpen, setIsOpen, activePage, setActivePage, role = 'admin' }: SidebarProps) => {
  const router = useRouter();
  const { themeColor } = useTheme();

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    localStorage.removeItem('user'); // Clear user data
    router.push('/login');
  };

  // --- MENU ITEMS DEFINITION ---
  const allMenuItems = [
    // ADMIN ONLY
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['admin'] },

    // SHARED / TEACHER ACCESSIBLE
    { id: 'attendance', label: 'Attendance', icon: ClipboardList, roles: ['admin', 'teacher'] },
    { id: 'diary', label: 'Class Diary', icon: BookOpen, roles: ['admin', 'teacher'] },
    { id: 'test-report', label: 'Test Reports', icon: FileBarChart2, roles: ['admin', 'teacher'] },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare, roles: ['admin', 'teacher'] }, // Shared

    // ADMIN ONLY
    { id: 'classes', label: 'Classes & Sections', icon: BookOpen, roles: ['admin'] },
    { id: 'subjects', label: 'Subjects Manager', icon: ClipboardList, roles: ['admin'] },
    { id: 'forms', label: 'Student Admission', icon: FileText, roles: ['admin'] },
    { id: 'parents', label: 'Parents', icon: Users, roles: ['admin'] },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap, roles: ['admin'] },
    { id: 'students', label: 'Students List', icon: User, roles: ['admin'] },
    { id: 'finance', label: 'Fee Collection', icon: Wallet, roles: ['admin'] },
    { id: 'payroll', label: 'Staff Payroll', icon: UserPlus, roles: ['admin'] },
    { id: 'vendors', label: 'Suppliers', icon: Briefcase, roles: ['admin'] },
    { id: 'purchases', label: 'Purchase History', icon: FileBarChart2, roles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  ];

  // FILTER MENU ITEMS BASED ON ROLE
  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? 250 : 80 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="gpu-accelerated h-screen bg-white border-r border-gray-100 relative flex flex-col justify-between shadow-2xl z-50 print:hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-9 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform z-[100] cursor-pointer flex items-center justify-center border-2 border-white"
        style={{ backgroundColor: themeColor }}
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <div className={`p-6 flex items-center ${isOpen ? 'gap-3' : ''} transition-all ${!isOpen && 'justify-center'}`}>
        <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-xl shadow-md z-20" style={{ backgroundColor: themeColor }}>B</div>
        <motion.div animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0 }} className="whitespace-nowrap overflow-hidden">
          <h1 className="font-black text-lg text-[#191919] uppercase tracking-tighter leading-none">BRILLIANT</h1>
          <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: themeColor }}>
            SCHOOL & ACADEMY
          </p>
        </motion.div>
      </div>

      <div className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menuItems.map((item) => (
          <div key={item.id} className="relative group">
            <button
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center ${isOpen ? 'gap-3' : ''} p-3 rounded-xl transition-all duration-200 relative group cursor-pointer ${activePage === item.id ? 'text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'} ${!isOpen && 'justify-center'}`}
              style={{
                backgroundColor: activePage === item.id ? themeColor : '',
                color: activePage === item.id ? 'white' : ''
              }}
            >
              <item.icon size={20} strokeWidth={activePage === item.id ? 2.5 : 2} className="flex-shrink-0" style={{ color: activePage !== item.id ? 'inherit' : 'white' }} />
              <motion.span animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0 }} className="font-bold text-xs whitespace-nowrap overflow-hidden">{item.label}</motion.span>
            </button>
            {!isOpen && (
              <div className="absolute left-[70px] top-1/2 -translate-y-1/2 bg-white text-[#191919] text-xs font-bold px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)] border border-gray-100 z-[9999]">
                {item.label}
                <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-l border-b border-gray-100 rotate-45"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 mb-2 relative group">
        <button onClick={handleLogout} className={`w-full flex items-center ${isOpen ? 'gap-3' : ''} p-3 rounded-xl text-gray-400 hover:bg-gray-100 transition-all cursor-pointer ${!isOpen && 'justify-center'}`}>
          <LogOut size={20} />
          <motion.span animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0 }} className="font-bold text-xs whitespace-nowrap overflow-hidden">Logout</motion.span>
        </button>
      </div>
    </motion.div>
  );
};