"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Palette, Save, Camera, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { NotificationPanel } from './NotificationPanel';

export const SettingsPage = () => {
    const { themeColor, setThemeColor } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        name: 'M. Ahsan',
        email: 'admin@school.com',
        role: 'Administrator',
        phone: '+92 300 1234567'
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    const colors = [
        { value: '#B50104', name: 'Crimson Red' },
        { value: '#0ea5e9', name: 'Sky Blue' },
        { value: '#22c55e', name: 'Emerald Green' },
        { value: '#eab308', name: 'Golden Yellow' },
        { value: '#a855f7', name: 'Royal Purple' },
        { value: '#f97316', name: 'Orange' },
        { value: '#191919', name: 'Midnight Black' },
    ];

    const handleSave = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success("Settings saved successfully!");
        }, 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8"
        >
            {/* Header Card */}
            <div className="relative overflow-hidden bg-white/50 backdrop-blur-xl border border-white/60 rounded-[30px] p-8 shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--primary)] to-transparent opacity-5 rounded-bl-[100px]" />

                <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-[24px] border-4 border-white shadow-xl overflow-hidden relative">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user.name}&background=${themeColor.replace('#', '')}&color=fff`}
                                className="w-full h-full object-cover"
                                alt="Profile"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <Camera className="text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-black text-[#191919] tracking-tight mb-1">{user.name}</h1>
                        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">{user.role}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-3 space-y-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden group ${activeTab === tab.id ? 'bg-white shadow-lg shadow-gray-100' : 'hover:bg-white/40'}`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--primary)]"
                                />
                            )}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${activeTab === tab.id ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-white'}`}>
                                <tab.icon size={20} />
                            </div>
                            <span className={`font-bold text-sm ${activeTab === tab.id ? 'text-[#191919]' : 'text-gray-500'}`}>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[30px] shadow-sm min-h-[500px]"
                        >
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-black text-[#191919]">Profile Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField label="Full Name" value={user.name} onChange={(v: string) => setUser({ ...user, name: v })} />
                                        <InputField label="Email Address" value={user.email} onChange={(v: string) => setUser({ ...user, email: v })} />
                                        <InputField label="Phone Number" value={user.phone} onChange={(v: string) => setUser({ ...user, phone: v })} />
                                        <InputField label="Designation" value={user.role} disabled />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'appearance' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-[#191919] mb-2">Theme Preferences</h2>
                                        <p className="text-gray-500 text-sm">Customize the look and feel of your admin dashboard.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Accent Color</label>
                                        <div className="flex flex-wrap gap-4">
                                            {colors.map((color) => (
                                                <button
                                                    key={color.value}
                                                    onClick={() => setThemeColor(color.value)}
                                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 relative ${themeColor === color.value ? 'ring-4 ring-offset-2 ring-gray-200' : ''}`}
                                                    style={{ backgroundColor: color.value }}
                                                    title={color.name}
                                                >
                                                    {themeColor === color.value && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                        >
                                                            <Check className="text-white" size={24} strokeWidth={3} />
                                                        </motion.div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-[#191919]">Dark Mode</h3>
                                            <p className="text-xs text-gray-500 mt-1">Switch between light and dark themes (Coming Soon)</p>
                                        </div>
                                        <div className="h-6 w-11 bg-gray-200 rounded-full cursor-not-allowed relative">
                                            <div className="h-4 w-4 bg-white rounded-full absolute top-1 left-1 shadow-sm" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-black text-[#191919]">Security Settings</h2>
                                    <div className="space-y-4">
                                        <InputField label="Current Password" type="password" placeholder="••••••••" />
                                        <InputField label="New Password" type="password" placeholder="••••••••" />
                                        <InputField label="Confirm Password" type="password" placeholder="••••••••" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <NotificationPanel />
                            )}

                            {/* Save Button */}
                            {activeTab !== 'notifications' && (
                                <div className="mt-10 flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="px-8 h-12 bg-[var(--primary)] text-white rounded-xl font-bold flex items-center gap-2 hover:brightness-90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gray-200 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                        ) : (
                                            <>
                                                <Save size={18} /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

interface InputFieldProps {
    label: string;
    type?: string;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

const InputField = ({ label, type = "text", value, onChange, disabled, placeholder }: InputFieldProps) => (
    <div className="space-y-2">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl font-bold text-[#191919] outline-none focus:border-[var(--primary)] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        />
    </div>
);


