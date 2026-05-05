'use client';

import Image from "next/image";
import { Settings, MapPin, Briefcase, GraduationCap, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage({ data }: any) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-20">

      {/* ===== Top Image Header ===== */}
      <div className="relative h-[420px] w-full">
        <Image
          src={data?.profile_image || "/default.png"}
          alt="profile"
          fill
          className="object-cover"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          
          <button
            onClick={() => router.push("/settings")}
            className="p-2 bg-white/80 backdrop-blur rounded-full shadow"
          >
            <Settings className="w-5 h-5 text-gray-700" />
          </button>

          <span className="px-3 py-1 text-xs bg-black/60 text-white rounded-full">
            {data?.age || "22"}
          </span>
        </div>

        {/* Name + Bio */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-3xl font-bold">
            {data?.full_name || "No Name"}
          </h1>
          <p className="text-sm text-white/80">
            {data?.bio || "Looking for something meaningful ✨"}
          </p>
        </div>
      </div>

      {/* ===== Content Section ===== */}
      <div className="px-5 pt-6 space-y-6">

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{data?.location || "Kathmandu, Nepal"}</span>
        </div>

        {/* About Card */}
        <div className="p-4 rounded-2xl border shadow-sm">
          <h2 className="font-semibold mb-2">About</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {data?.about ||
              "Hey there! I love traveling, coding, and exploring new places. Looking for genuine connections."}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">

          <div className="p-4 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm">Work</span>
            </div>
            <p className="font-semibold mt-1">
              {data?.job || "Developer"}
            </p>
          </div>

          <div className="p-4 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm">Education</span>
            </div>
            <p className="font-semibold mt-1">
              {data?.education || "University"}
            </p>
          </div>
        </div>

        {/* Interests */}
        <div>
          <h2 className="font-semibold mb-3">Interests</h2>

          <div className="flex flex-wrap gap-2">
            {(data?.interests || ["Coding", "Music", "Travel"]).map(
              (item: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-pink-50 text-pink-600 rounded-full"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        {/* Photos */}
        <div>
          <h2 className="font-semibold mb-3">Photos</h2>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((img) => (
              <div
                key={img}
                className="relative h-28 rounded-xl overflow-hidden"
              >
                <Image
                  src={data?.photos?.[img - 1] || "/default.png"}
                  alt="photo"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button className="
          w-full mt-4
          py-3 rounded-2xl
          bg-gradient-to-r from-pink-500 to-red-500
          text-white font-semibold
          flex items-center justify-center gap-2
          active:scale-95 transition
        ">
          <Heart className="w-5 h-5" />
          Like Profile
        </button>

      </div>
    </div>
  );
}