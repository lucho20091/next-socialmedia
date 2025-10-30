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
      className="w-10 h-10 rounded-full grid place-items-center cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-2 border-black dark:border-white"
    >
      {theme === "light" ? <MdDarkMode /> : <CiLight />}
    </button>
  );
}
