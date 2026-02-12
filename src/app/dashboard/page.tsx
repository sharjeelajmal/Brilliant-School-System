"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Overview } from "@/components/dashboard/Overview";
import { ClassesOverview } from "@/components/dashboard/ClassesOverview";
import AdmissionForm from "@/components/forms/AdmissionForm";
import TeacherHiringForm from "@/components/forms/TeacherHiringForm";
import { ComplaintManager } from "@/components/complaints/ComplaintManager";
import { StudentsOverview } from "@/components/students/StudentsOverview";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ParentsOverview } from '@/components/parents/ParentsOverview';
import { TeachersOverview } from "@/components/teachers/TeachersOverview";
import { SubjectManager } from '@/components/dashboard/SubjectManager'; //
// IMPORT NEW SHARED CONTENT COMPONENTS
import { AttendanceContent } from "@/components/attendance/AttendanceContent";
import { TestReportContent } from "@/components/test-report/TestReportContent";
import { MonthlyFeeCollection } from "@/components/fee/MonthlyFeeCollection";
import { ClassDiary } from "@/components/diary/ClassDiary";
import { StaffPayroll } from "@/components/payroll/StaffPayroll";

function DashboardContent() {
  const [isOpen, setIsOpen] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "overview";
  const [activePage, setActivePage] = useState(tab);

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    if (savedState !== null) setIsOpen(JSON.parse(savedState));
  }, []);

  const handleSidebarToggle = (state: boolean) => {
    setIsOpen(state);
    localStorage.setItem("sidebarOpen", JSON.stringify(state));
  };

  const handlePageChange = (page: string) => {
    setActivePage(page);
    router.push(`/dashboard?tab=${page}`);
  };

  useEffect(() => {
    setActivePage(tab);
  }, [tab]);

  const getTitle = () => {
    if (activePage === "complaints") return "Complaint Center";
    // Add titles for new tabs
    if (activePage === "attendance") return "Attendance Management";
    if (activePage === "test-report") return "Test Results";
    if (activePage === "finance") return "Fee & Finance";
    if (activePage === "diary") return "Class Diary";
    if (activePage === "payroll") return "Staff Payroll";
    return activePage.replace("-", " ");
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-['Montserrat'] overflow-hidden">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={handleSidebarToggle}
        activePage={activePage}
        setActivePage={handlePageChange}
      />

      <main className="flex-1 p-8 md:p-12 h-screen overflow-y-auto">
        {activePage !== "students" && (
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#191919] tracking-tighter leading-none mb-3 uppercase">
                {getTitle()}
              </h1>
              <div className="h-1.5 w-20 bg-[#B70003] rounded-full" />
            </div>
            <div className="flex items-center gap-4 md:gap-6 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-[#B70003] uppercase tracking-[3px]">
                  Admin Hub
                </p>
                <p className="text-sm md:text-lg font-bold text-[#191919] group-hover:tracking-wider transition-all">
                  M. Ahsan
                </p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-[20px] bg-[#B70003] p-1 shadow-2xl shadow-red-900/20 group-hover:rotate-3 transition-transform">
                <img
                  src="https://ui-avatars.com/api/?name=M+Ahsan&background=B70003&color=fff"
                  className="w-full h-full rounded-[16px]"
                  alt="admin"
                />
              </div>
            </div>
          </header>
        )}

        <AnimatePresence mode="wait">
          {activePage === "overview" ? (
            <Overview key="overview" />
          ) : activePage === "classes" ? (
            <motion.div
              key="classes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ClassesOverview />
            </motion.div>
            // 👇 Ye Naya Block Add Karein 👇
          ) : activePage === "subjects" ? (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SubjectManager />
            </motion.div>
            // 👆 Yahan Tak 👆
          ) : activePage === "forms" ? (
            <motion.div
              key="forms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdmissionForm />
            </motion.div>
            // 👇 ADD PARENTS ROUTE HERE
          ) : activePage === 'parents' ? (
            <motion.div key="parents" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ParentsOverview />
            </motion.div>
          ) : activePage === 'teachers' ? (
            // --- 1. TEACHERS LIST SHOW HOGI ---
            <motion.div key="teachers-list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <TeachersOverview onNavigate={handlePageChange} />
            </motion.div>
          ) : activePage === 'teacher-hiring' ? (
            // --- 2. HIRING FORM ALAG PAGE PE SHOW HOGA ---
            <motion.div key="teacher-hiring" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <TeacherHiringForm />
            </motion.div>
          ) : activePage === 'complaints' ? (
            <motion.div
              key="complaints"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ComplaintManager />
            </motion.div>
          ) : activePage === "students" ? (
            <motion.div
              key="students"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StudentsOverview onNavigate={handlePageChange} />
            </motion.div>
          ) : // --- NEW ADMIN TABS ---
            activePage === "attendance" ? (
              <motion.div
                key="attendance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AttendanceContent />
              </motion.div>
            ) : activePage === "test-report" ? (
              <motion.div
                key="test-report"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TestReportContent />
              </motion.div>
            ) : activePage === "diary" ? (
              <motion.div
                key="diary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ClassDiary mode="admin" />
              </motion.div>
            ) : activePage === "finance" ? (
              <motion.div
                key="finance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <MonthlyFeeCollection />
              </motion.div>
            ) : activePage === "payroll" ? (
              <motion.div
                key="payroll"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <StaffPayroll />
              </motion.div>
            ) : (
              <div className="p-20 text-center font-bold text-gray-200 text-4xl italic">
                Content Module Locked
              </div>
            )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#FDFDFD]">
          <div className="text-[#B70003] font-bold text-xl animate-pulse">
            Loading...
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
