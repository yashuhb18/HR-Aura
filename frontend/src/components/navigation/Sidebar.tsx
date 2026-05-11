"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarCheck, 
  Rocket, 
  ShieldCheck, 
  MessageSquareCode,
  LogOut,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: MessageSquareCode, label: 'AI Copilot', href: '/copilot' },
  { icon: Users, label: 'Employees', href: '/employees' },
  { icon: Clock, label: 'Attendance', href: '/attendance' },
  { icon: CalendarCheck, label: 'Leaves', href: '/leaves' },
  { icon: Rocket, label: 'Onboarding', href: '/onboarding' },
  { icon: ShieldCheck, label: 'Blockchain', href: '/blockchain' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950/50 backdrop-blur-xl border-r border-slate-800 p-4 flex flex-col z-50">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Zap className="text-white fill-white" size={24} />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          HR Aura
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
              `}>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-indigo-600/10 border border-indigo-500/20 rounded-xl"
                  />
                )}
                <item.icon size={20} className={isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'} />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-all rounded-xl hover:bg-red-500/5">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
        <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20">
          <p className="text-xs text-indigo-300 font-semibold mb-1">AI STATUS</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-slate-300">Neural Engine Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
