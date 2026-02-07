"use client";
import React from 'react';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';

interface StepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomChange: (name: string, value: string) => void;
}

export const StepPersonal = ({ formData, handleChange, handleCustomChange }: StepProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-6">
        <CustomInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} type="text" />
        <CustomInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} type="text" />
        <CustomDropdown label="Gender" name="gender" value={formData.gender} onChange={handleCustomChange} options={["Male", "Female"]} />
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        <CustomDatePicker label="Date of Birth" name="dob" value={formData.dob} onChange={handleCustomChange} disableFuture={true} />
        <CustomInput label="CNIC (without dashes)" name="cnic" value={formData.cnic} onChange={handleChange} type="number" />
        <CustomDropdown label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleCustomChange} options={["Single", "Married", "Divorced"]} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <CustomInput label="Mobile No." name="mobileNo" value={formData.mobileNo} onChange={handleChange} type="number" />
        <CustomInput label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} type="number" />
      </div>

      <CustomInput label="Residential Address" name="address" value={formData.address} onChange={handleChange} type="text" />
      <CustomInput label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} type="text" />
    </div>
  );
};