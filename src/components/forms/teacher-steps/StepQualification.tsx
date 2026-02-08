"use client";
import React, { useEffect } from 'react';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';

interface StepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomChange: (name: string, value: string) => void;
}

export const StepQualification = ({ formData, handleChange, handleCustomChange }: StepProps) => {

  // --- AUTOMATIC EXPERIENCE CALCULATION ---
  useEffect(() => {
    if (formData.jobStartDate && formData.jobEndDate) {
        const start = new Date(formData.jobStartDate);
        const end = new Date(formData.jobEndDate);
        
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            let years = end.getFullYear() - start.getFullYear();
            let months = end.getMonth() - start.getMonth();
            if (months < 0) { years--; months += 12; }
            
            // Agar value change hui hai tabhi update karein (Infinite Loop se bachne ke liye)
            const expString = years > 0 ? years.toString() : "0";
            if (formData.totalExperience !== expString) {
                handleCustomChange('totalExperience', expString);
            }
        }
    }
  }, [formData.jobStartDate, formData.jobEndDate]); // Jab dates change hon tab chale

  const calculateJobDuration = (start: string, end: string) => {
    if (!start || !end) return "00 Years experience";
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "Invalid Date";
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    if (months < 0) { years--; months += 12; }
    if (years < 0) return "Invalid Duration";
    return `${years} Year${years !== 1 ? 's' : ''} ${months} Month${months !== 1 ? 's' : ''}`.trim();
  };

  return (
    <div className="space-y-8">
      {/* Education Section */}
      <div>
        <h3 className="text-[#B70003] font-bold text-lg mb-4 border-b border-gray-100 pb-2">Academic Qualification</h3>
        
        <div className="grid grid-cols-3 gap-6 mb-6">
          <CustomInput label="Latest Degree" name="degree" value={formData.degree} onChange={handleChange} type="alphanumeric" placeholder="e.g. BS Computer Science" />
          <CustomInput label="Major Subject" name="majorSubject" value={formData.majorSubject} onChange={handleChange} type="text" />
          <CustomInput label="Institute / University" name="institute" value={formData.institute} onChange={handleChange} type="alphanumeric" />
        </div>

        <div className="grid grid-cols-2 gap-6">
           <CustomDatePicker label="Completion Date" name="completionYear" value={formData.completionYear} onChange={handleCustomChange} disableFuture={true} />
           <CustomInput label="CGPA / Grade" name="cgpa" value={formData.cgpa} onChange={handleChange} type="alphanumeric" />
        </div>
      </div>

      {/* Experience Section */}
      <div>
        <h3 className="text-[#B70003] font-bold text-lg mb-4 border-b border-gray-100 pb-2">Professional Experience</h3>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
           <CustomInput label="Last Institute Name" name="lastInstitute" value={formData.lastInstitute} onChange={handleChange} type="alphanumeric" />
           <CustomInput label="Designation" name="lastDesignation" value={formData.lastDesignation} onChange={handleChange} type="text" />
        </div>

        <div className="grid grid-cols-2 gap-6 relative mb-6">
            <CustomDatePicker label="Job Start Date" name="jobStartDate" value={formData.jobStartDate} onChange={handleCustomChange} disableFuture={true} />
            
            <div className="relative">
                <CustomDatePicker label="Job End Date" name="jobEndDate" value={formData.jobEndDate} onChange={handleCustomChange} disableFuture={true} />
                <span className="absolute right-2 -bottom-6 text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  {calculateJobDuration(formData.jobStartDate, formData.jobEndDate)}
                </span>
            </div>
        </div>

        <div className="mt-4">
           <CustomInput label="Reason for Leaving" name="reasonLeaving" value={formData.reasonLeaving} onChange={handleChange} type="text" />
        </div>
      </div>
    </div>
  );
};