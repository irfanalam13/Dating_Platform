// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import ProfileClient from "./ProfileClient";

// async function getMe() {
//   // ✅ FIX: await cookies()
//   const cookieStore = await cookies();

//   const cookieHeader = cookieStore
//     .getAll()
//     .map((c) => `${c.name}=${c.value}`)
//     .join("; ");

//   const res = await fetch(
//     "http://localhost:8000/api/v1/auth/me/",
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

//   return res.json();
// }

// export default async function ProfilePage() {
//   const user = await getMe();

//   if (!user) {
//     redirect("/login"); // 🔐 protect route
//   }

//   return <ProfileClient user={user} />;
// }






import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getMe() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch("http://localhost:8000/api/v1/auth/me/", {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function ProfilePage() {
  const user = await getMe();

  if (!user) {
    redirect("/login");
  }

  // Redirect to the dynamic username route
  // Now, if your username is "look", it will go to /look
  redirect(`/${user.username}`);
}