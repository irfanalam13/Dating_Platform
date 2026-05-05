// "use client";

// import Image from "next/image";

// export default function ProfileCard({ data }: any) {

//   const { profile, stats, settings } = data;

//   if (data.is_private) {
//     return <p>This account is private 🔒</p>;
//   }
// return (
//   <div className="p-4 border rounded-xl shadow-md w-full max-w-md">
//     <div className="flex items-center gap-4">
//       <Image
//         src={data?.profile_image || "/default.png"}
//         alt="profile"
//         width={80}
//         height={80}
//         className="rounded-full"
//       />

//       <div>
//         <p className="font-bold text-lg">
//           {data?.bio || data?.full_name || "No bio"}
//         </p>

//         <p className="text-sm text-gray-500">
//           {data?.location || "No location"}
//         </p>

//         <p className="text-xs text-gray-400">
//           @{data?.username}
//         </p>
//       </div>
//     </div>

//     {/* Stats fallback (since backend doesn't provide yet) */}
//     <div className="flex justify-around mt-4 text-center">
//       <div>
//         <p className="font-bold">{data?.followers || 0}</p>
//         <p>Followers</p>
//       </div>

//       <div>
//         <p className="font-bold">{data?.following || 0}</p>
//         <p>Following</p>
//       </div>

//       <div>
//         <p className="font-bold">{data?.posts || 0}</p>
//         <p>Posts</p>
//       </div>
//     </div>
//   </div>
// );
// }

'use client';

import Image from "next/image";
import { Settings, Edit3, MapPin, Heart, Camera } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyProfilePage({ data }: any) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-24">

      {/* ===== HEADER IMAGE ===== */}
      <div className="relative h-[420px] w-full">
        <Image
          src={data?.profile_image || "/default.png"}
          alt="profile"
          fill
          className="object-cover"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top Actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">

          {/* Settings */}
          <button
            onClick={() => router.push("/settings")}
            className="p-2 bg-white/80 backdrop-blur rounded-full shadow"
          >
            <Settings className="w-5 h-5 text-gray-700" />
          </button>

          {/* Edit Profile */}
          <button
            className="p-2 bg-white/80 backdrop-blur rounded-full shadow"
          >
            <Edit3 className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="absolute bottom-4 left-4 right-4 text-white">

          <h1 className="text-3xl font-bold">
            {data?.full_name || "Your Name"}
          </h1>

          <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
            <MapPin className="w-4 h-4" />
            <span>{data?.location || "Add location"}</span>
          </div>

          <p className="text-sm mt-2 text-white/80">
            {data?.bio || "Add your bio..."}
          </p>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="px-5 space-y-6 mt-6">

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">

          <div className="p-4 rounded-2xl border shadow-sm">
            <p className="font-bold text-lg">{data?.followers || 0}</p>
            <p className="text-xs text-gray-500">Likes</p>
          </div>

          <div className="p-4 rounded-2xl border shadow-sm">
            <p className="font-bold text-lg">{data?.matches || 0}</p>
            <p className="text-xs text-gray-500">Matches</p>
          </div>

          <div className="p-4 rounded-2xl border shadow-sm">
            <p className="font-bold text-lg">{data?.photos || 0}</p>
            <p className="text-xs text-gray-500">Photos</p>
          </div>
        </div>

        {/* About Section */}
        <div className="p-4 rounded-2xl border shadow-sm">
          <h2 className="font-semibold mb-2">About Me</h2>
          <p className="text-sm text-gray-600">
            {data?.about ||
              "Write something about yourself... people will see this on your profile."}
          </p>
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">My Photos</h2>

            <button className="flex items-center gap-1 text-pink-500 text-sm">
              <Camera className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((img) => (
              <div
                key={img}
                className="relative h-28 rounded-xl overflow-hidden bg-gray-100"
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

        {/* Edit Profile Button */}

        <button
          onClick={() => router.push('/profile/edit')}
          className="
            w-full mt-4
            py-3 rounded-2xl
            bg-gradient-to-r from-pink-500 to-red-500
            text-white font-semibold
            active:scale-95 transition
          "
        >
          Edit Profile
        </button>

      </div>
    </div>
  );
}