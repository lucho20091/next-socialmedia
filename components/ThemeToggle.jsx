"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita errores de hidratación
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="
  w-10 h-10 
    grid place-items-center 
    rounded-full 
    cursor-pointer
    transition-all duration-300 
    bg-gray-100 dark:bg-neutral-900 
    border border-gray-400 dark:border-neutral-700 
    text-gray-800 dark:text-gray-300
    shadow-md shadow-black/40 
    hover:scale-105 hover:shadow-lg 
    hover:border-indigo-500/60 
    dark:hover:border-yellow-400/60 
    hover:text-indigo-400 
    dark:hover:text-yellow-300
  "
    >
      {theme === "light" ? (
        <MdDarkMode />
      ) : (
        <CiLight className="text-yellow-500 font-bold" size="20px" />
      )}
    </button>
  );
}
