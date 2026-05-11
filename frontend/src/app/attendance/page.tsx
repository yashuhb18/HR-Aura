"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Activity, 
  Flame, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';

const insightCards = [
  { title: 'Avg Productivity', value: '92%', change: '+4%', icon: BarChart3, color: 'text-blue-400' },
  { title: 'Team Sync Rate', value: '98%', change: '+1%', icon: CheckCircle2, color: 'text-green-400' },
  { title: 'Burnout Alert', value: 'High', change: '+12%', icon: Flame, color: 'text-orange-400' },
  { title: 'Late Arrivals', value: '2.4%', change: '-1%', icon: TrendingDown, color: 'text-purple-400' },
];

export default function AttendancePage() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white">Attendance Insights</h2>
        <p className="text-slate-400">AI-driven productivity and workforce wellness monitoring</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insightCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div className={`p-3 rounded-xl bg-slate-800/50 ${card.color}`}>
                <card.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-400">
                <ArrowUpRight size={12} />
                {card.change}
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">{card.title}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Burnout Detection */}
        <div className="glass p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame size={20} className="text-orange-500" />
              Burnout Risk Analysis
            </h4>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">LIVE UPDATE</span>
          </div>

          <div className="space-y-6">
            {[
              { team: 'Design Team', risk: 78, status: 'Critical' },
              { team: 'Engineering', risk: 42, status: 'Moderate' },
              { team: 'Marketing', risk: 15, status: 'Low' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">{item.team}</span>
                  <span className={`font-bold ${item.risk > 70 ? 'text-orange-400' : 'text-slate-400'}`}>
                    {item.risk}% Risk
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.risk}%` }}
                    className={`h-full ${item.risk > 70 ? 'bg-gradient-to-r from-orange-600 to-red-600' : 'bg-indigo-500'}`} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl flex gap-4">
            <AlertTriangle className="text-orange-500 shrink-0" size={20} />
            <p className="text-xs text-orange-200/80 leading-relaxed">
              AI DETECTED: Design team has averaged 10+ hour shifts for the last 14 days. 
              High probability of burnout within 7 days. Recommendation: Schedule mandatory downtime.
            </p>
          </div>
        </div>

        {/* Attendance Activity */}
        <div className="glass p-8 flex flex-col">
          <h4 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Activity size={20} className="text-green-500" />
            Real-time Activity
          </h4>
          <div className="flex-1 space-y-6">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                <div className="flex-1">
                  <p className="text-sm text-slate-200 font-medium">
                    {['Alex Rivera', 'Sarah Chen', 'Marcus Wright', 'Elena Petrova'][i]} checked in
                  </p>
                  <p className="text-[10px] text-slate-500">Today at 09:1{i} AM • Verified Hash: 0x{Math.random().toString(16).slice(2, 10)}...</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 rounded-xl border border-slate-700 text-slate-400 text-xs font-bold hover:bg-slate-800 transition-all">
            EXPORT ATTENDANCE LOGS
          </button>
        </div>
      </div>
    </div>
  );
}
