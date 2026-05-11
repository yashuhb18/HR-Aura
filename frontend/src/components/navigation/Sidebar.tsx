"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck,
  BadgeDollarSign,
  Rocket,
  ShieldCheck,
  MessageSquareCode,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Core', href: '/' },
  { icon: MessageSquareCode, label: 'Copilot', href: '/copilot' },
  { icon: Users, label: 'Workforce', href: '/employees' },
  { icon: Clock, label: 'Flow', href: '/attendance' },
  { icon: CalendarCheck, label: 'Leaves', href: '/leaves' },
  { icon: BadgeDollarSign, label: 'Payroll', href: '/payroll' },
  { icon: Rocket, label: 'Scale', href: '/onboarding' },
  { icon: ShieldCheck, label: 'Trust', href: '/blockchain' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-black border-r border-white/5 p-8 flex flex-col z-50">
      {/* Branding Section */}
      <div className="mb-16">
        <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center mb-6">
          <span className="text-black font-black text-[10px] uppercase tracking-tighter leading-none text-center">HR<br/>Aura</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-[9px] font-black tracking-[0.4em] text-white/40 uppercase">
            Aura Engine
          </h1>
          <p className="text-[8px] font-bold tracking-[0.2em] text-white/20 uppercase">
            Workforce OS v1.0
          </p>
        </div>
      </div>

      {/* Navigation Section */}
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

      {/* Footer Section */}
      <div className="pt-8 border-t border-white/5">
        <div className="mb-10">
          <p className="text-[8px] text-blue-500 font-black uppercase tracking-[0.3em] mb-3">Neural Core</p>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[8px] text-white/30 font-bold tracking-[0.2em] uppercase">Status: Synced</span>
          </div>
        </div>

        <button className="flex items-center gap-4 text-zinc-600 hover:text-white transition-all group">
          <LogOut size={16} strokeWidth={1.5} className="group-hover:text-red-500 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminate</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
