"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CalendarCheck, 
  Zap, 
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalEmployees: number;
  activeLeaves: number;
  avgAttendance: string;
  avgProductivity: string;
  aiInsight: string;
  departments: Array<{ name: string; count: number }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analytics`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header & Autonomous Status */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Neural Console</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time workforce intelligence and autonomous orchestration.</p>
        </div>
        
        <div className="bg-blue-600/10 border border-blue-600/20 px-6 py-4 flex items-center gap-4">
           <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
           <div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">Autonomous Mode Active</p>
              <p className="text-[12px] font-bold text-white mt-1">HR Pilot: 100% Automated</p>
           </div>
        </div>
      </header>

      {/* AI Insight Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-r from-blue-600/20 to-transparent border-l-4 border-blue-600 glass"
      >
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="text-blue-500" size={18} />
          <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Neural Summary</span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed italic">
          "{stats?.aiInsight || 'Analyzing workforce metadata for strategic optimizations...'}"
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Workforce', value: stats?.totalEmployees, icon: Users, color: 'text-blue-500' },
          { label: 'Neural Productivity', value: stats?.avgProductivity, icon: Zap, color: 'text-amber-500' },
          { label: 'Active Absences', value: stats?.activeLeaves, icon: CalendarCheck, color: 'text-emerald-500' },
          { label: 'System Uptime', value: '100%', icon: Clock, color: 'text-indigo-500' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 group hover:border-blue-600/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 bg-slate-900 rounded-lg ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <TrendingUp className="text-slate-700" size={16} />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-8">
           <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8">Department Distribution</h3>
           <div className="space-y-6">
              {stats?.departments.map((dept) => (
                <div key={dept.name}>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span className="text-slate-400">{dept.name}</span>
                    <span className="text-white">{dept.count} Members</span>
                  </div>
                  <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600" 
                      style={{ width: `${(dept.count / (stats?.totalEmployees || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="glass p-8 flex flex-col justify-between">
           <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                 <AlertCircle size={14} className="text-blue-500" />
                 Auto-Pilot Log
              </h3>
              <div className="space-y-4">
                 {[
                   { t: '12:45', m: 'Payroll auto-processed for Engineering' },
                   { t: '11:20', m: '3 Leave requests auto-validated' },
                   { t: '09:00', m: 'Workforce burnout scan complete' }
                 ].map((log, i) => (
                   <div key={i} className="flex gap-4 items-start">
                      <span className="text-[10px] text-slate-600 font-mono mt-0.5">{log.t}</span>
                      <p className="text-[11px] text-slate-400 font-medium">{log.m}</p>
                   </div>
                 ))}
              </div>
           </div>
           <button className="w-full mt-8 py-3 bg-slate-900 text-[10px] font-black text-white uppercase tracking-widest hover:bg-blue-600 transition-all">
              View All Automations
           </button>
        </div>
      </div>
    </div>
  );
}
