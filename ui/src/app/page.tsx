import { Chat } from "~/components/chat";
import { Sidebar } from "~/components/sidebar";
import { SpoilerModal } from "~/components/spoiler-modal";

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex flex-1 flex-col pt-16 md:pt-0">
        <Chat />
      </main>
      <SpoilerModal />
    </div>
  );
}
