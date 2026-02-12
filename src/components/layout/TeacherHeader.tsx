"use client";
import React from 'react';
import { LogOut, ClipboardList, FileBarChart2, MessageSquare, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  title: string;
  activePage: 'attendance' | 'test-report' | 'complaints' | 'diary';
}

export const TeacherHeader = ({ title, activePage }: HeaderProps) => {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    router.push('/login');
  };

  const NavItem = ({ href, page, icon: Icon, label }: { href: string, page: string, icon: any, label: string }) => {
    const isActive = activePage === page;

    return (
      <Link href={href}>
        <div className={`
            relative group flex items-center gap-2 px-4 py-2.5 rounded-xl 
            transition-all cursor-pointer select-none
            ${isActive
            ? 'bg-white text-[#B70003] shadow-md border border-gray-100'
            : 'text-gray-400 hover:text-[#191919] hover:bg-gray-100 active:scale-95'
          }
        `}>
          <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />

          <span className={`text-xs font-bold uppercase tracking-wide ${isActive ? 'inline-block' : 'hidden md:inline-block'}`}>
            {label}
          </span>

          {!isActive && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#191919] text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl">
              {label}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#191919]" />
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-3 md:py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">

      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-9 h-9 md:w-10 md:h-10 bg-[#B70003] rounded-xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-red-100 shadow-lg">E</div>
        <div>
          <h1 className="font-bold text-[#191919] uppercase tracking-tighter text-sm md:text-lg">{title}</h1>
          <p className="text-[9px] md:text-[10px] font-bold text-[#B70003] tracking-widest uppercase">Teacher Portal</p>
        </div>
      </div>

      <nav className={`
            flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 
            absolute left-1/2 -translate-x-1/2 bottom-[-70px] shadow-xl
            md:static md:left-auto md:translate-x-0 md:bottom-auto md:shadow-none
        `}>
        <NavItem href="/attendance" page="attendance" icon={ClipboardList} label="Attendance" />
        <NavItem href="/test-report" page="test-report" icon={FileBarChart2} label="Test Report" />
        {/* NEW COMPLAINT BUTTON ADDED HERE */}
        <NavItem href="/teacher-complaints" page="complaints" icon={MessageSquare} label="Complaints" />
        <NavItem href="/diary" page="diary" icon={BookOpen} label="Diary" />
      </nav>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Logged In As</p>
          <p className="text-sm font-bold text-[#191919]">Teacher</p>
        </div>
        <button onClick={handleLogout} className="p-2.5 bg-red-50 hover:bg-[#B70003] text-red-600 hover:text-white rounded-xl transition-all shadow-sm cursor-pointer group active:scale-90" title="Logout">
          <LogOut size={18} className="md:w-5 md:h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
    </header>
  );
};