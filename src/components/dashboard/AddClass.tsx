"use client";
import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { CustomInput } from '@/components/ui/CustomInput';
import { toast, Toaster } from 'sonner'; // Notifications ke liye

interface AddClassProps {
  onBack: () => void;
}

export const AddClass = ({ onBack }: AddClassProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    className: '',
    maxCapacity: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.className || !formData.maxCapacity) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.className, 
          maxCapacity: formData.maxCapacity 
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Class Added Successfully!");
        setFormData({ className: '', maxCapacity: '' });
        // Optional: onBack(); // Agar save hone ke baad wapis bhejna ho
      } else {
        toast.error(data.error || "Failed to add class");
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
        <h2 className="text-3xl font-black text-[#191919] uppercase tracking-tighter">Add New Class</h2>
      </div>

      <div className="bg-white p-8 rounded-[24px] shadow-xl border border-gray-100 max-w-[800px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <CustomInput 
                  label="Class Name" 
                  name="className" 
                  value={formData.className} 
                  onChange={handleChange} 
                  type="alphanumeric"
                  placeholder="e.g. Play Group"
              />
              <CustomInput 
                  label="Max Student Capacity" 
                  name="maxCapacity" 
                  value={formData.maxCapacity} 
                  onChange={handleChange} 
                  type="number"
                  suffix="Students"
              />
          </div>

          {/* Teacher Dropdown Removed */}

          <div className="flex justify-end gap-4 border-t border-gray-50 pt-6">
              <button onClick={onBack} className="px-8 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all cursor-pointer">
                  Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="px-10 py-3 bg-[#B70003] text-white font-bold rounded-xl shadow-lg hover:bg-[#950002] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                  {loading ? "Saving..." : "Save Class"} <Save size={18} />
              </button>
          </div>
      </div>
    </div>
  );
};