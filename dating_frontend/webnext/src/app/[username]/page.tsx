// import { cookies } from "next/headers";

// async function getUser(username: string) {
//   const cookieStore = await cookies();

//   const cookieHeader = cookieStore
//     ?.getAll?.()
//     ?.map((c) => `${c.name}=${c.value}`)
//     .join("; ") || "";

//   const res = await fetch(
//     `http://localhost:8000/api/v1/auth/profile/${username}/`,
//     {
//       headers: {
//         Cookie: cookieHeader,
//       },
//       cache: "no-store",
//     }
//   );

//   if (!res.ok) {
//     return null;
//   }

//   const data = await res.json();
//   return data.data;
// }

// export default async function Profile({
//   params,
// }: {
//   params: Promise<{ username: string }>;
// }) {
//   const { username } = await params;

//   const user = await getUser(username);

//   if (!user) {
//     return <p className="text-center mt-20">User not found</p>;
//   }

//   return (
//     <div className="text-center mt-20">
//       <h1 className="text-3xl font-bold">{user.full_name}</h1>
//       <p>@{user.username}</p>
//     </div>
//   );
// }








// import { cookies } from "next/headers";

// async function getUser(username: string) {
//   const cookieStore = await cookies();

//   const cookieHeader = cookieStore
//     ?.getAll?.()
//     ?.map((c) => `${c.name}=${c.value}`)
//     .join("; ") || "";

//   const res = await fetch(
//     `http://localhost:8000/api/v1/auth/profile/${username}/`,
//     {
//       headers: {
//         Cookie: cookieHeader,
//       },
//       cache: "no-store",
//     }
//   );

//   if (!res.ok) {
//     return null;
//   }

//   const data = await res.json();
//   return data.data;
// }

// export default async function Profile({
//   params,
// }: {
//   params: Promise<{ username: string }>;
// }) {
//   const { username } = await params;

//   const user = await getUser(username);

//   if (!user) {
//     return <p className="text-center mt-20">User not found</p>;
//   }

//   return (
//     <div className="text-center mt-20">
//       <h1 className="text-3xl font-bold">{user.full_name}</h1>
//       <p>@{user.username}</p>
//     </div>
//   );
// }


import ProfileCard from "@/features/profile/components/ProfileCard";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ProfileResponse } from "@/features/profile/types";

async function getUser(
  username: string,
  cookieHeader: string
): Promise<ProfileResponse | null> {
  try {
    const res = await fetch(
      `http://localhost:8000/api/v1/auth/profile/${username}/`,
      {
        headers: { Cookie: cookieHeader },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params; 

  const headerStore = await headers();
  const cookieHeader = headerStore.get("cookie") || "";

  const user = await getUser(username, cookieHeader);

  if (!user) {
    notFound();
  }

  return <ProfileCard data={user} />;
}