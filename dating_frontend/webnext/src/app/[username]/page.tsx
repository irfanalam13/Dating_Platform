"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Profile() {
  const params = useParams();
  const username = params.username as string;

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/auth/profile/${username}`,
          {
            credentials: "include", // ✅ REQUIRED
          }
        );

        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        console.error("❌ FETCH ERROR", err);
      }
    };

    fetchUser();
  }, [username]);

  if (!user) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold">{user.full_name}</h1>
      <p>@{user.username}</p>
    </div>
  );
}