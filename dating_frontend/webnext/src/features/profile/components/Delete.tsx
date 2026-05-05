'use client';

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function AccountDeletionPage() {
  const [step, setStep] = useState<'confirm' | 'warning' | 'deleted'>('confirm');
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep('warning');
  };

  const handleFinalDelete = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep('deleted');
  };

  return (
    <div className=
    "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Mobile Phone Frame */}
        <div className="">
          
          {/* STATUS BAR */}
          {/* <div className="bg-slate-900 text-white px-6 py-2 flex justify-between items-center text-xs font-semibold">
            <span>9:41</span>
            <div className="flex gap-1">
              <span>📶</span>
              <span>📡</span>
              <span>🔋</span>
            </div>
          </div> */}

          {/* HEADER */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors active:scale-95">
              <ChevronLeft className="w-6 h-6 text-slate-900" strokeWidth={2.5} />
            </button>
            <h1 className="text-lg font-bold text-slate-900 flex-1">Account Deletion</h1>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="overflow-y-auto bg-white" style={{ maxHeight: 'calc(667px - 100px)' }}>
            <div className="px-6 py-8">
              
              {step === 'confirm' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Profile Image */}
                  <div className="flex justify-center mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-slate-100">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      Are you sure you want to permanently delete your account?
                    </h2>
                  </div>

                  {/* Warning Box */}
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-red-700">⚠️ Warning</p>
                    <p className="text-xs text-red-600 leading-relaxed">
                      This action cannot be undone. All your data will be permanently deleted.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="w-full bg-red-500 hover:bg-red-600 active:scale-95 disabled:opacity-70 text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg text-sm"
                    >
                      {isLoading ? 'Deleting...' : 'Yes, delete my account'}
                    </button>
                    <button 
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-full transition-colors text-sm">
                      No, cancel the deletion
                    </button>
                  </div>
                </div>
              )}

              {step === 'warning' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-slate-100">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      Final confirmation
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Your account and all data will be permanently deleted in 30 days. You can cancel within this period.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3">
                    <p className="text-xs text-yellow-800">
                      📧 Check your email for confirmation details.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <button
                      onClick={handleFinalDelete}
                      disabled={isLoading}
                      className="w-full bg-red-500 hover:bg-red-600 active:scale-95 disabled:opacity-70 text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg text-sm"
                    >
                      {isLoading ? 'Confirming...' : 'Confirm deletion'}
                    </button>
                    <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-full transition-colors text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {step === 'deleted' && (
                <div className="space-y-6 animate-fadeIn text-center py-12">
                  <div className="text-6xl mb-4">✓</div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Deletion Initiated
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Your account will be permanently deleted in 30 days. Check your email for more details.
                  </p>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full mt-6 transition-colors text-sm">
                    Back to login
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* HOME INDICATOR */}
          {/* <div className="bg-slate-900 h-6 rounded-t-3xl"></div> */}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}