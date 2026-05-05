// "use client";

// import ProtectedRoute from "@/shared/lib/protected-route";

// export default function ProtectedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return <ProtectedRoute>{children}</ProtectedRoute>;
// }
export default function ProtectedLayout({ children }) {
  return <>{children}</>;
}