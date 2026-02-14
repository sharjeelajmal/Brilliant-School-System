"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Info } from 'lucide-react';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { CustomInput } from '@/components/ui/CustomInput'; // CustomInput Import Karein
import { toast, Toaster } from 'sonner';

interface AddSectionProps {
  classNameStr: string;
  onBack: () => void;
}

export const AddSection = ({ classNameStr, onBack }: AddSectionProps) => {
  const [loading, setLoading] = useState(false);

  // Data States
  const [teachers, setTeachers] = useState<{ id: string, name: string }[]>([]);
  const [teacherNames, setTeacherNames] = useState<string[]>([]);

  // Auto-Calculated Section Name
  const [nextSection, setNextSection] = useState<string>('Checking...');
  const [selectedTeacherName, setSelectedTeacherName] = useState('');

  // NEW: Capacity State (Default 40)
  const [capacity, setCapacity] = useState('40');

  // 1. Fetch Teachers & Calculate Next Section
  useEffect(() => {
    const initData = async () => {
      try {
        // A. Fetch Teachers
        const tRes = await fetch('/api/teacher');
        const tData = await tRes.json();
        if (tData.success) {
          setTeachers(tData.data.map((t: any) => ({ id: t._id, name: `${t.firstName} ${t.lastName}` })));
          setTeacherNames(tData.data.map((t: any) => `${t.firstName} ${t.lastName}`));
        }

        // B. Fetch Existing Sections
        const sRes = await fetch(`/api/sections?class=${classNameStr}`);
        const sData = await sRes.json();
        if (sData.success) {
          const existingNames = sData.data.map((s: any) => s.name);
          const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          let found = "A";
          for (let char of letters) {
            if (!existingNames.includes(char)) { found = char; break; }
          }
          setNextSection(found);
        }
      } catch (err) { setNextSection("A"); }
    };
    initData();
  }, [classNameStr]);

  const handleSubmit = async () => {
    if (!capacity || parseInt(capacity) < 1) {
      toast.error("Please enter a valid capacity");
      return;
    }

    setLoading(true);
    const teacherObj = teachers.find(t => t.name === selectedTeacherName);
    const teacherId = teacherObj ? teacherObj.id : null;

    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nextSection,
          className: classNameStr,
          teacherId: teacherId,
          maxCapacity: parseInt(capacity) // Send Capacity to Backend
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Section ${nextSection} Created Successfully!`);
        setNextSection(prev => String.fromCharCode(prev.charCodeAt(0) + 1));
        setSelectedTeacherName('');
        setCapacity('40'); // Reset capacity
      } else {
        toast.error(data.error || "Failed to create section");
      }
    } catch (error) { toast.error("Something went wrong!"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-right-10 duration-300">
      <Toaster position="top-center" richColors />

      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-[#B70003] text-white rounded-lg hover:scale-110 transition-transform shadow-md cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-[#191919] uppercase tracking-tighter">Add New Section</h2>
          <p className="text-sm font-bold text-[#B70003] uppercase tracking-wide">For Class: {classNameStr}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* LEFT: FORM */}
        <div className="bg-white p-8 rounded-[24px] shadow-xl border border-gray-100 flex flex-col">

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8 flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Info size={24} /></div>
            <div>
              <h4 className="text-[#191919] font-bold text-lg mb-1">Auto-Assignment</h4>
              <p className="text-sm text-gray-600 leading-relaxed">System has automatically checked availability.</p>
            </div>
          </div>

          <div className="mb-8 text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-white hover:border-[#B70003] transition-colors group">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2 group-hover:text-[#B70003] transition-colors">Creating Next Available Section</p>
            <h1 className="text-6xl font-black text-[#B70003] group-hover:scale-110 transition-transform duration-300">{nextSection}</h1>
          </div>

          {/* INPUTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <CustomDropdown
              label="Assign Class Teacher"
              name="teacher"
              value={selectedTeacherName}
              onChange={(n, val) => setSelectedTeacherName(val)}
              options={teacherNames}
            />

            <CustomInput
              label="Max Student Capacity"
              name="maxCapacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              type="number"
            />
          </div>

          <div className="mt-auto flex justify-end gap-4 border-t border-gray-50 pt-6">
            <button onClick={onBack} className="px-8 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all cursor-pointer">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="px-10 py-3 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50">
              {loading ? "Creating..." : "Confirm & Create"} <Save size={18} />
            </button>
          </div>
        </div>

        {/* RIGHT: MODERN ANIMATED BOX */}
        <div className="relative h-full min-h-[500px] bg-[#191919] rounded-[24px] shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-8 text-white group">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#B70003] rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600 rounded-full blur-[100px] animate-pulse delay-1000"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-[#B70003] to-orange-500 rounded-2xl rotate-12 flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:rotate-6 transition-transform duration-500">
              <div className="w-20 h-20 bg-[#121212] rounded-xl flex items-center justify-center">
                <h3 className="text-4xl font-black text-white">{nextSection}</h3>
              </div>
            </div>

            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Section Management</h2>
            <p className="text-gray-400 font-medium text-sm max-w-[250px] mx-auto leading-relaxed">
              Efficiently organize students into manageable sections for better learning environments.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};