"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { AttendanceRow } from '@/components/attendance/AttendanceRow';
import { TeacherHeader } from '@/components/layout/TeacherHeader';

export default function AttendancePage() {
  const [filters, setFilters] = useState({ date: '', class: '', section: '' });
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'leave'>>({});

  const students = [
    { id: '1', firstName: 'Ali', lastName: 'Khan', fatherName: 'Ahmed Khan' },
    { id: '2', firstName: 'Sara', lastName: 'Ahmed', fatherName: 'Bilal Ahmed' },
    { id: '3', firstName: 'Usman', lastName: 'Zafar', fatherName: 'Zafar Iqbal' },
    { id: '4', firstName: 'Ayesha', lastName: 'Malik', fatherName: 'Tariq Malik' },
    { id: '5', firstName: 'Hamza', lastName: 'Riaz', fatherName: 'Riaz Ud Din' },
  ];

  const handleStatusChange = (id: string, status: 'present' | 'absent' | 'leave') => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleSubmit = () => {
    console.log(attendance);
    toast.success("Attendance Submitted Successfully!");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-['Montserrat'] pb-20 md:pb-0">
      <Toaster position="top-center" richColors />
      
      <TeacherHeader title="Class Attendance" activePage="attendance" />

      <main className="max-w-[1200px] mx-auto p-4 md:p-8 mt-4 md:mt-0">
        
        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl border border-gray-100 mb-8"
        >
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <CustomDatePicker label="Select Date" name="date" value={filters.date} onChange={(n, v) => setFilters({...filters, date: v})} />
              <CustomDropdown label="Select Class" name="class" value={filters.class} onChange={(n, v) => setFilters({...filters, class: v})} options={["Class 1", "Class 2", "O-Levels"]} />
              <div className="relative">
                <CustomDropdown label="Select Section" name="section" value={filters.section} onChange={(n, v) => setFilters({...filters, section: v})} options={["Section A", "Section B", "Red"]} />
                <span className="absolute right-1 -bottom-6 text-[10px] font-medium text-gray-300 hidden md:block">Teacher name here</span>
              </div>
           </div>
        </motion.div>

        {/* Attendance Sheet (Responsive Wrapper) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl border border-gray-100 overflow-hidden"
        >
           {/* Scrollable Container */}
           <div className="overflow-x-auto pb-4">
             <div className="min-w-[800px]"> {/* Forces table width on mobile */}
               
               <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 mb-2 px-4">
                  <div className="col-span-1 text-[#3C3C3C] font-bold text-sm uppercase">Roll No.</div>
                  <div className="col-span-3 text-[#3C3C3C] font-bold text-sm uppercase">First Name</div>
                  <div className="col-span-3 text-[#3C3C3C] font-bold text-sm uppercase">Last Name</div>
                  <div className="col-span-5 text-[#3C3C3C] font-bold text-sm uppercase text-right pr-8">Status</div>
               </div>

               <div className="min-h-[300px]">
                 {students.map((student, i) => (
                   <AttendanceRow key={student.id} index={i} student={student} status={attendance[student.id] || null} onStatusChange={handleStatusChange} />
                 ))}
               </div>

             </div>
           </div>

           <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
              <button onClick={handleSubmit} className="w-full md:w-auto px-12 py-4 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center justify-center gap-2">Submit Attendance <Save size={18} /></button>
           </div>
        </motion.div>
      </main>
    </div>
  );
}