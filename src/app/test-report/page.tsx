"use client";
import React from 'react';
import { TeacherHeader } from '@/components/layout/TeacherHeader';
import { TestReportContent } from '@/components/test-report/TestReportContent';

export default function TestReportPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-['Montserrat'] pb-20 md:pb-0">
      <TeacherHeader title="Class Test Report" activePage="test-report" />
   <main className="max-w-[1200px] mx-auto p-4 md:p-8 mt-24 md:mt-0">
         <TestReportContent />
      </main>
    </div>
  );
}