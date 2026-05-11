'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center px-10">
      {/* AI Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-10 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 bg-blue-600 rounded-none flex items-center justify-center shadow-2xl shadow-blue-500/40">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="text-white font-black text-xs uppercase tracking-[0.3em]">Aura AI</span>
        </div>

        <button className="bg-white text-black px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] pointer-events-auto hover:bg-blue-600 hover:text-white transition-all">
          Request Access
        </button>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto text-left">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-blue-600"></div>
            <span className="text-[10px] text-blue-500 font-black uppercase tracking-[0.4em]">Gen AI Workforce OS</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-bold tracking-[-0.04em] leading-[0.9] text-white font-display">
            The <span className="italic text-blue-600">Neural</span> <br/>
            Engine.
          </h1>
          
          <div className="mt-12 max-w-2xl">
            <h2 className="text-3xl md:text-5xl text-white/90 font-medium tracking-tight leading-[1.1]">
              Automating your entire workforce <br/>
              with <span className="italic font-light text-blue-500">Autonomous Intelligence.</span>
            </h2>
            
            <p className="mt-8 text-slate-500 text-[14px] leading-relaxed max-w-lg font-medium">
              Experience the world's first Gen AI platform that manages onboarding, payroll, 
              performance, and operations through a single conversational neural core. 
              Zero bureaucracy. 100% Intelligence.
            </p>

            <Link href="/copilot">
              <button className="mt-12 group bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-8 rounded-none transition-all flex items-center gap-4 text-[12px] uppercase tracking-widest">
                Enter the neural core
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Neural Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-600/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-blue-600/5 rounded-full"></div>
        
        {/* Floating AI Points */}
        <div className="absolute top-1/4 right-1/4 flex flex-col items-end gap-2">
           <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
           <span className="text-[8px] text-blue-500 font-bold tracking-[0.2em] uppercase">Onboarding.ai</span>
        </div>
        <div className="absolute bottom-1/4 left-1/4 flex flex-col items-start gap-2">
           <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
           <span className="text-[8px] text-blue-500 font-bold tracking-[0.2em] uppercase">Payroll.ai</span>
        </div>
        <div className="absolute top-2/3 right-1/3 flex flex-col items-start gap-2">
           <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
           <span className="text-[8px] text-blue-500 font-bold tracking-[0.2em] uppercase">Analytics.ai</span>
        </div>
      </div>
      
      {/* Decorative Marks */}
      <div className="absolute top-[10%] right-[5%] text-blue-500/10 font-thin text-6xl">+</div>
      <div className="absolute bottom-[10%] left-[5%] text-blue-500/10 font-thin text-6xl">+</div>
    </main>
  );
}
