"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Info } from 'lucide-react';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
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

        // B. Fetch Existing Sections to Determine Next Letter
        const sRes = await fetch(`/api/sections?class=${classNameStr}`);
        const sData = await sRes.json();
        if (sData.success) {
            const existingNames = sData.data.map((s: any) => s.name); // e.g. ["A", "B"]
            
            // Logic: Find first available letter
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let found = "A";
            for (let char of letters) {
                if (!existingNames.includes(char)) {
                    found = char;
                    break;
                }
            }
            setNextSection(found);
        }
      } catch (err) {
        console.error("Failed to load data");
        setNextSection("A"); // Fallback
      }
    };
    initData();
  }, [classNameStr]);

  const handleSubmit = async () => {
    setLoading(true);
    
    // Find Teacher ID
    const teacherObj = teachers.find(t => t.name === selectedTeacherName);
    const teacherId = teacherObj ? teacherObj.id : null;

    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            name: nextSection, // Auto Selected Name
            className: classNameStr,
            teacherId: teacherId
            // Capacity Removed
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Section ${nextSection} Created Successfully!`);
        // Refresh calculation for next time (e.g. if A created, now show B)
        setNextSection(prev => String.fromCharCode(prev.charCodeAt(0) + 1)); 
        setSelectedTeacherName('');
      } else {
        toast.error(data.error || "Failed to create section");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
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

      <div className="bg-white p-8 rounded-[24px] shadow-xl border border-gray-100 max-w-[600px]">
          
          {/* Auto Assignment Info Box */}
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8 flex items-start gap-4">
             <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <Info size={24} />
             </div>
             <div>
                <h4 className="text-[#191919] font-bold text-lg mb-1">Auto-Assignment</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                   System has automatically checked availability.
                </p>
             </div>
          </div>

          {/* Big Auto Selected Section Display */}
          <div className="mb-8 text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Creating Next Available Section</p>
              <h1 className="text-6xl font-black text-[#B70003]">
                {nextSection}
              </h1>
          </div>

          {/* Teacher Selection */}
          <div className="mb-8">
             <CustomDropdown 
               label="Assign Class Teacher"
               name="teacher"
               value={selectedTeacherName}
               onChange={(n, val) => setSelectedTeacherName(val)}
               options={teacherNames}
             />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 border-t border-gray-50 pt-6">
              <button onClick={onBack} className="px-8 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
                  Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="px-10 py-3 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                  {loading ? "Creating..." : "Confirm & Create"} <Save size={18} />
              </button>
          </div>

      </div>
    </div>
  );
};