import HelpSectionPage from "@/features/profile/components/help";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {

  return <HelpSectionPage />;
}