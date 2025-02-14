"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Bot, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: string;
};

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: "Hello! How can I assist you today with One Piece chapters?",
      source: "Chapter 1, Page 1",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex h-full flex-col bg-background text-foreground dark:bg-background-light dark:text-foreground-light">
      <ScrollArea className="flex-1 p-4">
        <div className="mx-auto max-w-4xl space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary dark:bg-primary-light">
                    <Bot className="h-4 w-4 text-primary-foreground dark:text-primary-foreground-light" />
                  </Avatar>
                )}
                <div className={"flex max-w-[85%] flex-col gap-2"}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground dark:bg-primary-light dark:text-primary-foreground-light"
                        : "bg-muted text-muted-foreground dark:bg-muted-light dark:text-muted-foreground-light"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === "assistant" && message.source && (
                    <div className="ml-1 text-xs text-muted-foreground dark:text-muted-foreground-light">
                      Source: {message.source}
                    </div>
                  )}
                  {message.role === "assistant" && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-md bg-muted transition-colors hover:bg-background-light/10 dark:bg-muted-light dark:hover:bg-background/10"
                      >
                        <Copy className="h-4 w-4 text-accent dark:text-accent-light" />
                        <span className="sr-only">Copy message</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-md bg-muted transition-colors hover:bg-background-light/10 dark:bg-muted-light dark:hover:bg-background/10"
                      >
                        <ThumbsUp className="h-4 w-4 text-accent dark:text-accent-light" />
                        <span className="sr-only">Like message</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-md bg-muted transition-colors hover:bg-background-light/10 dark:bg-muted-light dark:hover:bg-background/10"
                      >
                        <ThumbsDown className="h-4 w-4 text-accent dark:text-accent-light" />
                        <span className="sr-only">Dislike message</span>
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem(
              "message",
            ) as HTMLInputElement;
            const message = input.value.trim();
            if (message) {
              setIsLoading(true);
              setMessages([
                ...messages,
                {
                  id: crypto.randomUUID(),
                  role: "user",
                  content: message,
                },
              ]);
              input.value = "";
              // Simulate AI response delay
              setTimeout(() => {
                setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content:
                      "This is a demo response. The actual implementation would use the AI SDK with RAG!",
                    source: "Chapter 1004, Page 12",
                  },
                ]);
                setIsLoading(false);
              }, 1000);
            }
          }}
          className="relative mx-auto max-w-4xl"
        >
          <div className="relative">
            <Input
              name="message"
              placeholder="Send a message..."
              className="w-full rounded-2xl border-0 bg-muted/90 px-6 py-6 text-base shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-all duration-200 placeholder:text-muted-foreground/50 hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0A6ABF] focus-visible:ring-opacity-50 dark:bg-muted-light/90 dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] dark:placeholder:text-muted-foreground-light/50 dark:hover:bg-muted-light dark:focus-visible:bg-muted-light dark:focus-visible:ring-[#F28907] dark:focus-visible:ring-opacity-50"
            />
            <div className="absolute right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center">
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="text-[#0A6ABF] dark:text-[#F28907]"
                >
                  <Bot className="h-5 w-5" />
                </motion.div>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0A6ABF] transition-colors hover:bg-[#084DA6] dark:bg-[#F28907] dark:hover:bg-[#F2A172]"
                >
                  <ArrowUp className="h-4 w-4 text-white" />
                  <span className="sr-only">Send message</span>
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
