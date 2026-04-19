"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Power, Server, Cpu, Globe, Activity, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function SharyyControlPanel() {
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/system/config');
        const data = await res.json();
        if (data.success) {
          setIsActive(data.isSoftwareActive);
        }
      } catch (error) {
        toast.error("Failed to load system status");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleToggle = async () => {
    setToggling(true);
    const newStatus = !isActive;
    try {
      const res = await fetch('/api/system/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSoftwareActive: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setIsActive(data.isSoftwareActive);
        toast.success(`Software access is now ${data.isSoftwareActive ? 'ACTIVE' : 'SUSPENDED'}`);
      }
    } catch (error) {
      toast.error("Critical update failure");
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="text-[#B50104] animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-['Montserrat'] overflow-y-auto overflow-x-hidden selection:bg-[#B50104] selection:text-white">
      <Toaster position="bottom-right" richColors />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-[#B50104]/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6">
            <Shield size={10} className="text-[#B50104] md:w-[12px]" /> 
            Secure Hardware Override
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-3 md:mb-4">
            CORE <span className="text-[#B50104]">SWITCH</span>
          </h1>
          <p className="text-gray-500 text-xs md:text-base font-medium max-w-[280px] md:max-w-md mx-auto leading-relaxed">
            Global access override for Skill Grace School System instance.
          </p>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-full max-w-4xl mb-8 md:mb-12">
          <StatMiniCard icon={Activity} label="Status" value={isActive ? "Live" : "Halted"} color={isActive ? "text-green-400" : "text-red-500"} />
          <StatMiniCard icon={Server} label="Env" value="Prod" />
          <StatMiniCard icon={Cpu} label="Control" value="Remote" className="hidden md:block" />
          {/* Mobile only 3rd card or keep 2 col */}
          <div className="md:hidden">
            <StatMiniCard icon={Cpu} label="Control" value="Remote" />
          </div>
        </div>

        {/* The Main Toggle */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative group p-8 md:p-16 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[40px] md:rounded-[60px] shadow-2xl overflow-hidden w-full max-w-[340px] md:max-w-none"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#B50104]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              animate={{ 
                boxShadow: isActive 
                  ? "0 0 40px rgba(74, 222, 128, 0.15)" 
                  : "0 0 40px rgba(181, 1, 4, 0.3)" 
              }}
              onClick={handleToggle}
              className={`w-48 h-24 md:w-64 md:h-32 rounded-full p-1.5 md:p-2 cursor-pointer transition-all duration-700 relative overflow-hidden flex items-center ${isActive ? 'bg-green-500/20' : 'bg-red-500/20'}`}
            >
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`w-20 h-20 md:w-28 md:h-28 rounded-full shadow-2xl flex items-center justify-center relative z-20 ${isActive ? 'ml-auto bg-green-500' : 'bg-[#B50104]'}`}
              >
                {toggling ? <Loader2 className="animate-spin text-white w-6 h-6 md:w-8 md:h-8" /> : <Power className="text-white w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />}
                
                <AnimatePresence>
                  {isActive ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute -inset-2 md:-inset-4 bg-green-500/30 blur-lg md:blur-xl rounded-full -z-10" />
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute -inset-2 md:-inset-4 bg-red-500/30 blur-lg md:blur-xl rounded-full -z-10" />
                  )}
                </AnimatePresence>
              </motion.div>
              
              <div className={`absolute left-6 md:left-10 text-[10px] md:text-xs font-black uppercase tracking-widest ${isActive ? 'opacity-30' : 'opacity-100 text-red-500'}`}>OFF</div>
              <div className={`absolute right-6 md:right-10 text-[10px] md:text-xs font-black uppercase tracking-widest ${isActive ? 'opacity-100 text-green-400' : 'opacity-30'}`}>ON</div>
            </motion.div>

            <div className="mt-8 md:mt-10 text-center">
              <h3 className={`text-xl md:text-2xl font-black transition-colors ${isActive ? 'text-green-400' : 'text-red-500'}`}>
                {isActive ? 'SYSTEM LIVE' : 'SUSPENDED'}
              </h3>
              <p className="text-gray-500 text-[9px] md:text-xs font-bold mt-1.5 md:mt-2 uppercase tracking-widest">
                VERIFIED: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer info */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <Globe size={12} /> GLOBAL INSTANCE CONSOLE 3.2.6
          </p>
          <div className="inline-flex gap-8 text-[11px] font-black text-gray-500">
            <span className="hover:text-[#B50104] transition-colors cursor-crosshair">LOG DATA</span>
            <span className="hover:text-[#B50104] transition-colors cursor-crosshair">HARDWARE ID</span>
            <span className="hover:text-[#B50104] transition-colors cursor-crosshair">ENCRYPTION</span>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatMiniCard({ icon: Icon, label, value, color = "text-white", className = "" }: any) {
  return (
    <div className={`bg-white/[0.03] border border-white/5 p-3 md:p-6 rounded-2xl md:rounded-[24px] hover:bg-white/[0.05] transition-colors ${className}`}>
      <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-3">
        <Icon size={12} className="text-[#B50104] md:w-[16px]" />
        <span className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className={`text-sm md:text-lg font-black tracking-tight ${color}`}>{value}</div>
    </div>
  );
}
