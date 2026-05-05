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
import { Heart, X, Star, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DatingProfileCard({ data }: any) {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white p-4">
      
      {/* Card */}
      <div className="
        w-full max-w-sm sm:max-w-md
        bg-white rounded-3xl shadow-xl
        overflow-hidden
        relative
      ">
        
        {/* Image Section */}
        <div className="relative h-[420px] sm:h-[500px] w-full">
          <Image
            src={data?.profile_image || "/default.png"}
            alt="profile"
            fill
            className="object-cover"
          />

          {/* Top overlay buttons */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <button
              onClick={() => router.push("/settings")}
              className="p-2 bg-white/80 backdrop-blur rounded-full shadow"
            >
              <Settings className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex gap-2">
              <span className="px-3 py-1 text-xs bg-black/50 text-white rounded-full">
                {data?.age || "22"}
              </span>
              <span className="px-3 py-1 text-xs bg-black/50 text-white rounded-full">
                {data?.location || "Kathmandu"}
              </span>
            </div>
          </div>

          {/* Gradient bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Info overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="text-2xl font-bold">
              {data?.full_name || "No Name"}
            </h1>
            <p className="text-sm text-white/80">
              {data?.bio || "Looking for something meaningful ✨"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="
          flex items-center justify-between
          px-6 py-5
        ">
          
          {/* Reject */}
          <button className="
            w-14 h-14 rounded-full
            bg-white shadow-md border
            flex items-center justify-center
            active:scale-90 transition
          ">
            <X className="w-6 h-6 text-red-500" />
          </button>

          {/* Super Like */}
          <button className="
            w-12 h-12 rounded-full
            bg-blue-50 shadow-md border
            flex items-center justify-center
            active:scale-90 transition
          ">
            <Star className="w-5 h-5 text-blue-500" />
          </button>

          {/* Like */}
          <button className="
            w-14 h-14 rounded-full
            bg-gradient-to-r from-pink-500 to-red-500
            shadow-lg
            flex items-center justify-center
            active:scale-90 transition
          ">
            <Heart className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}