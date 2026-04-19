"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CreditCard, Mail } from 'lucide-react';

export const SuspendedScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0A0A] overflow-y-auto overflow-x-hidden selection:bg-[#B50104] selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#B50104]/5 blur-[100px] md:blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-red-900/5 blur-[100px] md:blur-[150px] rounded-full" />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative z-10 w-full">
        <div className="max-w-xl w-full text-center py-10">

          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#B50104] to-[#7A0103] rounded-[28px] md:rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-900/40 relative"
          >
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[#B50104] blur-xl opacity-50 rounded-[28px] md:rounded-[32px]"
            />
            <Lock size={32} className="text-white relative z-10 md:hidden" />
            <Lock size={40} className="text-white relative z-10 hidden md:block" />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase">
              ACCESS <span className="text-[#B50104]">DENIED</span>
            </h1>
            <div className="h-1 w-16 md:w-20 bg-[#B50104] mx-auto rounded-full mb-8" />

            <p className="text-gray-400 text-sm md:text-xl font-medium mb-10 leading-relaxed max-w-sm md:max-w-lg mx-auto px-4 md:px-0">
              Subscription or monthly fee is overdue. Please settle the dues to continue using <span className="text-white font-bold underline decoration-[#B50104]">Skill Grace School System</span>.
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 px-2 md:px-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-4 md:p-5 rounded-2xl flex items-center gap-4 text-left"
            >
              <div className="w-12 h-12 bg-[#B50104]/10 rounded-xl flex items-center justify-center text-[#B50104] shrink-0">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Payment Required</p>
                <p className="text-gray-500 text-xs">Contact Sharry Dev</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-4 md:p-5 rounded-2xl flex items-center gap-4 text-left overflow-hidden w-full"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                <Mail size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-sm">Support 24/7</p>
                <p className="text-gray-500 text-xs break-all lg:break-normal">sharjeelajmalg786@gmail.com</p>
              </div>
            </motion.div>
          </div>

          {/* Bottom Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-gray-600 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-4"
          >
            Secure Hardware Identity & Access Control &copy; 2026
          </motion.div>
        </div>
      </div>
    </div>
  );
};
