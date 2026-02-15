"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { StatCard } from './StatCard';
import { Users, GraduationCap, DollarSign, Activity, Calendar, UserX, CheckSquare, ChevronRight, TrendingUp, FileText, Zap, Clock, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useRouter } from 'next/navigation';

export const Overview = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (error) {
        console.error("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleMarkAttendance = (clsName: string, clsSection: string) => {
    // Navigate to attendance tab and pass class and section separately
    router.push(`/dashboard?tab=attendance&class=${encodeURIComponent(clsName)}&section=${encodeURIComponent(clsSection)}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#B50104] border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-[#B50104]/20 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (!data) return <div className="p-10 font-black text-red-500 text-xl text-center">Failed to load data.</div>;

  const COLORS = ['#B50104', '#191919', '#E0E0E0'];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 40, damping: 15 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-24 font-['Montserrat'] text-[#191919]"
    >

      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard index={0} label="Total Students" value={data.counts.students} />
        <StatCard index={1} label="Total Teachers" value={data.counts.teachers} />
        <StatCard index={2} label="Active Parents" value={data.counts.parents} />
        <StatCard index={3} label="Net Profit (PKR)" value={data.finance.profit.toLocaleString()} />
      </div>

      {/* 2. DASHBOARD GRID - WEB3 STYLE */}

      {/* ROW 1: Attendance Chart | Demographics | Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Students Attendance - Span 5 */}
        <motion.div variants={itemVariants} className="lg:col-span-5 bg-white backdrop-blur-xl bg-opacity-80 p-8 rounded-[35px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-[100px] opacity-50 transition-all duration-500 group-hover:scale-110" />

          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-black text-[#191919] tracking-tight">Attendance</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Weekly Trends</p>
            </div>
            <div className="flex gap-2">
              <Badge color="bg-blue-600" label="Present" />
              <Badge color="bg-gray-200 text-gray-400" label="Absent" />
            </div>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.trend}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', padding: '12px', background: 'rgba(255,255,255,0.9)' }}
                  cursor={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="present" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorPresent)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Students Gender - Span 3 */}
        <motion.div variants={itemVariants} className="lg:col-span-3 bg-white backdrop-blur-xl bg-opacity-80 p-8 rounded-[35px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex flex-col items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B50104] to-[#191919]" />
          <div className="w-full flex justify-between items-center mb-4">
            <h3 className="text-xl font-black text-[#191919] tracking-tight">Ratio</h3>
            <Users size={20} className="text-gray-300" />
          </div>

          <div className="h-[200px] w-full relative flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.charts.gender.some((g: any) => g.value > 0) ? data.charts.gender : [{ name: 'No Data', value: 1, color: '#f3f4f6' }]}
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={8}
                  paddingAngle={4}
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationBegin={200}
                >
                  {(data.charts.gender.some((g: any) => g.value > 0) ? data.charts.gender : [{ name: 'No Data', value: 1, color: '#f3f4f6' }]).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#f3f4f6'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-[#191919] tracking-tighter drop-shadow-sm">
                {data.counts.students > 0 ? Math.round((data.charts.gender[0].value / data.counts.students) * 100) : 0}%
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Boys</span>
            </div>
          </div>

          <div className="flex gap-4 w-full justify-center mt-2">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#B50104]" />
                <span className="text-xs font-bold text-gray-500">Boys</span>
              </div>
              <span className="text-sm font-black text-[#191919]">{data.charts.gender[0].value}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#E0E0E0]" />
                <span className="text-xs font-bold text-gray-500">Girls</span>
              </div>
              <span className="text-sm font-black text-[#191919]">{data.charts.gender[1].value}</span>
            </div>
          </div>
        </motion.div>

        {/* Reminders - Span 4 - INCREASED WIDTH & CONTENT */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-white backdrop-blur-xl bg-opacity-80 p-8 rounded-[35px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex flex-col h-full hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-[#191919] tracking-tight">Reminders</h3>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <Zap size={16} className="text-[#B50104]" fill="#B50104" />
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-hide">
            {data.widgets.reminders.length > 0 ? (
              data.widgets.reminders.map((r: any, i: number) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center bg-gradient-to-r from-[#B50104] to-[#950002] p-1 pr-3 rounded-[18px] shadow-lg shadow-red-100 group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="bg-white/10 backdrop-blur-md w-14 h-14 flex flex-col items-center justify-center text-white rounded-[14px] shrink-0">
                    <span className="text-lg font-black leading-none">{r.date.split(' ')[0].replace(/\D/g, '')}</span>
                    <span className="text-[8px] font-bold uppercase opacity-80 mt-1">{r.date.split(' ')[1]?.slice(0, 3) || 'NOW'}</span>
                  </div>
                  <div className="flex-1 px-3 text-white min-w-0">
                    <p className="text-xs font-bold truncate tracking-wide">{r.title}</p>
                    <p className="text-[9px] font-medium opacity-70 uppercase tracking-widest mt-0.5">{r.type || 'Notice'}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">No recent updates</p>
            )}
          </div>
        </motion.div>

      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Students Progress */}
        <motion.div variants={itemVariants} className="bg-white backdrop-blur-xl bg-opacity-80 p-8 rounded-[35px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden relative group">
          {/* Decorative BG */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />

          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h3 className="text-xl font-black text-[#191919] tracking-tight">Performance</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Academic Growth</p>
            </div>
            <TrendingUp size={24} className="text-green-500" />
          </div>
          <div className="h-[200px] flex-1 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.performance}>
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="present" name="Score %" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorProgress)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions - Glassy Buttons */}
        <motion.div variants={itemVariants} className="bg-white backdrop-blur-xl bg-opacity-80 p-8 rounded-[35px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
          <h3 className="text-xl font-black text-[#191919] tracking-tight mb-8">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-5">
            <QuickBtn label="New Admission" icon={UserX} color="bg-[#B50104]" onClick={() => router.push('/dashboard?tab=forms')} delay={0} />
            <QuickBtn label="Mark Attendance" icon={CheckSquare} color="bg-[#191919]" onClick={() => router.push('/dashboard?tab=attendance')} delay={0.1} />
            <QuickBtn label="Collect Fee" icon={DollarSign} color="bg-[#191919]" onClick={() => router.push('/dashboard?tab=finance')} delay={0.2} />
            <QuickBtn label="View Reports" icon={FileText} color="bg-[#B50104]" onClick={() => router.push('/dashboard?tab=test-report')} delay={0.3} />
          </div>
        </motion.div>
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Absent Teachers */}
        <motion.div variants={itemVariants} className="bg-white backdrop-blur-xl bg-opacity-80 p-8 rounded-[35px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-red-100 to-transparent" />

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-[#191919] tracking-tight">Absent Staff</h3>
            <div className="px-3 py-1 bg-red-50 border border-red-100 rounded-full text-[10px] font-black text-[#B50104] uppercase tracking-wider">Today</div>
          </div>

          <div className="min-h-[120px] flex items-center justify-center">
            {data.widgets.absentTeachers.length > 0 ? (
              <div className="w-full space-y-3">
                {data.widgets.absentTeachers.map((t: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#B50104] font-black text-lg">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#191919]">{t.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Teacher</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1.5 rounded-lg">
                      <ShieldAlert size={14} />
                      <span className="text-[10px] font-bold uppercase">Absent</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4 animate-pulse">
                  <CheckSquare size={32} />
                </div>
                <p className="text-[#191919] font-bold">100% Attendance</p>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">All teachers present</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Unmarked Attendance */}
        <motion.div variants={itemVariants} className="bg-white backdrop-blur-xl bg-opacity-80 p-8 rounded-[35px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-orange-100 to-transparent" />

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-[#191919] tracking-tight">Pending Attendance</h3>
            <div className="px-3 py-1 bg-orange-50 border border-orange-100 rounded-full text-[10px] font-black text-orange-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={12} /> Action Needed
            </div>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {data.widgets.unmarkedClasses.length > 0 ? (
              data.widgets.unmarkedClasses.map((cls: any, i: number) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-[#191919] transition-all group cursor-pointer"
                  onClick={() => handleMarkAttendance(cls.class, cls.section)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 font-bold group-hover:bg-[#191919] group-hover:text-white transition-colors duration-300 shadow-inner">
                      {cls.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#191919] block">{cls.name}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Unmarked</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-xs font-bold text-[#191919] group-hover:text-[#B50104] transition-colors bg-gray-50 group-hover:bg-white px-4 py-2 rounded-lg">
                    Mark Now <ChevronRight size={14} />
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4">
                  <CheckSquare size={32} />
                </div>
                <p className="text-[#191919] font-bold">All Caught Up!</p>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">Attendance marked for all classes</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
};

const Badge = ({ color, label }: any) => (
  <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
    <div className={`w-1.5 h-1.5 rounded-full ${color.split(' ')[0]}`} />
    <span className={`text-[9px] font-bold uppercase ${color.includes('text') ? color.split(' ')[1] : 'text-gray-500'}`}>{label}</span>
  </div>
);

const QuickBtn = ({ label, color, icon: Icon, onClick, delay }: any) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: delay + 0.5 }}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`${color} text-white h-28 rounded-[28px] font-bold text-sm shadow-xl shadow-gray-200/50 flex flex-col items-center justify-center gap-3 group relative overflow-hidden`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

    <Icon size={28} className="mb-1 relative z-10 drop-shadow-md" />
    <span className="uppercase tracking-widest text-[10px] relative z-10">{label}</span>
  </motion.button>
);