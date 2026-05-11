"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  CheckCircle2, 
  Circle, 
  BrainCircuit,
  UserPlus,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const onboardingEmployees = [
  { name: 'Marcus Wright', role: 'HR Specialist', progress: 65, daysLeft: 3, tasks: 8 },
  { name: 'Jordan Lee', role: 'Data Analyst', progress: 20, daysLeft: 12, tasks: 15 },
];

export default function OnboardingPage() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Onboarding Workflows</h2>
          <p className="text-slate-400">AI-powered employee integration and task automation</p>
        </div>
        <button className="aura-button flex items-center gap-2">
          <UserPlus size={18} />
          Initiate New Onboarding
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Onboarding List */}
        <div className="xl:col-span-1 space-y-6">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">IN PROGRESS</h4>
          {onboardingEmployees.map((emp, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="glass p-6 cursor-pointer border-l-4 border-indigo-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h5 className="font-bold text-white">{emp.name}</h5>
                  <p className="text-xs text-slate-400">{emp.role}</p>
                </div>
                <span className="text-[10px] font-bold text-indigo-400">{emp.progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${emp.progress}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>{emp.tasks} TASKS REMAINING</span>
                <span>{emp.daysLeft} DAYS LEFT</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Workflow Detail */}
        <div className="xl:col-span-2 glass p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                <Rocket size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Marcus Wright - Onboarding</h4>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  Workflow ID: <span className="text-slate-200">OB-7721</span> • 
                  <span className="flex items-center gap-1 text-green-400 text-xs font-bold">
                    <ShieldCheck size={12} /> VERIFIED
                  </span>
                </p>
              </div>
            </div>
            <button className="text-indigo-400 text-xs font-bold flex items-center gap-1">
              EDIT WORKFLOW <ArrowRight size={14} />
            </button>
          </div>

          <div className="p-4 bg-indigo-600/5 border border-indigo-500/20 rounded-2xl flex gap-4">
            <BrainCircuit className="text-indigo-400 shrink-0" size={24} />
            <div>
              <p className="text-sm font-bold text-indigo-300 mb-1">AI Recommendation</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Marcus has completed all IT setup tasks ahead of schedule. 
                I've added 2 additional "Advanced Operations" tasks to his checklist based on his background in HR Analytics.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-sm font-bold text-white">Current Task Checklist</h5>
            <div className="space-y-4">
              {[
                { task: 'Account Configuration & IT Setup', status: 'completed' },
                { task: 'Security Compliance Training', status: 'completed' },
                { task: 'Benefits Enrollment Review', status: 'completed' },
                { task: 'Team Introduction & 1-on-1s', status: 'pending' },
                { task: 'HR Software Systems Training', status: 'pending' },
                { task: 'Departmental Roadmap Review', status: 'pending' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  {t.status === 'completed' ? (
                    <CheckCircle2 className="text-green-500" size={20} />
                  ) : (
                    <Circle className="text-slate-600 group-hover:text-indigo-400 transition-colors" size={20} />
                  )}
                  <span className={`text-sm ${t.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                    {t.task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
