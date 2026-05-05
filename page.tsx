'use client';

import React, { useState } from 'react';
import { ChevronLeft, Search, HelpCircle } from 'lucide-react';

export default function SettingsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchSettings, setSearchSettings] = useState('');

  const settingsSections = [
    {
      id: 'user',
      label: 'User settings',
      icon: '',
      items: ['Profile', 'Email & password', 'Phone number', 'Privacy'],
    },
    {
      id: 'filter',
      label: 'Filter Preferences',
      icon: '',
      items: ['Age range', 'Location', 'Height', 'Religion'],
    },
    {
      id: 'safety',
      label: 'Safety Options',
      icon: '',
      items: ['Block list', 'Report abuse', 'Verification', 'Privacy settings'],
    },
    {
      id: 'blocked',
      label: 'Blocked Contacts',
      icon: '',
      items: ['View blocked users', 'Unblock', 'Manage blocks'],
    },
  ];

  const filteredSections = settingsSections.filter(section =>
    section.label.toLowerCase().includes(searchSettings.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 flex items-center justify-center">
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
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors active:scale-95">
              <ChevronLeft className="w-6 h-6 text-slate-900" strokeWidth={2.5} />
            </button>
            <h1 className="text-lg font-bold text-slate-900 flex-1">Settings</h1>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="overflow-y-auto bg-white" style={{ maxHeight: 'calc(667px - 100px)' }}>
            <div className="px-6 py-6">
              
              {/* Search Settings */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search in settings"
                    value={searchSettings}
                    onChange={(e) => setSearchSettings(e.target.value)}
                    className="w-full px-4 py-3 pl-4 pr-12 bg-slate-100 rounded-full border-2 border-transparent focus:border-slate-400 focus:bg-white outline-none transition-all text-sm"
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Settings Sections */}
              <div className="space-y-3 mb-6">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                    // className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all duration-200 text-left"
                    className="w-full px-4 py-3 pl-4 pr-12 bg-slate-100 rounded-full border-2 border-transparent focus:border-slate-400 focus:bg-white outline-none transition-all text-sm"
                  >
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{section.icon}</span>
                        <span className="font-semibold text-slate-900 text-sm">{section.label}</span>
                      </div>
                      <span className={`transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>

                    {/* Expanded Items */}
                    {expandedSection === section.id && (
                      <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 animate-slideDown">
                        {section.items.map((item, idx) => (
                          <button
                            key={idx}
                            className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs text-slate-700 transition-colors"
                          >
                            → {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Help Section */}
              <button className="w-full px-4 py-3 pl-4 pr-12 bg-slate-100 rounded-full border-2 border-transparent focus:border-slate-400 focus:bg-white outline-none transition-all text-sm">
              {/* "w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 rounded-xl p-4 text-left font-semibold text-slate-900 transition-all mb-6 text-sm"> */}
                <div className="flex items-center gap-3"> 
                  <span className="font-semibold text-slate-900 text-sm"> 
                  {/* <HelpCircle className="w-5 h-5" /> */}
                     Help Section
                  </span>
                </div>
              </button>

              {/* Danger Zone */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-3"></p>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 pl-4 pr-12 bg-slate-100 border-2 border-transparent text-blue-600 hover:bg-blue-100 text-sm rounded-full border-2  text-sm">
                  {/* "w-full p-4 rounded-xl font-semibold transition-all bg-blue-50 border-2 border-blue-300 text-blue-600 hover:bg-blue-100 text-sm"> */}
                    <div className="flex items-center gap-3">
                      <span className="text-lg"></span>  
                      {/* <span className=" font-semibold text-slate-900 bg-blue-50  text-sm"></span>   */}
                      Account Deactivation
                    </div>
                  </button>
                  <button 
                  className="w-full px-4 py-3 pl-4 pr-12 bg-slate-100 border-2 border-transparent text-red-600 hover:bg-red-100 text-sm rounded-full border-2 text-sm">
                  {/* // className="w-full p-4 rounded-xl font-semibold transition-all bg-red-50 border-2 border-red-300 text-red-600 hover:bg-red-100 text-sm"> */}
                    <div className="flex items-center gap-3">
                      <span className="text-lg"></span>
                      Account Deletion
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
                <p>App Version 2.1.0</p>
                <p className="mt-2">© 2024 Matchmakers. All rights reserved.</p>
              </div>
            </div>
          </div>

          {/* HOME INDICATOR */}
          {/* <div className="bg-slate-900 h-6 rounded-t-3xl"></div> */}
        {/* </div> */}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
