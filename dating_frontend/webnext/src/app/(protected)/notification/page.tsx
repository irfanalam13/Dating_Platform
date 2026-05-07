import NotificationItem from "@/features/notification/components/notificationhome";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {

  return <NotificationItem />;
}