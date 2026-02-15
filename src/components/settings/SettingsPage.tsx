"use client";
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Shield, Bell, Palette, School, Save,
    Camera, Lock, Mail, Phone, Globe, MapPin,
    Monitor, Moon, Sun, CreditCard, AlertTriangle, TrendingUp
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

// --- SUB-COMPONENTS FOR TABS ---

const ProfileSettings = ({ user, setUser }: any) => {
    const [formData, setFormData] = useState({ ...user });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const res = await fetch('/api/user/settings', {
                method: 'PUT',
                body: JSON.stringify({ ...formData, username: user.username })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Profile Updated!");
                setUser(data.data);
                localStorage.setItem('user', JSON.stringify(data.data));
            }
        } catch (e) { toast.error("Update Failed"); }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-red-50 to-white rounded-3xl border border-red-100 shadow-sm">
                <div className="relative group cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const formData = new FormData();
                            formData.append('file', file);

                            const toastId = toast.loading("Uploading...");
                            try {
                                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                const data = await res.json();
                                if (data.success) {
                                    setFormData({ ...formData, profileImage: data.url });
                                    toast.success("Image Uploaded!", { id: toastId });
                                } else {
                                    toast.error("Upload Failed", { id: toastId });
                                }
                            } catch (err) {
                                toast.error("Upload Error", { id: toastId });
                            }
                        }}
                    />
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#B70003] to-[#800000] p-1 shadow-xl shadow-red-900/20 rotate-3 group-hover:rotate-0 transition-all duration-300">
                        <img src={formData.profileImage || "https://ui-avatars.com/api/?name=User&background=random"} alt="Profile" className="w-full h-full rounded-[14px] object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white text-[#B70003] p-2 rounded-full shadow-lg border border-red-50 group-hover:scale-110 transition-transform">
                        <Camera size={16} />
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-black text-[#191919] tracking-tight">{formData.name}</h3>
                    <p className="text-sm font-bold text-[#B70003] uppercase tracking-wider mb-2">@{formData.username}</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Active Now
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-[#B70003] outline-none transition-all font-bold text-[#191919]" />
                </div>
                {/* Can add more fields if added to User model */}
            </div>
            <div className="flex justify-end">
                <button onClick={handleSave} className="px-8 py-3 bg-[#B70003] text-white font-bold rounded-xl shadow-lg flex items-center gap-2">
                    <Save size={18} /> Save Changes
                </button>
            </div>
        </motion.div>
    );
};

const SecuritySettings = ({ user }: any) => {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const handleChangePassword = async () => {
        if (passwords.new !== passwords.confirm) return toast.error("Passwords do not match");
        try {
            const res = await fetch('/api/user/settings', {
                method: 'PUT',
                body: JSON.stringify({
                    username: user.username,
                    password: passwords.new // In real app, verify current password first!
                })
            });
            if (res.ok) toast.success("Password Changed!");
        } catch (e) { toast.error("Error changing password"); }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="p-6 rounded-2xl bg-red-50 border border-red-100 mb-6 flex gap-4">
                <div className="p-3 bg-red-100 rounded-xl text-[#B70003]"><Shield size={24} /></div>
                <div>
                    <h4 className="font-bold text-[#191919] text-lg">Secure Your Account</h4>
                    <p className="text-sm text-gray-600 mt-1">Update your password regularly to stay safe.</p>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-bold text-[#191919] uppercase text-sm tracking-wider border-b border-gray-100 pb-2">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                        <input type="password" onChange={e => setPasswords({ ...passwords, new: e.target.value })} className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-[#B70003] outline-none font-bold" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm Password</label>
                        <input type="password" onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-[#B70003] outline-none font-bold" />
                    </div>
                </div>
                <button onClick={handleChangePassword} className="px-6 py-3 bg-[#191919] text-white font-bold rounded-xl shadow-lg mt-4">Update Password</button>
            </div>
        </motion.div>
    );
};

const AppearanceSettings = ({ user, setUser }: any) => {
    const colors = ['#B70003', '#2563EB', '#16A34A', '#D97706', '#9333EA', '#000000'];

    const { setThemeColor } = useTheme();

    const changeTheme = async (color: string) => {
        const newUser = { ...user, themeColor: color };
        setUser(newUser); // Optimistic UI
        setThemeColor(color); // Update Global Context
        localStorage.setItem('user', JSON.stringify(newUser));
        await fetch('/api/user/settings', { method: 'PUT', body: JSON.stringify({ username: user.username, themeColor: color }) });
        toast.success("Theme Updated!");
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="text-xl font-bold text-[#191919]">Accent Color</h3>
            <div className="flex gap-4">
                {colors.map(c => (
                    <button key={c} onClick={() => changeTheme(c)}
                        className={`w-12 h-12 rounded-full shadow-lg border-4 transition-transform hover:scale-110 ${user.themeColor === c ? 'border-gray-300 scale-110' : 'border-white'}`}
                        style={{ backgroundColor: c }}
                    />
                ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">Select a color to customize your dashboard theme.</p>
        </motion.div>
    );
}

const NotificationSettings = () => {
    const [notifs, setNotifs] = useState<{ unpaid: any[], performance: any[] }>({ unpaid: [], performance: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/notifications').then(res => res.json()).then(data => {
            if (data.success) setNotifs(data.notifications);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading notifications...</div>;

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">

            {/* Unpaid Fees */}
            <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-red-600 mb-4 uppercase tracking-wider">
                    <AlertTriangle size={20} /> Unpaid Fees Alert
                </h3>
                <div className="bg-red-50 rounded-2xl p-4 border border-red-100 space-y-3">
                    {notifs.unpaid.length === 0 ? <p className="text-gray-500 p-2">No pending fees.</p> :
                        notifs.unpaid.map((s: any) => (
                            <div key={s._id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                                <span className="font-bold text-[#191919]">{s.firstName} {s.lastName} ({s.classJoining}-{s.section})</span>
                                <span className="font-bold text-red-600 bg-red-100 px-3 py-1 rounded-lg">Rs. {s.remainingAmount}</span>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* High Performance */}
            <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-green-600 mb-4 uppercase tracking-wider">
                    <TrendingUp size={20} /> Top Performers (Today)
                </h3>
                <div className="bg-green-50 rounded-2xl p-4 border border-green-100 space-y-3">
                    {notifs.performance.length === 0 ? <p className="text-gray-500 p-2">No data yet.</p> :
                        notifs.performance.map((s: any, i: number) => (
                            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                                <span className="font-bold text-[#191919]">{s.studentName} - {s.subject}</span>
                                <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-lg">{s.marks}</span>
                            </div>
                        ))
                    }
                </div>
            </div>

        </motion.div>
    );
};

// --- SCHOOL SETTINGS SUB-COMPONENT (Simplified) ---
const SchoolSettings = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        <div className="p-6 bg-blue-50 text-blue-800 rounded-xl">School Information is managed by System Administrator only.</div>
    </motion.div>
);

// --- MAIN PAGE COMPONENT ---

export const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadUser = async () => {
            const stored = localStorage.getItem('user');
            if (stored) {
                const u = JSON.parse(stored);
                setUser(u);
                try {
                    const res = await fetch(`/api/user/settings?username=${u.username}`);
                    const data = await res.json();
                    if (data.success) setUser(data.data);
                } catch (e) {
                    console.error("Failed to refresh user", e);
                }
            } else {
                // If no local storage (legacy login or fresh), try fetching default 'admin'
                try {
                    // Try waiting a moment for cookies to be set if redirecting from login
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const res = await fetch(`/api/user/settings?username=admin`);
                    const data = await res.json();
                    if (data.success) {
                        setUser(data.data);
                        localStorage.setItem('user', JSON.stringify(data.data));
                    } else {
                        // Fallback purely client side if API fails to avoid locking UI
                        setUser({
                            username: 'admin',
                            name: 'Admin',
                            role: 'admin',
                            themeColor: '#B70003',
                            profileImage: ''
                        });
                    }
                } catch (e) {
                    setUser({
                        username: 'admin',
                        name: 'Admin',
                        role: 'admin',
                        themeColor: '#B70003',
                        profileImage: ''
                    });
                }
            }
        };
        loadUser();
    }, []);

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: User, desc: 'Manage your personal details' },
        { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Fees & Performance Alerts' },
        { id: 'security', label: 'Security', icon: Shield, desc: 'Password & protections' },
        { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Theme & customization' },
    ];

    if (!user) return (
        <div className="p-10 max-w-[1600px] mx-auto flex gap-8 animate-pulse">
            <div className="w-80 h-[600px] bg-gray-200 rounded-3xl"></div>
            <div className="flex-1 h-[600px] bg-gray-200 rounded-3xl"></div>
        </div>
    );

    return (
        <div className="w-full max-w-[1600px] mx-auto">
            <Toaster position="bottom-right" richColors />

            <div className="flex flex-col xl:flex-row gap-8">
                {/* --- LEFT SIDEBAR --- */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full xl:w-80 flex-shrink-0">
                    <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 overflow-hidden sticky top-8">
                        <div className="p-6 bg-gradient-to-br from-[#B70003] to-[#800000] text-white" style={{ background: `linear-gradient(to bottom right, ${user.themeColor || '#B70003'}, #000)` }}>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Settings</h2>
                            <p className="text-white/80 text-xs font-medium mt-1">Manage preferences</p>
                        </div>
                        <div className="p-3 bg-gray-50/50">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 mb-1 group ${activeTab === tab.id ? 'bg-white shadow-lg' : 'hover:bg-white text-gray-500'}`}
                                    style={{ color: activeTab === tab.id ? user.themeColor || '#B70003' : '' }}
                                >
                                    <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-gray-100' : 'bg-gray-100'}`}><tab.icon size={20} /></div>
                                    <div className="text-left"><p className="font-bold text-sm">{tab.label}</p></div>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* --- RIGHT CONTENT --- */}
                <div className="flex-1 min-w-0">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] shadow-2xl border border-gray-100 min-h-[600px] p-8 md:p-10">
                        <h2 className="text-3xl font-black text-[#191919] mb-8 border-b border-gray-100 pb-4">{tabs.find(t => t.id === activeTab)?.label}</h2>

                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && <ProfileSettings key="pro" user={user} setUser={setUser} />}
                            {activeTab === 'security' && <SecuritySettings key="sec" user={user} />}
                            {activeTab === 'appearance' && <AppearanceSettings key="app" user={user} setUser={setUser} />}
                            {activeTab === 'notifications' && <NotificationSettings key="not" />}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
