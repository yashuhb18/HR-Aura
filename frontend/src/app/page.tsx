'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Minimal Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-10 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-10 h-10 bg-white rounded-none flex items-center justify-center">
            <span className="text-black font-black text-[9px] uppercase tracking-tighter leading-none text-center">HR<br/>Aura</span>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] pointer-events-auto">
          + Talk to us
        </button>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-12 text-left">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="hero-title">
            The <span className="italic text-blue-600">Aura</span> Engine
          </h1>
          
          <div className="mt-12 max-w-2xl">
            <h2 className="text-4xl md:text-5xl text-white font-medium tracking-tight leading-[1.1]">
              Your operating system for <br/>
              <span className="italic font-light opacity-90">intelligent growth</span>
            </h2>
            
            <p className="mt-8 text-slate-500 text-[13px] leading-relaxed max-w-lg font-medium">
              Workforce management is becoming fragmented, complexity is rising, and employees are disengaging. 
              Turn your HR operations into a synchronized engine of productivity, wellness, and growth. 
              We build the neural core of your organization.
            </p>

            <Link href="/copilot">
              <button className="primary-button mt-12 group">
                <div className="bg-blue-800 p-1.5 transition-transform group-hover:rotate-45">
                  <ArrowRight size={14} className="transform -rotate-45" />
                </div>
                Discover how the system works
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Industrial Orbital Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/2 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] border border-white/[0.08] rounded-[100%] rotate-[12deg]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] border border-white/[0.05] rounded-[100%] rotate-[12deg]">
           <div className="absolute right-24 top-24 flex items-center gap-2">
             <div className="w-1 h-1 bg-white/40 rounded-full"></div>
             <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">AI Insights</span>
           </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[550px] border border-white/[0.03] rounded-[100%] rotate-[12deg]">
          <div className="absolute bottom-24 left-48 flex items-center gap-2">
             <div className="w-1 h-1 bg-white/40 rounded-full"></div>
             <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Blockchain Trust</span>
           </div>
        </div>

        {/* Center Star */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
           <Star className="text-white fill-white w-6 h-6" />
        </div>
      </div>
      
      {/* Decorative Marks */}
      <div className="absolute top-[15%] right-[10%] text-white/10 font-thin text-3xl">+</div>
      <div className="absolute bottom-[15%] left-[10%] text-white/10 font-thin text-3xl">+</div>
      <div className="absolute top-[65%] left-[3%] text-white/5 font-thin text-xl">+</div>
    </main>
  );
}
