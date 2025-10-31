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
      className="w-10 h-10 rounded-full grid place-items-center cursor-pointer bg-gray-200 dark:bg-red-950 text-gray-900 dark:text-gray-100 border-2 border-black dark:border-yellow-700 shadow-md dark:shadow-yellow-900"
    >
      {theme === "light" ? (
        <MdDarkMode />
      ) : (
        <CiLight className="text-yellow-500 font-bold" size="20px" />
      )}
    </button>
  );
}
