'use client';

import { useState } from 'react';
import ProfileCard from './ProfileCard';
import SettingsPage from './SettingsPage';

export default function ProfileView({ data }: { data: any }) {
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return <SettingsPage onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <ProfileCard
        data={data}
        onSettingsClick={() => setShowSettings(true)}
      />
    </div>
  );
}
