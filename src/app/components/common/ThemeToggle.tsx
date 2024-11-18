"use client";

import React from "react";
import { useTheme } from "next-themes";
import {
  faSun as Sun,
  faMoon as Moon,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed right-4 top-4 h-8 w-8 rounded-full bg-gray-800 dark:bg-gray-700 text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
    >
      {theme === "dark" ? (
        <FontAwesomeIcon icon={Sun} className="h-4 w-4" />
      ) : (
        <FontAwesomeIcon icon={Moon} className="h-4 w-4" />
      )}
    </button>
  );
};
