import { Sidebar } from "~/components/sidebar";
import { Chat } from "~/components/chat";
import { SpoilerModal } from "~/components/spoiler-modal";
import { ThemeProvider } from "~/contexts/ThemeContext";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col pt-16 md:pt-0">
          <Chat />
        </main>
        <SpoilerModal />
      </div>
    </ThemeProvider>
  );
}
