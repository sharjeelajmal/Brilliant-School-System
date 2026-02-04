"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { CustomInput } from '@/components/ui/CustomInput';
import { TestReportRow } from '@/components/test-report/TestReportRow';
import { TeacherHeader } from '@/components/layout/TeacherHeader';

export default function TestReportPage() {
  
  const [filters, setFilters] = useState({
    date: '', class: '', section: '',
    testType: '', subject: '',
    totalMarks: '', passingMarks: ''
  });

  const [marks, setMarks] = useState<Record<string, string>>({});

  const handleFilterChange = (name: string, value: string) => setFilters(prev => ({ ...prev, [name]: value }));
  const handleInputFilter = (e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleMarkUpdate = (id: string, value: string) => setMarks(prev => ({ ...prev, [id]: value }));

  const handleSubmit = () => {
    if (!filters.totalMarks || !filters.passingMarks) {
      toast.error("Please enter Total & Passing marks first!");
      return;
    }
    console.log({ filters, marks });
    toast.success("Test Report Saved Successfully!");
  };

  const students = [
    { id: '1', firstName: 'Ali', fatherName: 'Ahmed Khan' },
    { id: '2', firstName: 'Sara', fatherName: 'Bilal Ahmed' },
    { id: '3', firstName: 'Usman', fatherName: 'Zafar Iqbal' },
    { id: '4', firstName: 'Ayesha', fatherName: 'Tariq Malik' },
    { id: '5', firstName: 'Hamza', fatherName: 'Riaz Ud Din' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-['Montserrat'] pb-20 md:pb-0">
      <Toaster position="top-center" richColors />
      
      <TeacherHeader title="Class Test Report" activePage="test-report" />

      <main className="max-w-[1200px] mx-auto p-4 md:p-8 mt-4 md:mt-0">
        
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl border border-gray-100 mb-8"
        >
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <CustomDatePicker label="Select Date" name="date" value={filters.date} onChange={handleFilterChange} />
              <CustomDropdown label="Select Class" name="class" value={filters.class} onChange={handleFilterChange} options={["Class 1", "Class 2", "O-Levels"]} />
              <CustomDropdown label="Select Section" name="section" value={filters.section} onChange={handleFilterChange} options={["Section A", "Section B"]} />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              <CustomDropdown label="Test Type" name="testType" value={filters.testType} onChange={handleFilterChange} options={["Weekly Test", "Monthly Test", "Quiz", "Mid Term"]} />
              <CustomDropdown label="Select Subject" name="subject" value={filters.subject} onChange={handleFilterChange} options={["Mathematics", "English", "Science", "Urdu"]} />
              <CustomInput label="Total Marks" name="totalMarks" value={filters.totalMarks} onChange={handleInputFilter} type="number" />
              <CustomInput label="Passing Marks" name="passingMarks" value={filters.passingMarks} onChange={handleInputFilter} type="number" />
           </div>
        </motion.div>

        {/* Report Table Wrapper */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl border border-gray-100 overflow-hidden"
        >
           {/* Scroll Container */}
           <div className="overflow-x-auto pb-4">
             <div className="min-w-[900px]"> {/* Wider width for Report table */}
               
               <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-gray-100 mb-2 px-4 bg-gray-50/50 rounded-t-xl pt-4">
                  <div className="col-span-1 text-[#3C3C3C] font-bold text-sm uppercase tracking-wide">Roll No</div>
                  <div className="col-span-2 text-[#3C3C3C] font-bold text-sm uppercase tracking-wide">First Name</div>
                  <div className="col-span-2 text-[#3C3C3C] font-bold text-sm uppercase tracking-wide">Father Name</div>
                  <div className="col-span-3 text-[#3C3C3C] font-bold text-sm uppercase tracking-wide text-center">Obtained Marks</div>
                  <div className="col-span-2 text-[#3C3C3C] font-bold text-sm uppercase tracking-wide text-center">Percentage</div>
                  <div className="col-span-2 text-[#3C3C3C] font-bold text-sm uppercase tracking-wide text-center">Status</div>
               </div>

               <div className="min-h-[300px]">
                 {students.map((student, i) => (
                   <TestReportRow 
                     key={student.id} 
                     index={i} 
                     student={student} 
                     obtainedMarks={marks[student.id] || ''}
                     totalMarks={filters.totalMarks}
                     passingMarks={filters.passingMarks}
                     onMarkChange={handleMarkUpdate} 
                   />
                 ))}
               </div>

             </div>
           </div>

           <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
              <button onClick={handleSubmit} className="w-full md:w-auto px-12 py-4 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center justify-center gap-2">
                Submit Report <Save size={18} />
              </button>
           </div>

        </motion.div>
      </main>
    </div>
  );
}