"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp, 
  BrainCircuit,
  Activity
} from 'lucide-react';

const stats = [
  { label: 'Total Employees', value: '1,284', change: '+12%', icon: Users, color: 'text-blue-400' },
  { label: 'Active Leaves', value: '24', change: '-5%', icon: Calendar, color: 'text-purple-400' },
  { label: 'Avg Attendance', value: '96.2%', change: '+2.4%', icon: Clock, color: 'text-green-400' },
  { label: 'Productivity', value: '88.4%', change: '+4.1%', icon: TrendingUp, color: 'text-indigo-400' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Systems Overview</h2>
          <p className="text-slate-400 font-medium flex items-center gap-2">
            <BrainCircuit size={18} className="text-indigo-400" />
            AI suggests reviewing <span className="text-indigo-300">Engineering Dept</span> attendance trends.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="aura-button">Generate Report</button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-slate-800/50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                stat.change.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 glass p-8 min-h-[400px] flex flex-col justify-center items-center text-slate-500 border-dashed border-2 border-slate-800">
          <Activity size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-medium">Workforce Productivity Analytics</p>
          <p className="text-sm">Real-time data visualization loading...</p>
          {/* Note: I'll add real charts using a library later or simulate with SVG */}
        </div>

        {/* AI Insight Feed */}
        <div className="glass p-6 space-y-6">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <BrainCircuit size={20} className="text-indigo-400" />
            AI Insights
          </h4>
          <div className="space-y-4">
            {[
              { title: 'Burnout Alert', desc: '3 employees in Design show patterns of high burnout risk.', type: 'warning' },
              { title: 'Optimization Found', desc: 'Automating the leave workflow could save 12 hrs/week.', type: 'info' },
              { title: 'Policy Check', desc: 'Upcoming holiday on Friday. 40% staff have applied for leave.', type: 'success' },
            ].map((insight, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all cursor-pointer">
                <p className="text-sm font-bold text-slate-200 mb-1">{insight.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{insight.desc}</p>
              </div>
            ))}
          </div>
          <button className="w-full py-3 rounded-xl border border-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500/5 transition-all">
            VIEW ALL INSIGHTS
          </button>
        </div>
      </div>
    </div>
  );
}
