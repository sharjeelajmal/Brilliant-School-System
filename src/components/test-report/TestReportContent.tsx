"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { CustomInput } from '@/components/ui/CustomInput';
import { TestReportRow } from '@/components/test-report/TestReportRow';

export const TestReportContent = () => {
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0], class: '', section: '',
    testType: '', subject: '', totalMarks: '', passingMarks: ''
  });

  const [marks, setMarks] = useState<Record<string, string>>({});
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Dynamic Data States
  const [allClassesData, setAllClassesData] = useState<any[]>([]); 
  const [classesList, setClassesList] = useState<string[]>([]);
  const [sectionsList, setSectionsList] = useState<string[]>([]);
  const [subjectsList, setSubjectsList] = useState<string[]>([]); 

  // 1. Fetch Classes (Added timestamp)
  useEffect(() => { 
      fetch(`/api/classes?t=${new Date().getTime()}`).then(res => res.json()).then(data => { 
          if(data.data) {
              setAllClassesData(data.data);
              setClassesList(data.data.map((c:any) => c.name));
          }
      }); 
  }, []);

  // 2. Fetch Sections & Update Subjects
  useEffect(() => { 
      if(filters.class) {
          fetch(`/api/sections?class=${filters.class}`).then(res => res.json()).then(data => { 
              if(data.success) setSectionsList(data.data.map((s:any) => s.name)); 
          });

          // Update Subjects Dropdown from saved data
          const selectedClassData = allClassesData.find(c => c.name === filters.class);
          if (selectedClassData && selectedClassData.subjects && selectedClassData.subjects.length > 0) {
              setSubjectsList(selectedClassData.subjects);
          } else {
              setSubjectsList([]); // REMOVED HARDCODED VALUES
          }
      }
  }, [filters.class, allClassesData]);

  // 3. Fetch Students & Marks
  useEffect(() => {
    const fetchData = async () => {
        if(!filters.class || !filters.section || !filters.date || !filters.subject) return;
        setLoading(true);
        try {
            const sRes = await fetch(`/api/students?class=${filters.class}&section=${filters.section}`);
            const sData = await sRes.json();
            
            const mRes = await fetch(`/api/test-report?class=${filters.class}&section=${filters.section}&date=${filters.date}&subject=${filters.subject}`);
            const mData = await mRes.json();

            if(sData.success) {
                setStudents(sData.data);
                const marksMap: any = {};
                if(mData.success && mData.data.length > 0) {
                    mData.data.forEach((rec: any) => { marksMap[rec.studentId] = rec.obtainedMarks });
                    setFilters(prev => ({
                        ...prev,
                        totalMarks: mData.data[0].totalMarks,
                        passingMarks: mData.data[0].passingMarks,
                        testType: mData.data[0].testType
                    }));
                } else {
                    setMarks({});
                }
                setMarks(marksMap);
            }
        } catch(e) { console.error(e); }
        finally { setLoading(false); }
    };
    fetchData();
  }, [filters.class, filters.section, filters.date, filters.subject]);

  const handleFilterChange = (name: string, value: string) => setFilters(prev => ({ ...prev, [name]: value }));
  const handleInputFilter = (e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleMarkUpdate = (id: string, value: string) => setMarks(prev => ({ ...prev, [id]: value }));

  const handleSubmit = async () => {
    if (!filters.totalMarks || !filters.passingMarks || !filters.subject) { toast.error("Please enter marks details!"); return; }
    
    const records = students.map(s => ({
        studentId: s._id,
        obtainedMarks: marks[s._id] || 0
    }));

    try {
        const res = await fetch('/api/test-report', {
            method: 'POST',
            body: JSON.stringify({ ...filters, className: filters.class, records })
        });
        if(res.ok) toast.success("Result Saved Successfully!");
        else toast.error("Failed to save");
    } catch(e) { toast.error("Network Error"); }
  };

  return (
    <div className="w-full">
        <Toaster position="top-center" richColors />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl border border-gray-100 mb-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <CustomDatePicker label="Select Date" name="date" value={filters.date} onChange={handleFilterChange} />
              <CustomDropdown label="Select Class" name="class" value={filters.class} onChange={handleFilterChange} options={classesList} />
              <CustomDropdown label="Select Section" name="section" value={filters.section} onChange={handleFilterChange} options={sectionsList} />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              <CustomDropdown label="Test Type" name="testType" value={filters.testType} onChange={handleFilterChange} options={["Weekly Test", "Monthly Test", "Quiz", "Mid Term"]} />
              
              {/* Dynamic Subjects Dropdown */}
              <CustomDropdown label="Select Subject" name="subject" value={filters.subject} onChange={handleFilterChange} options={subjectsList} />
              
              <CustomInput label="Total Marks" name="totalMarks" value={filters.totalMarks} onChange={handleInputFilter} type="number" />
              <CustomInput label="Passing Marks" name="passingMarks" value={filters.passingMarks} onChange={handleInputFilter} type="number" />
           </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl border border-gray-100 overflow-hidden">
           <div className="overflow-x-auto pb-4">
             <div className="min-w-[900px]">
               <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-gray-100 mb-2 px-4 bg-gray-50/50 rounded-t-xl pt-4">
                  <div className="col-span-1 text-[#3C3C3C] font-bold text-sm">Roll No</div>
                  <div className="col-span-2 text-[#3C3C3C] font-bold text-sm">Name</div>
                  <div className="col-span-2 text-[#3C3C3C] font-bold text-sm">Father Name</div>
                  <div className="col-span-3 text-[#3C3C3C] font-bold text-sm text-center">Obtained Marks</div>
                  <div className="col-span-2 text-[#3C3C3C] font-bold text-sm text-center">Percentage</div>
                  <div className="col-span-2 text-[#3C3C3C] font-bold text-sm text-center">Status</div>
               </div>
               <div className="min-h-[300px]">
                 {loading ? <div className="p-10 text-center">Loading...</div> :
                  students.length === 0 ? <div className="p-10 text-center">No Students Found</div> :
                  students.map((student, i) => (
                   <TestReportRow 
                     key={student._id} index={i} student={student} 
                     obtainedMarks={marks[student._id] || ''}
                     totalMarks={filters.totalMarks}
                     passingMarks={filters.passingMarks}
                     onMarkChange={handleMarkUpdate} 
                   />
                 ))}
               </div>
             </div>
           </div>
           <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
              <button onClick={handleSubmit} className="w-full md:w-auto px-12 py-4 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center justify-center gap-2">Submit Report <Save size={18} /></button>
           </div>
        </motion.div>
    </div>
  );
};