"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { LinedTextArea } from '@/components/ui/LinedTextArea';

// New Prop: onSuccess
export const ComplaintForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [classes, setClasses] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [students, setStudents] = useState<string[]>([]);
  const [teacherName, setTeacherName] = useState("");

  const [formData, setFormData] = useState({
    date: '', className: '', section: '', student: '', title: '', description: ''
  });

  // --- DATA FETCHING (Same as before) ---
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch('/api/classes');
        const data = await res.json();
        if (data.data) setClasses(data.data.map((c: any) => c.name));
      } catch (err) { console.error(err); }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      if (!formData.className) { setSections([]); return; }
      try {
        const res = await fetch(`/api/sections?class=${formData.className}`);
        const data = await res.json();
        if (data.success) setSections(data.data.map((s: any) => s.name));
      } catch (err) { console.error(err); }
    };
    fetchSections();
  }, [formData.className]);

  useEffect(() => {
    const fetchData = async () => {
      if (!formData.className || !formData.section) { setStudents([]); setTeacherName(""); return; }
      try {
        const sRes = await fetch(`/api/students?class=${formData.className}&section=${formData.section}`);
        const sData = await sRes.json();
        if (sData.success) setStudents(sData.data.map((s: any) => `${s.firstName} ${s.lastName}`));

        const tRes = await fetch(`/api/teacher?class=${formData.className}&section=${formData.section}`);
        const tData = await tRes.json();
        if (tData.success && tData.data.length > 0) setTeacherName(`${tData.data[0].firstName} ${tData.data[0].lastName}`);
        else setTeacherName("Not Assigned");
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [formData.section, formData.className]);

  const handleChange = (name: string, value: string) => setFormData({ ...formData, [name]: value });

  // --- SUBMIT LOGIC (REAL DB) ---
  const handleSubmit = async () => {
    if(!formData.title || !formData.description || !formData.student) { 
        toast.error("Please fill all details."); 
        return; 
    }
    setLoading(true);
    try {
        const res = await fetch('/api/complaints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentName: formData.student,
                className: formData.className,
                section: formData.section,
                date: formData.date,
                title: formData.title,
                description: formData.description,
                teacherName: teacherName
            })
        });

        const data = await res.json();

        if (res.ok) {
            toast.success("Complaint Saved Successfully!");
            // Redirect back to list
            if (onSuccess) onSuccess(); 
        } else {
            toast.error(data.error || "Failed to save.");
        }
    } catch(e) { 
        toast.error("Network Error."); 
    } 
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <Toaster position="top-center" richColors />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#3C3C3C]">Add New Complaint</h2>
        <div className="w-full h-[1px] bg-gray-200 mt-2" />
      </div>

      {/* Filters */}
      <div className="bg-white p-8 rounded-[24px] shadow-lg border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            <CustomDatePicker label="Select Date" name="date" value={formData.date} onChange={handleChange} />
            <CustomDropdown label="Select Class" name="className" value={formData.className} onChange={handleChange} options={classes} />
            <div className="relative">
                <CustomDropdown label="Select Section" name="section" value={formData.section} onChange={handleChange} options={sections} />
                {teacherName && <span className="absolute right-2 -bottom-5 text-[10px] font-medium text-[#B70003] italic">Teacher: {teacherName}</span>}
            </div>
            <CustomDropdown label="Select Student" name="student" value={formData.student} onChange={handleChange} options={students} />
        </div>
      </div>

      {/* Writing Area */}
      <div className="bg-white p-10 rounded-[24px] shadow-xl border border-gray-100 relative min-h-[500px]">
         <div className="flex items-end gap-4 mb-8">
            <label className="text-[#3C3C3C] font-bold text-lg whitespace-nowrap mb-1">Title:</label>
            <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="flex-1 border-b border-[#3C3C3C] outline-none text-lg font-medium text-[#B70003] pb-1 bg-transparent" />
         </div>
         
         <LinedTextArea value={formData.description} onChange={(val) => handleChange('description', val)} placeholder="Complaint details..." />

         <div className="absolute bottom-10 right-10">
            <button onClick={handleSubmit} disabled={loading} className="px-10 py-3 bg-[#B50104] text-white font-bold text-lg rounded-[12px] shadow-lg hover:bg-[#900000] transition-all disabled:opacity-50 flex items-center gap-2">
                {loading ? "Saving..." : "Submit Complaint"} 
            </button>
         </div>
      </div>
    </motion.div>
  );
};