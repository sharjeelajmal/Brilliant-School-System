"use client";
import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { CustomInput } from '@/components/ui/CustomInput'; // Make sure this path exists
import { toast, Toaster } from 'sonner';

interface AddClassProps {
  onBack: () => void;
}

export const AddClass = ({ onBack }: AddClassProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    if (!name) { toast.error("Class Name is required"); return; }
    
    setLoading(true);
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }) // Sirf Name bhej rahay hain
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Class Created Successfully!");
        setName('');
      } else {
        toast.error(data.error || "Failed to create class");
      }
    } catch (error) {
      toast.error("Something went wrong");
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
        <h2 className="text-3xl font-black text-[#191919] uppercase tracking-tighter">Add New Class</h2>
      </div>

      <div className="bg-white p-8 rounded-[24px] shadow-xl border border-gray-100 max-w-[600px]">
          <div className="mb-8">
             <CustomInput 
                label="Class Name" 
                name="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                type="text" 
                placeholder="e.g. Class 9, O-Levels"
             />
          </div>

          <div className="flex justify-end gap-4 border-t border-gray-50 pt-6">
              <button onClick={onBack} className="px-8 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
                  Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="px-10 py-3 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                  {loading ? "Creating..." : "Create Class"} <Save size={18} />
              </button>
          </div>
      </div>
    </div>
  );
};