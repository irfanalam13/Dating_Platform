import "./globals.css";
import Providers from "./providers";
import QueryProvider from "@/providers/QueryProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <Providers>{children}</Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
