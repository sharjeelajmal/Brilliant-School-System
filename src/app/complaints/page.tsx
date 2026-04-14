"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { ComplaintForm } from '@/components/complaints/ComplaintForm';

export default function ComplaintPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-['Montserrat'] p-6 md:p-12 relative">
      
      {/* --- Custom Header --- */}
      <header className="flex justify-between items-start mb-12">
         
         {/* Left: Back Button */}
         <button 
            onClick={() => router.back()} 
            className="w-[34px] h-[45px] bg-[#B50104] rounded-[4px] flex items-center justify-center text-white hover:scale-105 transition-transform shadow-md cursor-pointer"
         >
            <ChevronLeft size={24} />
         </button>

         {/* Right: User Profile */}
         <div className="flex items-center gap-3 text-right">
            <div>
               <p className="text-[13px] text-[#C3C3C3] font-normal">Hello,</p>
               <p className="text-[20px] text-[#3C3C3C] font-bold">Ray Mehboob</p>
            </div>
            <div className="w-[50px] h-[50px] rounded-[4px] border border-[#CCCCCC] overflow-hidden p-0.5 bg-white">
               <img 
                 src="https://ui-avatars.com/api/?name=Ray+Mehboob&background=B50104&color=fff&rounded=true" 
                 alt="User" 
                 className="w-full h-full object-cover rounded-[2px]" 
               />
            </div>
         </div>
      </header>

      {/* --- Page Content --- */}
      <main className="max-w-[1340px] mx-auto">
         <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="mb-8"
         >
            <h1 className="text-[32px] font-bold text-[#3C3C3C]">Add New Complaint</h1>
            <div className="w-full h-[1px] bg-[#9A9A9A] mt-6 opacity-30" />
         </motion.div>

         {/* Form Component */}
         <ComplaintForm />
      </main>

    </div>
  );
}