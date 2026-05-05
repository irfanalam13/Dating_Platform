'use client';
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export function AccountDeactivationPage() {
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeactivate = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsDeactivated(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Mobile Phone Frame */}
        {/* <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-900"> */}
          
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
            <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors active:scale-95">
              <ChevronLeft className="w-6 h-6 text-slate-900" strokeWidth={2.5} />
            </button>
            <h1 className="text-lg font-bold text-slate-900 flex-1">Account Deactivation</h1>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="overflow-y-auto bg-white" style={{ maxHeight: 'calc(667px - 100px)' }}>
            <div className="px-6 py-8">
              
              {!isDeactivated ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Profile Image */}
                  <div className="flex justify-center mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-blue-100">
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
                      Deactivate Account?
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Your account will be hidden from everyone on the platform. You can reactivate anytime.
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-blue-800">ℹ️ What happens?</p>
                    <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                      <li>Your profile becomes invisible</li>
                      <li>Matches can't message you</li>
                      <li>You won't appear in searches</li>
                    </ul>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={handleDeactivate}
                      disabled={isLoading}
                      className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:opacity-70 text-white font-bold py-3 rounded-full transition-all duration-200 shadow-lg text-sm"
                    >
                      {isLoading ? 'Deactivating...' : 'Deactivate my account'}
                    </button>
                    <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-full transition-colors text-sm">
                      Cancel deactivation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-fadeIn text-center py-12">
                  <div className="text-6xl mb-4">🌙</div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Account Deactivated
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Your profile is now hidden. You can reactivate anytime by logging back in.
                  </p>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full mt-6 transition-colors text-sm">
                    Return to login
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* HOME INDICATOR */}
          {/* <div className="bg-slate-900 h-6 rounded-t-3xl"></div> */}
        {/* </div> */}
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

export default AccountDeactivationPage
