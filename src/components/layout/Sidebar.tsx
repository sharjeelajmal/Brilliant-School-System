"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Wallet, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  UserPlus 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Sidebar = ({ isOpen, setIsOpen, activePage, setActivePage }: SidebarProps) => {
  
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'forms', label: 'Student Admission', icon: FileText },
    { id: 'teachers', label: 'Teacher Hiring', icon: UserPlus },
    { id: 'students', label: 'Students List', icon: Users },
    { id: 'finance', label: 'Fee & Finance', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.div 
      // FIX 1: 'overflow-hidden' hata diya taake button aur tooltip bahar nazar aa sakein
      initial={false}
      animate={{ width: isOpen ? 250 : 80 }} 
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }} 
      className="h-screen bg-white border-r border-gray-100 relative flex flex-col justify-between shadow-2xl z-50"
    >
      {/* Toggle Button - FIX 2: Ab ye poora nazar aayega */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-9 bg-[#B70003] text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform z-[100] cursor-pointer flex items-center justify-center border-2 border-white"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Logo Area */}
      <div className={`p-6 flex items-center gap-3 transition-all ${!isOpen && 'justify-center'}`}>
        <div className="w-10 h-10 bg-[#B70003] rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-xl shadow-md z-20">
          E
        </div>
        
        {/* Text Fade Animation - Sirf yahan overflow hidden lagaya hai */}
        <motion.div 
          animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0 }}
          className="whitespace-nowrap overflow-hidden"
        >
          <h1 className="font-black text-lg text-[#191919] uppercase tracking-tighter leading-none">EduSmart</h1>
          <p className="text-[9px] font-bold text-[#B70003] tracking-widest uppercase">System</p>
        </motion.div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-3 space-y-2 mt-4">
        {menuItems.map((item) => (
          <div key={item.id} className="relative group">
            
            <button
              onClick={() => setActivePage(item.id)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 relative group cursor-pointer
                ${activePage === item.id 
                  ? 'bg-[#B70003] text-white shadow-md shadow-red-200' 
                  : 'text-gray-500 hover:bg-red-50 hover:text-[#B70003]'
                }
                ${!isOpen && 'justify-center'}
              `}
            >
              <item.icon size={20} strokeWidth={activePage === item.id ? 2.5 : 2} className="flex-shrink-0" />
              
              {/* Text smoothness */}
              <motion.span 
                animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0 }}
                className="font-bold text-xs whitespace-nowrap overflow-hidden"
              >
                {item.label}
              </motion.span>
            </button>

            {/* --- FIX 3: WHITE TOOLTIP (Ab ye sidebar ke bahar show hoga) --- */}
            {!isOpen && (
              <div className="absolute left-[70px] top-1/2 -translate-y-1/2 bg-white text-[#191919] text-xs font-bold px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)] border border-gray-100 z-[9999]">
                {item.label}
                {/* Arrow (White) */}
                <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-l border-b border-gray-100 rotate-45"></div>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="p-3 mb-2 relative group">
        <button className={`w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-all cursor-pointer ${!isOpen && 'justify-center'}`}>
          <LogOut size={20} />
          <motion.span 
             animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0 }}
             className="font-bold text-xs whitespace-nowrap overflow-hidden"
          >
            Logout
          </motion.span>
        </button>

        {/* Logout Tooltip */}
        {!isOpen && (
           <div className="absolute left-[70px] top-1/2 -translate-y-1/2 bg-white text-red-600 text-xs font-bold px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)] border border-gray-100 z-[9999]">
             Logout
             <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-l border-b border-gray-100 rotate-45"></div>
           </div>
        )}
      </div>

    </motion.div>
  );
};