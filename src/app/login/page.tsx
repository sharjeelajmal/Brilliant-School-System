"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2, XCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "12345") {
      setStatus('success');
      
      // CHANGE: LocalStorage ki jagah Cookie set karein
      // "path=/" zaroori hai taake poori app mein cookie milay
      document.cookie = "isLoggedIn=true; path=/; max-age=86400"; // Expires in 1 day

      setTimeout(() => router.push('/dashboard'), 2500);
    } else {
      setStatus('error');
    }
  };

  // ... Baaki code same rahega ...
  return (
    // ... Aapka purana JSX code ...
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] relative overflow-hidden font-['Montserrat']">
      {/* ... Same UI Code ... */}
      
      {/* Sirf handleLogin function update hua hai upar */}
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 bg-white border border-[#EEEEEE] rounded-[20px] w-full max-w-[500px] p-12 relative"
        style={{ boxShadow: "0px 100px 80px rgba(0, 0, 0, 0.02), 0px 40px 30px rgba(0, 0, 0, 0.04)" }}
      >
        {/* ... Form UI same rahega, bas onSubmit={handleLogin} call hoga ... */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-[#B70003] rounded-b-full" />
        <h1 className="text-[32px] font-bold text-[#191919] text-center mb-10 mt-4">Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-8">
            <div className="relative">
            <label className="text-[14px] font-medium text-[#191919] mb-2 block">Username</label>
            <input 
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-[60px] border border-[#CCCCCC] rounded-[12px] px-6 outline-none focus:border-[#B70003] transition-all bg-white text-[#191919]"
              placeholder="Enter username"
            />
          </div>

          <div className="relative">
            <label className="text-[14px] font-medium text-[#191919] mb-2 block">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[60px] border border-[#CCCCCC] rounded-[12px] px-6 outline-none focus:border-[#B70003] transition-all bg-white text-[#191919]"
                placeholder="Enter password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#CCCCCC] hover:text-[#B70003]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="rem" className="w-4 h-4 border-[#CCCCCC] rounded accent-[#B70003]" />
            <label htmlFor="rem" className="text-[13px] text-[#191919]">Remember me</label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0px 20px 40px rgba(183, 0, 3, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[63px] bg-[#B70003] text-white text-[22px] font-bold cursor-pointer rounded-full mt-4 transition-all"
          >
            Login
          </motion.button>
        </form>
      </motion.div>

      {/* Popup logic same rahegi */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
             <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-[24px] p-8 w-[400px] text-center shadow-2xl relative overflow-hidden"
            >
              <div className={`absolute bottom-0 left-0 w-full h-2 ${status === 'success' ? 'bg-[#28A745]' : 'bg-[#B70003]'}`} />
              <button onClick={() => setStatus('idle')} className="absolute right-4 top-4 text-gray-400 hover:text-black"><X size={20} /></button>
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full ${status === 'success' ? 'bg-[#28A745]/10' : 'bg-[#B70003]/10'} relative`}>
                  {status === 'success' ? <CheckCircle2 size={50} className="text-[#28A745]" /> : <XCircle size={50} className="text-[#B70003]" />}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#191919] mb-2">{status === 'success' ? 'Success!' : 'Error!'}</h2>
              <p className="text-gray-500 text-sm mb-8">{status === 'success' ? 'Redirecting...' : "Check details."}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}