'use client';

import React, { useState } from 'react';
import { ChevronLeft, Search } from 'lucide-react';

export default function HelpSectionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const helpCategories = [
    { id: 'matches', label: "I can't find girls", icon: '' },
    { id: 'marriage', label: 'I want to marry someone', icon: '' },
    { id: 'college', label: 'I want to quit Sunway College', icon: '' },
    { id: 'features', label: 'Matchmakers app is great', icon: '' },
  ];

  const filteredCategories = helpCategories.filter(cat =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Mobile Phone Frame */}
        {/* <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-900">
           */}
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
            <h1 className="text-lg font-bold text-slate-900 flex-1">Help Section</h1>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="overflow-y-auto bg-white" style={{ maxHeight: 'calc(667px - 100px)' }}>
            <div className="px-6 py-6">
              
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search your query"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-4 pr-12 bg-slate-100 rounded-full border-2 border-transparent focus:border-slate-400 focus:bg-white outline-none transition-all text-sm"/>
                  <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full p-4 rounded-xl transition-all duration-200 text-left font-semibold text-sm ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-slate-100 border-2 border-slate-200 hover:border-blue-300 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span>{category.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Contact Support */}
              <div className="mt-8 p-4   rounded-xl text-center">
                {/* <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-center"></div> */}
                  Couldn't find your query on search?
                
                {/* <button className="text-blue-600 hover:text-blue-700 font-semibold text-xs"> */}
                 <p className="text-xs text-slate-600 mb-3">
                  Reach us: support@matchmakers.com
                </p>
                {/* </button> */}
              </div>
            </div>
          </div>

          {/* HOME INDICATOR */}
          {/* <div className="bg-slate-900 h-6 rounded-t-3xl"></div> */}
        {/* </div> */}
      </div>
    </div>
  );
}