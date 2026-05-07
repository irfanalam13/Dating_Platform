import { Metadata } from "next";
import UploadImage from "@/features/profile/components/UploadSelfie";

export const metadata: Metadata = {
  title: "Inbox | Your App Name",
  description: "View your matches and messages",
};

export default async function Page() {
  return (
    <main className="min-h-screen bg-white">
      <UploadImage />
    </main>
  );
}