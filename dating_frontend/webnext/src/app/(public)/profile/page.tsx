"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useProfile,
  useUpdateProfile,
  useUploadImage,
} from "@/features/profile/hooks/hooks";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const uploadMutation = useUploadImage();

  const [bio, setBio] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);

  if (isLoading) return <p>Loading...</p>;

  // fallback values
  const currentBio = bio || profile?.bio || "";
  const currentAge = age || profile?.age || "";

  const handleUpdate = () => {
    updateMutation.mutate({
      bio: currentBio,
      age: Number(currentAge),
    });
  };

  const handleUpload = () => {
    if (file) uploadMutation.mutate(file);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Profile</h1>

      <input
        placeholder="Bio"
        value={currentBio}
        onChange={(e) => setBio(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input
        placeholder="Age"
        value={currentAge}
        onChange={(e) => setAge(Number(e.target.value))}
        className="border p-2 w-full mb-2"
      />

      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white p-2"
      >
        Save
      </button>

      <hr className="my-4" />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        className="bg-green-500 text-white p-2 ml-2"
      >
        Upload Image
      </button>

      <div className="mt-4 flex gap-2">
        {profile?.images?.map((img) => (
          <Image
            key={img.id}
            src={`http://localhost:8000${img.image}`}
            alt="profile"
            width={80}
            height={80}
            className="object-cover"
          />
        ))}
      </div>
    </div>
  );
}