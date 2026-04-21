// app/(public)/discover/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getRecommendations } from "@/features/match/api";

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    getRecommendations().then((res) => {
      setProfiles(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Discover</h1>

      {profiles.map((p: any) => (
        <div key={p.id} className="border p-4 mb-2">
          <h2>{p.full_name}</h2>
          <p>{p.location}</p>
        </div>
      ))}
    </div>
  );
}