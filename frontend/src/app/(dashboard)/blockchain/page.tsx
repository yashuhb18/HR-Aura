"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Terminal, Database } from 'lucide-react';

const logs = [
  { id: 'tx_01', action: 'Employee Verified', entity: 'Alex Rivera', hash: '8f3e...2a1b', status: 'immutable' },
  { id: 'tx_02', action: 'Leave Approved', entity: 'Sarah Chen', hash: '4d1c...9z0p', status: 'immutable' },
  { id: 'tx_03', action: 'Check-in Recorded', entity: 'Marcus Wright', hash: '1a2b...3c4d', status: 'immutable' },
  { id: 'tx_04', action: 'Task Completed', entity: 'Elena Petrova', hash: '7e8f...5g6h', status: 'immutable' },
];

export default function BlockchainPage() {
  return (
    <div className="space-y-20 py-10">
      <header className="max-w-3xl">
        <h2 className="text-6xl md:text-7xl font-bold tracking-tighter text-white font-display leading-none mb-8">
          The <span className="italic text-blue-600">Trust</span> Ledger
        </h2>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
          Every workforce transaction is cryptographically secured. Our blockchain layer ensures 
          absolute data integrity and an immutable audit trail for all HR operations.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
        <div className="bg-black p-10">
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.3em] mb-4">Total Blocks</p>
          <p className="text-4xl text-white font-bold tracking-tighter">1,284,092</p>
        </div>
        <div className="bg-black p-10">
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.3em] mb-4">Integrity Score</p>
          <p className="text-4xl text-white font-bold tracking-tighter">100.0%</p>
        </div>
        <div className="bg-black p-10">
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.3em] mb-4">Validator Nodes</p>
          <p className="text-4xl text-white font-bold tracking-tighter">12 Active</p>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-white/5 pb-4">
          <h3 className="text-[11px] text-white font-black uppercase tracking-[0.4em]">Live Trust Stream</h3>
          <div className="flex items-center gap-2 text-zinc-600">
            <Terminal size={14} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Watching Network...</span>
          </div>
        </div>

        <div className="overflow-hidden border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50">
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Action</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Entity</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Verification Hash</th>
                <th className="p-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={log.id} 
                  className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-6 text-[10px] font-bold text-white uppercase tracking-wider">{log.action}</td>
                  <td className="p-6 text-[10px] text-zinc-400 font-medium">{log.entity}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-blue-500">
                      <Database size={12} />
                      {log.hash}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-[9px] font-black uppercase tracking-widest text-green-500 flex items-center gap-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full" />
                      {log.status}
                    </span>
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
