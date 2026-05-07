import AccountDeletionPage from "@/features/profile/components/Delete";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {

  return <AccountDeletionPage />;
}
