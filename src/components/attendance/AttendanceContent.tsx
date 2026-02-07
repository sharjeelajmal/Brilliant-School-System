"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { AttendanceRow } from '@/components/attendance/AttendanceRow';

export const AttendanceContent = () => {
  const [filters, setFilters] = useState({ date: new Date().toISOString().split('T')[0], class: '', section: '' });
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);

  // 1. Load Classes
  useEffect(() => {
    fetch('/api/classes').then(res => res.json()).then(data => { if(data.data) setClasses(data.data.map((c:any) => c.name)) });
  }, []);

  // 2. Load Sections
  useEffect(() => {
    if(filters.class) fetch(`/api/sections?class=${filters.class}`).then(res => res.json()).then(data => { if(data.success) setSections(data.data.map((s:any) => s.name)) });
  }, [filters.class]);

  // 3. Load Students & Existing Attendance
  useEffect(() => {
    const fetchData = async () => {
        if(!filters.class || !filters.section || !filters.date) return;
        setLoading(true);
        try {
            const sRes = await fetch(`/api/students?class=${filters.class}&section=${filters.section}`);
            const sData = await sRes.json();
            
            const aRes = await fetch(`/api/attendance?class=${filters.class}&section=${filters.section}&date=${filters.date}`);
            const aData = await aRes.json();

            if(sData.success) {
                setStudents(sData.data);
                const statusMap: any = {};
                if(aData.success) {
                    aData.data.forEach((rec: any) => { statusMap[rec.studentId] = rec.status });
                }
                setAttendance(statusMap);
            }
        } catch(e) { toast.error("Error loading data"); }
        finally { setLoading(false); }
    };
    fetchData();
  }, [filters.class, filters.section, filters.date]);

  const handleStatusChange = (id: string, status: string) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleSubmit = async () => {
    if(!filters.class || !filters.section) { toast.error("Select Class & Section first"); return; }
    
    const records = students.map(s => ({
        studentId: s._id,
        status: attendance[s._id] || 'absent'
    }));

    try {
        const res = await fetch('/api/attendance', {
            method: 'POST',
            body: JSON.stringify({ 
                date: filters.date, 
                className: filters.class, 
                section: filters.section, 
                records 
            })
        });
        if(res.ok) toast.success("Attendance Saved Successfully!");
        else toast.error("Failed to save");
    } catch(e) { toast.error("Network Error"); }
  };

  return (
    <div className="w-full">
      <Toaster position="top-center" richColors />
      
        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl border border-gray-100 mb-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <CustomDatePicker label="Select Date" name="date" value={filters.date} onChange={(n, v) => setFilters({...filters, date: v})} />
              <CustomDropdown label="Select Class" name="class" value={filters.class} onChange={(n, v) => setFilters({...filters, class: v, section: ''})} options={classes} />
              <CustomDropdown label="Select Section" name="section" value={filters.section} onChange={(n, v) => setFilters({...filters, section: v})} options={sections} />
           </div>
        </motion.div>

        {/* List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl border border-gray-100 overflow-hidden">
           <div className="overflow-x-auto pb-4">
             <div className="min-w-[800px]">
               <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 mb-2 px-4">
                  <div className="col-span-1 text-[#3C3C3C] font-bold text-sm uppercase">Roll No.</div>
                  <div className="col-span-3 text-[#3C3C3C] font-bold text-sm uppercase">Name</div>
                  <div className="col-span-3 text-[#3C3C3C] font-bold text-sm uppercase">Father Name</div>
                  <div className="col-span-5 text-[#3C3C3C] font-bold text-sm uppercase text-right pr-8">Status</div>
               </div>

               <div className="min-h-[300px]">
                 {loading ? <div className="p-10 text-center text-gray-400">Loading...</div> : 
                  students.length === 0 ? <div className="p-10 text-center text-gray-400">No Students Found</div> :
                  students.map((student, i) => (
                   <AttendanceRow 
                     key={student._id} 
                     index={i} 
                     student={student} 
                     status={attendance[student._id] as any || null} 
                     onStatusChange={handleStatusChange} 
                   />
                 ))}
               </div>
             </div>
           </div>

           <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
              <button onClick={handleSubmit} className="w-full md:w-auto px-12 py-4 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center justify-center gap-2">Submit Attendance <Save size={18} /></button>
           </div>
        </motion.div>
    </div>
  );
};