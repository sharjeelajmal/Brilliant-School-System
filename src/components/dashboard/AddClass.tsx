"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, BookOpen, GraduationCap } from 'lucide-react';
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
        body: JSON.stringify({ name, fees: 0 }) // Default fees to 0 as requested
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
    <div className="space-y-8 font-['Montserrat'] animate-in fade-in slide-in-from-right-10 duration-500">
      <Toaster position="top-center" richColors />

      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-[#B70003] text-white rounded-lg hover:scale-110 transition-transform shadow-md cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-black text-[#191919] uppercase tracking-tighter">Add New Class</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* LEFT: FORM */}
        <div className="bg-white p-8 rounded-[24px] shadow-xl border border-gray-100 flex flex-col">
          <div className="mb-6 flex-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#B70003]">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#191919]">Class Details</h3>
                <p className="text-sm text-gray-500 font-medium">Create a new class for the school</p>
              </div>
            </div>

            <div className="space-y-6">
              <CustomInput
                label="Class Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="e.g. Class 9, O-Levels"
              />

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Note</p>
                <p className="text-sm text-gray-600 font-medium">Monthly fees functionality has been disabled for new classes.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-gray-50 pt-6 mt-auto">
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

        {/* RIGHT: MODERN ANIMATED BOX */}
        <div className="relative h-full min-h-[500px] bg-[#191919] rounded-[24px] shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-8 text-white group">

          {/* Animated Gradient Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-[#B70003] rounded-full blur-[120px] opacity-40 animate-pulse"></div>
            <div className="absolute bottom-[-20%] left-[-20%] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[120px] opacity-30 animate-pulse delay-1000"></div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative z-10"
          >
            <div className="relative mb-8 mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#B70003] to-orange-500 rounded-3xl rotate-6 opacity-80 blur-lg group-hover:rotate-12 transition-transform duration-500"></div>
              <div className="relative w-full h-full bg-[#202020] rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl">
                <GraduationCap size={56} className="text-white" />
              </div>
            </div>

            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Education
            </h2>
            <p className="text-gray-400 font-medium text-sm max-w-[280px] mx-auto leading-relaxed">
              "The roots of education are bitter, but the fruit is sweet."
            </p>
          </motion.div>

          {/* Decorative Lines */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};