import { MessageInbox } from "@/features/chat/components/MessageInbox";

export const metadata = {
  title: "Message Inbox | Your Dating App",
};

export default function ChatIndexPage() {
  // Since this is in the (protected) folder, we assume middleware 
  // or a parent layout has already verified the user is authenticated.
  return <MessageInbox />;
}