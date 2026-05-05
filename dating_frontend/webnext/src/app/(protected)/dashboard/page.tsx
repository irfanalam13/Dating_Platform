// "use client";

// import ProtectedRoute from "@/shared/lib/protected-route";
// import { useContext } from "react";
// import { AuthContext } from "@/shared/context/auth-context";

// export default function Dashboard() {
//   const auth = useContext(AuthContext);

//   if (!auth) {
//     return null; // or loading UI
//   }

//   const { user } = auth;

//   return (
//     <ProtectedRoute>
//       <h1>Welcome {user?.username ?? user?.email}</h1>
//     </ProtectedRoute>
//   );
// }
export default function Dashboard() {
  return <div></div>;
}