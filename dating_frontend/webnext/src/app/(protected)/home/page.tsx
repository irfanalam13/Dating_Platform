import HomePage from "@/features/core/components/home";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {

  return <HomePage />;
}
