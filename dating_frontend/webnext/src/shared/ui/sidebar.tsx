'use client';

import React from 'react';
import { 
  Home, 
  Heart, 
  ImagePlus, 
  MessageCircle, 
  User 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NavigationPage() {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md py-4 px-8 flex justify-between items-center max-w-lg mx-auto rounded-t-2xl md:max-w-2xl z-50">
      <button 
        onClick={() => router.push('/home')}
        className="text-black hover:text-gray-600 transition-colors"
      >
        <Home size={28} />
      </button>
      
      <button 
        onClick={() => router.push('/notification')}
      className="text-red-500 hover:text-red-600 transition-colors">
        <Heart size={28} fill="#EF4444" />
      </button>
      
      <button 
        onClick={() => router.push('/imageupload')}

      className="text-black hover:text-gray-600 transition-colors">
        <ImagePlus size={28} />
      </button>
      
      <button 
        onClick={() => router.push('/chat')}
        className="text-green-500 hover:text-green-600 transition-colors">
        <MessageCircle size={28} fill="#22C55E" stroke="white" />
      </button>
      
      <button 
        onClick={() => router.push('/profile')}

      className="text-black hover:text-gray-600 transition-colors">
        <User size={28} />
      </button>
    </nav>
  );
}

