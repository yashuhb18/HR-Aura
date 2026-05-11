"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Sparkles, 
  ShieldCheck
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: string;
  suggestedSteps?: string[];
  workflow?: {
    status: string;
    steps?: Array<{ name: string; status: string }>;
  };
  verificationHash?: string;
}

const suggestions = [
  "Apply leave for tomorrow",
  "Run payroll for this month",
  "Create onboarding workflow",
  "Generate payroll approval summary"
];

export default function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am Aura, your HR Copilot. How can I assist you with workforce operations today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/ai/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: text })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Automation request failed');

      const aiResponse: Message = {
        role: 'assistant',
        content: result.response,
        type: result.type,
        suggestedSteps: result.suggestedSteps,
        workflow: result.workflow,
        verificationHash: result.data?.verificationHash
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Automation engine unavailable: ${(error as Error).message}`,
        suggestedSteps: ['Retry automation', 'Check backend status']
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
          <Bot className="text-white" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI HR Copilot</h2>
          <p className="text-slate-400 text-sm">Powered by Aura Neural Engine v2.0</p>
        </div>
      </header>

      <div className="flex-1 glass overflow-hidden flex flex-col relative">
        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-600'
                  }`}>
                    {msg.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                  </div>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-800/80 text-slate-200'
                    }`}>
                      {msg.content}
                    </div>

                    {msg.workflow && (
                      <div className="p-4 bg-slate-900/50 border border-indigo-500/30 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{msg.type} workflow</span>
                          <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                            <ShieldCheck size={10} />
                            {msg.verificationHash ? 'BLOCKCHAIN VERIFIED' : msg.workflow.status.toUpperCase()}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {(msg.workflow.steps || []).slice(0, 6).map((step, index) => (
                            <div key={step.name} className="flex items-center gap-3 text-xs text-slate-300">
                              <span className={`h-2 w-2 rounded-full ${step.status === 'completed' ? 'bg-green-400' : 'bg-slate-600'}`} />
                              <span>{index + 1}. {step.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500"
                            style={{
                              width: `${Math.max(10, Math.round(((msg.workflow.steps || []).filter(step => step.status === 'completed').length / Math.max(1, (msg.workflow.steps || []).length)) * 100))}%`
                            }}
                          />
                        </div>
                        {msg.verificationHash && (
                          <p className="text-[10px] text-slate-500 truncate">Verification hash: {msg.verificationHash}</p>
                        )}
                      </div>
                    )}

                    {msg.suggestedSteps && (
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestedSteps.map((step, si) => (
                          <button 
                            key={si}
                            onClick={() => handleSend(step)}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                          >
                            {step}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 flex gap-1 items-center">
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-100" />
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-6 bg-slate-900/50 border-t border-slate-800">
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                onClick={() => handleSend(s)}
                className="text-[10px] font-bold text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 hover:bg-indigo-500/10 transition-all flex items-center gap-1"
              >
                <Sparkles size={10} />
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Aura anything..."
              className="w-full aura-input pr-12 py-4"
            />
            <button 
              onClick={() => handleSend()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
