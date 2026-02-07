"use client";
import React, { useState, useEffect } from 'react';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomTimePicker } from '@/components/ui/CustomTimePicker';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

interface StepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomChange: (name: string, value: string) => void;
}

export const StepEnrollment = ({ formData, handleChange, handleCustomChange }: StepProps) => {
  const [classes, setClasses] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);

  // 1. Fetch Classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch('/api/classes');
        const data = await res.json();
        if (data.data) {
          setClasses(data.data.map((c: any) => c.name));
        }
      } catch (err) { console.error("Error loading classes"); }
    };
    fetchClasses();
  }, []);

  // 2. Fetch Sections
  useEffect(() => {
    const fetchSections = async () => {
      if (!formData.assignedClass) { setSections([]); return; }
      try {
        const res = await fetch(`/api/sections?class=${formData.assignedClass}`);
        const data = await res.json();
        if (data.success) {
          setSections(data.data.map((s: any) => s.name));
        }
      } catch (err) { console.error("Error loading sections"); }
    };
    fetchSections();
  }, [formData.assignedClass]);

  return (
    <div className="space-y-8">
      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-6 items-start">
        <CustomDatePicker label="Joining Date" name="joiningDate" value={formData.joiningDate} onChange={handleCustomChange} disableFuture={false} />
        <CustomInput label="Designation" name="designation" value={formData.designation} onChange={handleChange} type="text" />
      </div>

      {/* Row 2: Class, Section & Subject (Added Back) */}
      <div className="grid grid-cols-3 gap-6 items-start">
        <CustomDropdown 
            label="Assign Class" name="assignedClass" value={formData.assignedClass} 
            onChange={handleCustomChange} options={classes} 
        />
        <CustomDropdown 
            label="Assign Section" name="assignedSection" value={formData.assignedSection} 
            onChange={handleCustomChange} options={sections} disabled={!formData.assignedClass} 
        />
        {/* ASSIGN SUBJECT WAPIS AA GAYA */}
        <CustomInput 
            label="Assign Subject" 
            name="subjectsAssigned" 
            value={formData.subjectsAssigned} 
            onChange={handleChange} 
            type="text" 
            placeholder="e.g. Maths, Science"
        />
      </div>

      {/* Row 3: Timings */}
      <div className="grid grid-cols-2 gap-6 items-start">
        <CustomTimePicker label="School In Time" name="schoolInTime" value={formData.schoolInTime} onChange={handleChange} />
        <CustomTimePicker label="School Out Time" name="schoolOutTime" value={formData.schoolOutTime} onChange={handleChange} />
      </div>
    </div>
  );
};