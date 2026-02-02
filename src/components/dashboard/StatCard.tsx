"use client";
import { motion } from 'framer-motion';
import { Users, ArrowUpRight, Activity } from 'lucide-react';

interface StatProps {
  label: string;
  value: string;
  index: number;
}

export const StatCard = ({ label, value, index }: StatProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      delay: index * 0.15, 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    }}
    whileHover={{ y: -12, scale: 1.02 }}
    className="relative group cursor-pointer h-[200px] rounded-[35px] overflow-hidden p-[1px] bg-gradient-to-br from-white/20 to-transparent shadow-2xl"
  >
    {/* Theme Background */}
    <div className="absolute inset-0 bg-[#B70003] transition-colors duration-500 group-hover:bg-[#950002]" />
    
    {/* Glass Effect Layers */}
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-50" />
    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-[60px] group-hover:bg-white/20 transition-all duration-700" />

    {/* Content */}
    <div className="relative h-full w-full flex flex-col justify-between p-7 z-10 font-['Montserrat']">
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-[20px] flex items-center justify-center border border-white/20 shadow-xl group-hover:rotate-6 transition-transform">
          <Activity className="text-white" size={28} />
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-white tracking-widest uppercase">Live</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-5xl font-black text-white tracking-tighter tabular-nums leading-none">
          {value}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-white/60 text-[11px] font-bold uppercase tracking-[3px]">
            {label}
          </p>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 group-hover:text-white group-hover:border-white transition-all">
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);