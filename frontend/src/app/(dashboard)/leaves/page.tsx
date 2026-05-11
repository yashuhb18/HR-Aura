"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BrainCircuit,
  ShieldCheck,
  History
} from 'lucide-react';

const leaveRequests = [
  { id: 1, name: 'Alex Rivera', hash: '7ec340', type: 'Annual Leave', dates: 'May 12 - May 14', status: 'Pending', aiAdvice: 'Low impact on Design sprint. Recommended: Approve.' },
  { id: 2, name: 'Sarah Chen', hash: '803664', type: 'Sick Leave', dates: 'May 10 - May 11', status: 'Approved', aiAdvice: 'Medical certificate uploaded and verified.' },
  { id: 3, name: 'Marcus Wright', hash: '89cdee', type: 'Casual Leave', dates: 'May 20', status: 'Pending', aiAdvice: 'Operations coverage available. Review required.' },
];

export default function LeavesPage() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Leave Automation</h2>
          <p className="text-slate-400">AI-orchestrated leave management and verification</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-2 glass text-sm font-bold text-slate-300">Leave Policy</button>
           <button className="aura-button">New Request</button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending Approvals', value: '12', icon: Clock, color: 'text-amber-400' },
          { label: 'Staff on Leave Today', value: '8', icon: Calendar, color: 'text-indigo-400' },
          { label: 'AI Auto-Approved (Mo)', value: '45', icon: BrainCircuit, color: 'text-green-400' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-800/50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Requests Table */}
      <div className="glass overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
          <h4 className="font-bold text-white">Active Requests</h4>
          <button className="text-xs font-bold text-indigo-400 flex items-center gap-1">
            <History size={14} />
            VIEW HISTORY
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-500 font-bold uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">AI Insight</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {leaveRequests.map((req, i) => (
                <motion.tr 
                  key={req.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="hover:bg-slate-800/20 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-200">{req.name}</div>
                    <div className="text-[10px] text-slate-500">Hash: 0x{req.hash}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{req.type}</td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-medium">{req.dates}</td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="flex gap-2 items-start p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                      <BrainCircuit size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                      <p className="text-[10px] text-slate-400 leading-tight">{req.aiAdvice}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                      req.status === 'Approved' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all">
                        <CheckCircle2 size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all">
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
