"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Menu, X, Ship, Twitter, History } from "lucide-react";
import { cn } from "~/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "~/components/theme-toggle";

function truncateMiddle(text: string, startLength: number, endLength: number) {
  if (text.length <= startLength + endLength + 3) return text;
  return `${text.slice(0, startLength)}...${text.slice(-endLength)}`;
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-40 h-16 border-b border-border bg-background dark:border-border-light dark:bg-background-light md:hidden">
        <div className="flex h-full items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-background-light/10 dark:text-foreground-light dark:hover:bg-background/10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex items-center gap-2">
            <Ship className="h-5 w-5 text-primary dark:text-primary-light" />
            <span className="text-lg font-semibold text-foreground dark:text-foreground-light">
              One Piece Chat
            </span>
          </div>

          <ThemeToggle />
        </div>
      </div>
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed inset-y-0 left-0 z-30 w-64 border-r border-border bg-background dark:border-border-light dark:bg-background-light",
              "md:static md:w-80 md:translate-x-0",
            )}
          >
            <div className="flex h-full flex-col">
              {/* Desktop-only header */}
              <div className="hidden border-b border-border p-4 dark:border-border-light md:block">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Ship className="h-6 w-6 text-primary dark:text-primary-light" />
                    <h1 className="text-xl font-bold text-foreground dark:text-foreground-light">
                      One Piece Chat
                    </h1>
                  </div>
                  <ThemeToggle />
                </div>
              </div>

              {/* Main content area */}
              <div className="mt-16 flex h-[calc(100%-4rem)] flex-1 flex-col md:mt-0 md:h-[calc(100%-5rem)]">
                <ScrollArea className="flex-1">
                  <div className="space-y-4 p-4">
                    <div className="flex items-center gap-2 text-muted-foreground dark:text-muted-foreground-light">
                      <History className="h-5 w-5" />
                      <span className="font-medium">Previous Chat History</span>
                    </div>
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const chapterTitle = `Chapter ${1000 + i}: The Journey Continues`;
                        return (
                          <Button
                            key={i}
                            variant="ghost"
                            className="w-full justify-start text-left font-normal text-muted-foreground transition-colors hover:bg-background-light/10 hover:text-foreground dark:text-muted-foreground-light dark:hover:bg-background/10 dark:hover:text-foreground-light"
                          >
                            {truncateMiddle(chapterTitle, 15, 8)}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </ScrollArea>
              </div>

              {/* Footer */}
              <div className="border-t border-border p-4 dark:border-border-light">
                <a
                  href="https://twitter.com/adiaddxyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground dark:text-muted-foreground-light dark:hover:text-foreground-light"
                >
                  <span>Built by</span>
                  <Twitter className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="font-medium">@adiaddxyz</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
