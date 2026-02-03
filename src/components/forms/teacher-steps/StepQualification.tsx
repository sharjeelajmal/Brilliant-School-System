"use client";
import React from 'react';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

interface StepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomChange: (name: string, value: string) => void;
  yearsList: string[];
  calculateJobDuration: (start: string, end: string) => string;
}

export const StepQualification = ({ 
  formData, handleChange, handleCustomChange, yearsList, calculateJobDuration 
}: StepProps) => {
  return (
    <div className="space-y-8">
      {/* Row 1: Degree | Major | Institute */}
      <div className="grid grid-cols-3 gap-6">
          <CustomInput label="Degree/Qualification" name="degree" value={formData.degree} onChange={handleChange} type="alphanumeric" />
          <CustomInput label="Major Subject" name="majorSubject" value={formData.majorSubject} onChange={handleChange} type="alphanumeric" />
          <CustomInput label="Institute/University" name="institute" value={formData.institute} onChange={handleChange} type="alphanumeric" />
      </div>

      {/* Row 2: Year | Grade | Experience */}
      <div className="grid grid-cols-3 gap-6">
          <CustomDropdown label="Year of Completion" name="completionYear" value={formData.completionYear} onChange={handleCustomChange} options={yearsList} />
          <CustomInput label="Grade/CGPA" name="cgpa" value={formData.cgpa} onChange={handleChange} type="alphanumeric" />
          <CustomDropdown label="Experience" name="totalExperience" value={formData.totalExperience} onChange={handleCustomChange} options={["Fresh", "1 Year", "2 Years", "3 Years", "4 Years", "5+ Years"]} />
      </div>

      {/* Row 3: Last School | Designation | Subjects */}
      <div className="grid grid-cols-3 gap-6">
          <CustomInput label="School/Institute Name" name="lastInstitute" value={formData.lastInstitute} onChange={handleChange} type="alphanumeric" />
          <CustomInput label="Designation" name="lastDesignation" value={formData.lastDesignation} onChange={handleChange} type="alphanumeric" />
          <CustomInput label="Subject(s) Taught" name="subjectsTaught" value={formData.subjectsTaught} onChange={handleChange} type="alphanumeric" />
      </div>

      {/* Row 4: Class Levels | Start Date | End Date */}
      <div className="grid grid-cols-3 gap-6 items-start">
          <CustomDropdown 
            label="Class Levels" 
            name="classLevels" 
            value={formData.classLevels} 
            onChange={handleCustomChange} 
            options={["Primary", "Middle", "Metric", "O-Levels", "A-Levels"]} 
          />
          
          <CustomDatePicker 
            label="Starting Date" 
            name="jobStartDate" 
            value={formData.jobStartDate} 
            onChange={handleCustomChange} 
            disableFuture={false} 
          />
          
          <div className="relative">
              <CustomDatePicker 
                label="Ending Date" 
                name="jobEndDate" 
                value={formData.jobEndDate} 
                onChange={handleCustomChange} 
                disableFuture={false} 
              />
              {/* Experience Calculation Text */}
              <span className="absolute right-2 -bottom-5 text-[10px] font-bold text-gray-400">
                 {calculateJobDuration(formData.jobStartDate, formData.jobEndDate)}
              </span>
          </div>
      </div>

      {/* Row 5: Reason of Leaving */}
      <div className="w-full">
          <CustomInput label="Reason of Leaving" name="reasonLeaving" value={formData.reasonLeaving} onChange={handleChange} type="alphanumeric" />
      </div>
    </div>
  );
};