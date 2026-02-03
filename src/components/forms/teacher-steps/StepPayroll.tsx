"use client";
import React from 'react';
import { CustomInput } from '@/components/ui/CustomInput';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

interface StepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomChange: (name: string, value: string) => void;
}

export const StepPayroll = ({ formData, handleChange, handleCustomChange }: StepProps) => {
  return (
    <div className="space-y-8">
      
      {/* --- Row 1: Basic Salary Info --- */}
      <div className="grid grid-cols-3 gap-6">
          <CustomInput 
             label="Monthly Salary" 
             name="monthlySalary" 
             value={formData.monthlySalary} 
             onChange={handleChange} 
             type="number" 
             suffix="PKR" 
          />
          <CustomInput 
             label="Salary Date" 
             name="salaryDate" 
             value={formData.salaryDate} 
             onChange={handleChange} 
             type="number" 
             suffix="of every month" 
          />
          <CustomInput 
             label="Allowance" 
             name="allowance" 
             value={formData.allowance} 
             onChange={handleChange} 
             type="number" 
             suffix="PKR" 
          />
      </div>

      {/* --- Row 2: Fines --- */}
      <div className="grid grid-cols-3 gap-6">
          <CustomInput 
             label="Leaving Early Fine" 
             name="leavingFine" 
             value={formData.leavingFine} 
             onChange={handleChange} 
             type="number" 
             suffix="PKR" 
          />
          <CustomInput 
             label="Late Arrival Fine" 
             name="lateFine" 
             value={formData.lateFine} 
             onChange={handleChange} 
             type="number" 
             suffix="PKR" 
          />
          <CustomInput 
             label="Absent Without Leave Fine" 
             name="absentFine" 
             value={formData.absentFine} 
             onChange={handleChange} 
             type="number" 
             suffix="PKR" 
          />
      </div>

      {/* --- Row 3: Security & Increment --- */}
      <div className="grid grid-cols-3 gap-6">
          <CustomInput 
             label="Security Deposit" 
             name="securityDeposit" 
             value={formData.securityDeposit} 
             onChange={handleChange} 
             type="number" 
             suffix="PKR" 
          />
          <CustomInput 
             label="Increment" 
             name="increment" 
             value={formData.increment} 
             onChange={handleChange} 
             type="number" 
             suffix="PKR" 
          />
          <CustomDropdown 
             label="Payment Method" 
             name="paymentMethod" 
             value={formData.paymentMethod} 
             onChange={handleCustomChange} 
             options={["Cash", "Bank Transfer", "Cheque", "EasyPaisa", "JazzCash"]} 
          />
      </div>

      {/* --- Section Divider: Bank Details --- */}
      <div className="pt-4">
        <h3 className="text-[#B70003] font-bold text-lg mb-4">Bank Details</h3>
        <div className="grid grid-cols-3 gap-6">
            <CustomDropdown 
               label="Bank/Wallet Name" 
               name="bankName" 
               value={formData.bankName} 
               onChange={handleCustomChange} 
               options={["HBL", "Meezan Bank", "UBL", "EasyPaisa", "JazzCash", "Sadapay", "Nayapay"]} 
            />
            <CustomInput 
               label="Account Title" 
               name="accountTitle" 
               value={formData.accountTitle} 
               onChange={handleChange} 
               type="text" 
            />
            <CustomInput 
               label="Account No." 
               name="accountNo" 
               value={formData.accountNo} 
               onChange={handleChange} 
               type="number" 
            />
        </div>
      </div>

    </div>
  );
};