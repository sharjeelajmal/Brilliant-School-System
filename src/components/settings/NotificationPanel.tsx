"use client";
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

export const NotificationPanel = () => {
    const [notifications, setNotifications] = useState<{ defaulters: any[], absentees: any[] }>({ defaulters: [], absentees: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/notifications');
                const data = await res.json();
                if (data.success) {
                    setNotifications(data.data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 font-bold animate-pulse">Loading real-time alerts...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[500px] overflow-hidden">
            {/* Fee Defaulters */}
            <div className="flex flex-col h-full bg-red-50/50 rounded-2xl border border-red-100 p-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-[#B50104] flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#B50104] rounded-full animate-pulse" />
                        Fee Defaulters <span className="text-[10px] opacity-60 uppercase font-bold tracking-wider">(Current Month)</span>
                    </h3>
                    <span className="bg-[#B50104] text-white text-xs font-bold px-2 py-1 rounded-lg">{notifications.defaulters.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {notifications.defaulters.length > 0 ? (
                        notifications.defaulters.map((s: any) => (
                            <div key={s.id} className="bg-white p-3 rounded-xl border border-red-100 shadow-sm flex justify-between items-center hover:scale-[1.02] transition-transform">
                                <div>
                                    <p className="text-sm font-bold text-[#191919]">{s.name}</p>
                                    <p className="text-xs text-gray-400 font-semibold">{s.details}</p>
                                </div>
                                <span className="text-xs font-bold text-[#B50104] bg-red-50 px-2 py-1 rounded-lg">Rs {s.amount?.toLocaleString()}</span>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                            <Check size={40} className="text-green-500 mb-2" />
                            <p className="text-gray-400 text-sm font-bold">All Clear!</p>
                            <p className="text-xs text-gray-300">No pending fees for this month</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Absentees */}
            <div className="flex flex-col h-full bg-gray-50/50 rounded-2xl border border-gray-100 p-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-gray-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full" />
                        Absent Today
                    </h3>
                    <span className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-lg">{notifications.absentees.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {notifications.absentees.length > 0 ? (
                        notifications.absentees.map((s: any) => (
                            <div key={s.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:scale-[1.02] transition-transform">
                                <div>
                                    <p className="text-sm font-bold text-[#191919]">{s.name}</p>
                                    <p className="text-xs text-gray-400 font-semibold">{s.details}</p>
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg uppercase">Absent</span>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                            <Check size={40} className="text-green-500 mb-2" />
                            <p className="text-gray-400 text-sm font-bold">100% Attendance</p>
                            <p className="text-xs text-gray-300">Everyone is present today</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
