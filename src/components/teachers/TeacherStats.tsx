"use client";
import React from 'react';
import { motion } from 'framer-motion';

const RedStatCard = ({ label, value, delay }: { label: string, value: number | string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative h-[130px] rounded-[16px] overflow-hidden bg-[#B50104] shadow-xl flex flex-col justify-center px-6 group cursor-default"
  >
    <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#C60205] opacity-60 rounded-full group-hover:scale-110 transition-transform duration-500" />
    <div className="absolute right-12 bottom-[-20px] w-20 h-20 bg-[#C60205] opacity-60 rounded-full" />
    
    <div className="relative z-10 text-white">
      <h3 className="text-5xl font-black tracking-tighter mb-1">{value}</h3>
      <p className="text-sm font-medium opacity-90 uppercase tracking-widest">{label}</p>
    </div>
  </motion.div>
);

export const TeacherStats = ({ stats }: { stats: any }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
       <RedStatCard label="Total Teachers" value={stats.total} delay={0} />
       <RedStatCard label="Male Teachers" value={stats.male} delay={0.1} />
       <RedStatCard label="Female Teachers" value={stats.female} delay={0.2} />
       {/* Best Teacher Logic abhi static hai kyunke 'Rating' field DB ma nahi hai */}
       <RedStatCard label="Most Experienced" value={stats.best || "N/A"} delay={0.3} />
    </div>
  );
};