"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeDollarSign, CheckCircle2, FileText, ShieldCheck, Webhook } from 'lucide-react';

type PayrollResult = {
  response: string;
  data?: {
    periodLabel?: string;
    totalNetPayable?: number;
    payrollRecords?: Array<{
      employeeName: string;
      grossSalary: number;
      netSalary: number;
      verificationHash: string;
    }>;
  };
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PayrollPage() {
  const [result, setResult] = useState<PayrollResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  const runPayroll = async () => {
    setRunning(true);
    setError('');

    try {
      const response = await fetch(`${apiBase}/api/ai/automations/payroll/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Payroll automation failed');
      setResult(payload);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Payroll Automation</h2>
          <p className="text-slate-400">Attendance-linked payroll runs with AI summaries, approvals, Make.com, and blockchain verification</p>
        </div>
        <button onClick={runPayroll} disabled={running} className="aura-button disabled:opacity-50">
          {running ? 'Running...' : 'Run Payroll'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Data Load', icon: FileText },
          { label: 'AI Summary', icon: BadgeDollarSign },
          { label: 'Approval', icon: CheckCircle2 },
          { label: 'Trust Log', icon: ShieldCheck },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass p-6 flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-slate-800/70 text-blue-400">
              <item.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.label}</p>
              <p className="text-sm text-slate-200 font-bold">Automated</p>
            </div>
          </motion.div>
        ))}
      </div>

      {error && (
        <div className="glass p-5 border border-red-500/30 text-sm text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="glass overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-white font-bold">Payroll Run {result.data?.periodLabel}</h4>
              <p className="text-xs text-slate-500 whitespace-pre-line mt-2">{result.response}</p>
            </div>
            <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
              <Webhook size={16} />
              MAKE.COM SYNCED
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-slate-500 font-bold uppercase tracking-widest border-b border-slate-800">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Gross</th>
                  <th className="px-6 py-4">Net Payable</th>
                  <th className="px-6 py-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {(result.data?.payrollRecords || []).map((record) => (
                  <tr key={record.verificationHash}>
                    <td className="px-6 py-4 text-sm font-bold text-slate-200">{record.employeeName}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{record.grossSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-green-400 font-bold">{record.netSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-[10px] text-slate-500 max-w-xs truncate">{record.verificationHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
