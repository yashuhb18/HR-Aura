"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  Mail,
  Building2,
  ExternalLink
} from 'lucide-react';

const employees = [
  { id: 'HRA-1024', name: 'Alex Rivera', role: 'Sr. Product Designer', dept: 'Design', status: 'Active', verified: true, score: 94 },
  { id: 'HRA-2048', name: 'Sarah Chen', role: 'Full Stack Engineer', dept: 'Engineering', status: 'Active', verified: true, score: 88 },
  { id: 'HRA-3096', name: 'Marcus Wright', role: 'HR Specialist', dept: 'Operations', status: 'Onboarding', verified: false, score: 0 },
  { id: 'HRA-4120', name: 'Elena Petrova', role: 'Marketing Lead', dept: 'Growth', status: 'Active', verified: true, score: 92 },
  { id: 'HRA-5500', name: 'James Wilson', role: 'Security Architect', dept: 'Security', status: 'Active', verified: true, score: 91 },
  { id: 'HRA-6721', name: 'Sofia Garcia', role: 'Frontend Developer', dept: 'Engineering', status: 'Active', verified: true, score: 86 },
];

export default function EmployeesPage() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Workforce Directory</h2>
          <p className="text-slate-400">Manage and verify your enterprise talent</p>
        </div>
        <button className="aura-button">Add New Employee</button>
      </header>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, ID or department..." 
            className="w-full aura-input pl-12"
          />
        </div>
        <button className="px-4 py-2 glass flex items-center gap-2 text-slate-400 hover:text-white transition-all">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees.map((emp, i) => (
          <motion.div
            key={emp.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card group"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex gap-2">
                  {emp.verified && (
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20" title="Blockchain Verified">
                      <ShieldCheck size={18} />
                    </div>
                  )}
                  <button className="p-2 rounded-lg hover:bg-slate-800 transition-all text-slate-500">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{emp.name}</h3>
                <p className="text-slate-400 text-sm font-medium">{emp.role}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/50">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Department</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <Building2 size={12} className="text-indigo-400" />
                    {emp.dept}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Perf. Score</p>
                  <p className="text-xs text-slate-300 font-bold">{emp.score > 0 ? `${emp.score}%` : 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-800/50 flex justify-between items-center rounded-b-2xl">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                emp.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {emp.status.toUpperCase()}
              </span>
              <button className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1">
                View Profile <ExternalLink size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
