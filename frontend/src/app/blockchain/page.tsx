"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ExternalLink, 
  Cpu, 
  Database, 
  Clock,
  Search,
  Activity
} from 'lucide-react';

const logs = [
  { action: 'APPROVE_LEAVE', entity: 'LeaveRequest', id: 'LR-992', hash: '0x7d2a8b3c4f9e1d0a5b6c', time: '2 mins ago' },
  { action: 'CREATE_EMPLOYEE', entity: 'Employee', id: 'HRA-6721', hash: '0x1b4c9a2d8e3f5b7a0c1d', time: '45 mins ago' },
  { action: 'UPDATE_PRODUCTIVITY', entity: 'Analytics', id: 'PR-440', hash: '0x9e8f7d6c5b4a3210fedc', time: '2 hrs ago' },
  { action: 'COMPLETE_TASK', entity: 'Onboarding', id: 'OB-7721', hash: '0x0a1b2c3d4e5f6g7h8i9j', time: '5 hrs ago' },
  { action: 'INITIATE_WORKFLOW', entity: 'AI_AGENT', id: 'WF-102', hash: '0x11223344556677889900', time: '1 day ago' },
];

export default function BlockchainPage() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="text-green-500" size={32} />
            Verification Explorer
          </h2>
          <p className="text-slate-400">Immutable audit trail of all HR Aura operations</p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-4 py-2 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300 tracking-widest">NETWORK: ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Verifications', value: '14,821', icon: Database },
          { label: 'Avg Block Time', value: '1.2s', icon: Clock },
          { label: 'Network Integrity', value: '99.99%', icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 border-b-2 border-indigo-500/50">
            <div className="flex justify-between items-start mb-2">
              <stat.icon className="text-indigo-400" size={20} />
              <p className="text-[10px] font-bold text-slate-500 uppercase">{stat.label}</p>
            </div>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Explorer Table */}
      <div className="glass p-8">
        <div className="flex justify-between items-center mb-8">
           <h4 className="font-bold text-white flex items-center gap-2">
             <Cpu size={20} className="text-indigo-400" />
             Transaction Stream
           </h4>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
             <input type="text" placeholder="Search hash..." className="aura-input text-xs pl-9 py-2 w-64" />
           </div>
        </div>

        <div className="space-y-4">
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 hover:border-indigo-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-all">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">{log.action}</p>
                  <p className="text-xs text-slate-500">{log.entity} • {log.id}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">TRANSACTION HASH</p>
                <p className="text-xs font-mono text-indigo-400 truncate max-w-xs">{log.hash}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-slate-400">{log.time}</p>
                  <p className="text-[10px] text-green-500 font-bold uppercase">Success</p>
                </div>
                <ExternalLink size={16} className="text-slate-600 group-hover:text-white transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

        <button className="w-full mt-8 py-3 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs font-bold hover:text-slate-300 hover:border-slate-700 transition-all">
          LOAD PREVIOUS TRANSACTIONS
        </button>
      </div>
    </div>
  );
}
