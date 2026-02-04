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
    
    // --- AUTH LOGIC ---
    if (username === "admin" && password === "12345") {
      setStatus('success');
      // Admin Role Set
      document.cookie = "token=valid; path=/; max-age=86400"; 
      document.cookie = "role=admin; path=/; max-age=86400"; 
      setTimeout(() => router.push('/dashboard'), 2000);
    } 
    else if (username === "teacher" && password === "12345") {
      setStatus('success');
      // Teacher Role Set
      document.cookie = "token=valid; path=/; max-age=86400"; 
      document.cookie = "role=teacher; path=/; max-age=86400"; 
      setTimeout(() => router.push('/attendance'), 2000); // Redirect to Attendance Page
    } 
    else {
      setStatus('error');
    }
  };

  // ... (Baaki UI code same rahega jo pehle tha) ...
  // Sirf return ke andar ka code waisa hi rakhein
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] relative overflow-hidden font-['Montserrat']">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 bg-white border border-[#EEEEEE] rounded-[20px] w-full max-w-[500px] p-12 relative shadow-2xl"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-[#B70003] rounded-b-full" />
        <h1 className="text-[32px] font-bold text-[#191919] text-center mb-10 mt-4">EduSmart Portal</h1>

        <form onSubmit={handleLogin} className="space-y-8">
            <div className="relative">
            <label className="text-[14px] font-medium text-[#191919] mb-2 block">Username</label>
            <input type="text" onChange={(e) => setUsername(e.target.value)} className="w-full h-[60px] border border-[#CCCCCC] rounded-[12px] px-6 outline-none focus:border-[#B70003] transition-all bg-white text-[#191919]" placeholder="Enter username" />
          </div>

          <div className="relative">
            <label className="text-[14px] font-medium text-[#191919] mb-2 block">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} className="w-full h-[60px] border border-[#CCCCCC] rounded-[12px] px-6 outline-none focus:border-[#B70003] transition-all bg-white text-[#191919]" placeholder="Enter password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#CCCCCC] hover:text-[#B70003]">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-[63px] bg-[#B70003] text-white text-[22px] font-bold cursor-pointer rounded-full mt-4 transition-all">Login</motion.button>
        </form>
      </motion.div>
      {/* ... Error Popup Code Same ... */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-white rounded-[24px] p-8 w-[400px] text-center shadow-2xl relative">
              <button onClick={() => setStatus('idle')} className="absolute right-4 top-4"><X size={20} /></button>
              <h2 className="text-2xl font-bold text-[#191919] mb-2">{status === 'success' ? 'Welcome Back!' : 'Access Denied'}</h2>
              <p className="text-gray-500 text-sm">{status === 'success' ? 'Redirecting to portal...' : "Invalid credentials provided."}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}