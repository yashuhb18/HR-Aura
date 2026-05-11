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
  MessageSquareCode,
  LogOut,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: Sparkles, label: 'Aura AI', href: '/' },
  { icon: MessageSquareCode, label: 'Copilot', href: '/copilot' },
  { icon: Users, label: 'Workforce', href: '/employees' },
  { icon: Zap, label: 'Automations', href: '/onboarding' },
  { icon: Clock, label: 'Insights', href: '/attendance' },
  { icon: CalendarCheck, label: 'Leave Flow', href: '/leaves' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-60 bg-black border-r border-white/5 p-8 flex flex-col z-50">
      <div className="mb-16">
        <div className="w-12 h-12 bg-blue-600 rounded-none flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20">
          <Sparkles className="text-white" size={24} />
        </div>
        <div className="space-y-1">
          <h1 className="text-[11px] font-black tracking-[0.4em] text-white uppercase">
            Aura AI
          </h1>
          <p className="text-[8px] font-bold tracking-[0.2em] text-blue-500/60 uppercase">
            Gen AI Workforce Platform
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={`
                relative flex items-center gap-4 transition-all group cursor-pointer h-8
                ${isActive ? 'text-blue-500' : 'text-zinc-600 hover:text-white'}
              `}>
                <item.icon size={16} strokeWidth={isActive ? 2.5 : 1.5} className="flex-shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] leading-none">
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="sidebarActiveIndicator"
                    className="absolute -left-8 w-1 h-6 bg-blue-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-white/5">
        <div className="mb-10">
          <p className="text-[8px] text-blue-500 font-black uppercase tracking-[0.3em] mb-3">Neural Status</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" />
            <span className="text-[8px] text-white/50 font-bold tracking-[0.2em] uppercase">Gen AI Core Active</span>
          </div>
        </div>

        <button className="flex items-center gap-4 text-zinc-600 hover:text-white transition-all group">
          <LogOut size={16} strokeWidth={1.5} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
