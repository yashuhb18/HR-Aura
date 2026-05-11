"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, CreditCard, FileText, CheckCircle, Sparkles } from 'lucide-react';

export default function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    designation: 'Software Engineer',
    bankAccount: '',
    taxId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call to create/update employee
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          joiningDate: new Date().toISOString(),
          monthlySalary: 5000 // Default for demo
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit onboarding data');
      
      setIsSuccess(true);
    } catch (error) {
      alert('Error submitting data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass p-10 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="text-green-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Onboarding Complete</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your data has been successfully ingested by the Aura AI Neural Engine. 
            Your workspace, payroll, and benefits are now being provisioned autonomously.
          </p>
          <div className="pt-4">
             <div className="flex items-center justify-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <Sparkles size={14} />
                Neural HR Core Active
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full mb-4">
            <Sparkles className="text-blue-500" size={12} />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Onboarding Portal</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Welcome to the Future.</h1>
          <p className="text-slate-500 mt-2">Aura AI will now automate your professional setup.</p>
        </div>

        {/* Form Container */}
        <div className="glass p-8 md:p-12 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900">
            <motion.div 
              className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="space-y-8">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                   <User className="text-blue-500" size={20} />
                   <h3 className="text-lg font-bold text-white uppercase tracking-widest text-xs">Personal Profile</h3>
                </div>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="FULL NAME"
                    className="aura-input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    type="email" 
                    placeholder="OFFICIAL EMAIL"
                    className="aura-input"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                   <Briefcase className="text-blue-500" size={20} />
                   <h3 className="text-lg font-bold text-white uppercase tracking-widest text-xs">Role Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    className="aura-input"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    <option>Engineering</option>
                    <option>Design</option>
                    <option>Growth</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="DESIGNATION"
                    className="aura-input"
                    value={formData.designation}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                   <CreditCard className="text-blue-500" size={20} />
                   <h3 className="text-lg font-bold text-white uppercase tracking-widest text-xs">Financial Metadata</h3>
                </div>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="BANK ACCOUNT NUMBER"
                    className="aura-input"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="TAX IDENTIFICATION ID"
                    className="aura-input"
                    value={formData.taxId}
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                  />
                </div>
              </motion.div>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button 
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !formData.name}
                  className="ml-auto bg-blue-600 px-8 py-3 text-[10px] font-black text-white uppercase tracking-widest hover:bg-blue-500 disabled:opacity-50"
                >
                  Continue
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="ml-auto bg-blue-600 px-8 py-3 text-[10px] font-black text-white uppercase tracking-widest hover:bg-blue-500 flex items-center gap-3"
                >
                  {isSubmitting ? 'Ingesting...' : 'Submit to Neural Core'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
