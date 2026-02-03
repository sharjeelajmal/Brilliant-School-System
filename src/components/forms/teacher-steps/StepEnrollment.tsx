"use client";
import React from 'react';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { CustomTimePicker } from '@/components/ui/CustomTimePicker';

interface StepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomChange: (name: string, value: string) => void;
}

export const StepEnrollment = ({ formData, handleChange, handleCustomChange }: StepProps) => {
  return (
    <div className="space-y-8">
      {/* Row 1: Date | Designation | Subject */}
      <div className="grid grid-cols-3 gap-6 items-start">
        <CustomDatePicker 
          label="Joining Date" 
          name="joiningDate" 
          value={formData.joiningDate} 
          onChange={handleCustomChange} 
          disableFuture={false} 
        />
        
        {/* ADDED: Designation Input */}
        <CustomInput 
          label="Designation" 
          name="designation" 
          value={formData.designation} 
          onChange={handleChange} 
          type="alphanumeric" 
        />
        
        <CustomInput 
          label="Subject(s) Assigned" 
          name="subjectsAssigned" 
          value={formData.subjectsAssigned} 
          onChange={handleChange} 
          type="alphanumeric" 
        />
      </div>

      {/* Row 2: Class & Section + Timings */}
      <div className="grid grid-cols-3 gap-6 items-start">
        <div className="relative">
          <CustomDropdown 
            label="Class & Section" 
            name="classSection" 
            value={formData.classSection} 
            onChange={handleCustomChange} 
            options={["Class 1 - A", "Class 1 - B", "Class 2 - A", "O-Levels - Red"]} 
          />
          <span className="absolute right-1 -bottom-5 text-[10px] font-medium text-gray-300">
            00 Students
          </span>
        </div>

        <CustomTimePicker 
          label="School In Time" 
          name="schoolInTime" 
          value={formData.schoolInTime} 
          onChange={handleChange} 
        />

        <CustomTimePicker 
          label="School Out Time" 
          name="schoolOutTime" 
          value={formData.schoolOutTime} 
          onChange={handleChange} 
        />
      </div>
    </div>
  );
};