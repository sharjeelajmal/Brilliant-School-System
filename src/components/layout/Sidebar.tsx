"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  ClipboardList, 
  Users, 
  Settings, 
  ChevronLeft,
  GraduationCap
} from 'lucide-react'; 

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  activePage: string;
  setActivePage: (val: string) => void;
}

export const Sidebar = ({ isOpen, setIsOpen, activePage, setActivePage }: SidebarProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: <LayoutGrid size={20} /> },
    { id: 'forms', name: 'Forms', icon: <ClipboardList size={20} /> },
    { id: 'students', name: 'Students', icon: <Users size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <motion.aside 
      initial={false}
      // CHANGE: Width 280px se 240px kar di gayi hai
      animate={{ width: isOpen ? '240px' : '80px' }}
      className="bg-white border-r border-gray-100 h-screen sticky top-0 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.02)] z-30 font-['Montserrat'] flex-shrink-0"
    >
      {/* Sidebar Header */}
      <div className="p-5 flex items-center justify-between mb-6">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
            >
              <div className="w-8 h-8 bg-[#B70003] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <GraduationCap size={18} />
              </div>
              <span className="font-bold text-lg tracking-tight text-[#191919]">EduSmart</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-[#B70003] cursor-pointer hover:bg-[#B70003] hover:text-white transition-all duration-300 flex-shrink-0"
        >
          <motion.div animate={{ rotate: isOpen ? 0 : 180 }}>
            <ChevronLeft size={18} />
          </motion.div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => (
          <div key={item.id} className="relative flex items-center">
            <motion.div
              onClick={() => setActivePage(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`flex items-center w-full gap-3 p-3 rounded-xl cursor-pointer transition-all relative overflow-hidden group ${
                activePage === item.id 
                ? 'bg-[#B70003] text-white shadow-lg shadow-red-900/20' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-[#B70003]'
              }`}
            >
              <div className={`flex-shrink-0 ${activePage === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                {item.icon}
              </div>
              
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-semibold text-[13px] whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}

              {activePage === item.id && (
                <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-5 bg-white rounded-r-full" />
              )}
            </motion.div>

            {/* Hover Tooltip (When Closed) */}
            {!isOpen && hoveredItem === item.id && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 20 }}
                className="absolute left-full ml-4 px-3 py-1.5 bg-[#191919] text-white text-[11px] font-bold rounded-md whitespace-nowrap z-50 shadow-xl"
              >
                {item.name}
                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#191919] rotate-45" />
              </motion.div>
            )}
          </div>
        ))}
      </nav>
    </motion.aside>
  );
};