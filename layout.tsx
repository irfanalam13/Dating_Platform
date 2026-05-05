// import "./globals.css";

// export const metadata = {
//   title: "App",
//   description: "My App",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }


// import "./globals.css";
// import type { Metadata } from "next";
// import React from "react";

// export const metadata: Metadata = {
//   title: "App",
//   description: "My App",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }



import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Support Chatbot",
  description: "Smart customer support chatbot with AI responses, FAQ search, and live agent escalation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex">
        <aside className="w-60 h-screen bg-black text-white p-4">
          <h2 className="text-lg font-bold mb-4">Dashboard</h2>
          <ul className="space-y-2">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/deactivate">deactivate</Link></li>
            <li><Link href="/delete">delete</Link></li>
            <li><Link href="/help">Help</Link></li>
            <li><Link href="/setting">Setting</Link></li>
          </ul>
        </aside>

        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </body>
    </html>
  );
}