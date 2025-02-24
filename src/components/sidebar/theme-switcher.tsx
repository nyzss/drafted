"use client";

import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex w-full items-center justify-between gap-2 rounded-md p-2">
      <span className="text-sm">Theme</span>
      <div className="flex items-center rounded-full bg-muted p-1">
        <button
          onClick={() => setTheme("light")}
          className={cn(
            "inline-flex items-center justify-center rounded-full p-1.5 text-sm font-medium ring-offset-background transition-all hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            theme === "light" && "bg-background text-foreground shadow-sm",
            "cursor-pointer",
          )}
        >
          <Sun className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={cn(
            "inline-flex items-center justify-center rounded-full p-1.5 text-sm font-medium ring-offset-background transition-all hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            theme === "dark" && "bg-background text-foreground shadow-sm",
            "cursor-pointer",
          )}
        >
          <Moon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTheme("system")}
          className={cn(
            "inline-flex items-center justify-center rounded-full p-1.5 text-sm font-medium ring-offset-background transition-all hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            theme === "system" && "bg-background text-foreground shadow-sm",
            "cursor-pointer",
          )}
        >
          <Laptop className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
