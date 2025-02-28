"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <motion.button
        className="relative h-6 w-12 rounded-full bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-primary-light/20 dark:focus:ring-primary-light"
        aria-label="Toggle theme"
      >
        <motion.div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary dark:bg-primary-light">
          <Moon className="h-4 w-4 text-background" />
        </motion.div>
      </motion.button>
    );
  }

  return (
    <motion.button
      className="relative h-6 w-12 rounded-full bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-primary-light/20 dark:focus:ring-primary-light"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary dark:bg-primary-light"
        animate={{
          x: theme === "dark" ? 0 : 24,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {theme === "dark" ? (
          <Moon className="h-4 w-4 text-background" />
        ) : (
          <Sun className="h-4 w-4 text-background" />
        )}
      </motion.div>
    </motion.button>
  );
}
