"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

export function SpoilerModal() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenSpoilerModal");
    if (hasSeenModal) {
      setIsOpen(false);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenSpoilerModal", "true");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 dark:bg-background-light/50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="mx-4 w-full max-w-md rounded-lg bg-card p-6 dark:bg-card-light"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground dark:text-foreground-light">
                Spoiler Warning
              </h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-5 w-5 text-muted-foreground dark:text-muted-foreground-light" />
              </Button>
            </div>
            <p className="mb-4 text-muted-foreground dark:text-muted-foreground-light">
              This chat application contains information about One Piece manga
              chapters. It may include spoilers for those who are not up to date
              with the latest releases.
            </p>
            <Button
              className="w-full"
              variant="destructive"
              onClick={closeModal}
            >
              I understand, continue
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
