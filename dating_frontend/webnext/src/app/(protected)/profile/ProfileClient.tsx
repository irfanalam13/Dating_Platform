"use client";

import { useState, useEffect } from "react";
import ProfileCard from "@/features/profile/components/ProfileCard";
import {
  useMyProfile,
  useUpdateProfile,
} from "@/features/profile/hooks/useProfile";

export default function ProfileClient({ user }: any) {
  const { data, isLoading } = useMyProfile();
  const mutation = useUpdateProfile();

  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (data) {
      setBio(data.bio || "");
      setLocation(data.location || "");
    }
  }, [data]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("location", location);

    mutation.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center mt-10 gap-6">
      
      {/* Profile View */}
      {!isEditing && (
        <>
          <ProfileCard data={data} />
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Edit Profile
          </button>
        </>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className="flex flex-col gap-4 w-80">
          <input
            className="border p-2 rounded"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}