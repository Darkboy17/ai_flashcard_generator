"use client";

import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

const STORAGE_KEY = "ai-flashcards-color-mode";
const DARK_MODE = "dark";
const LIGHT_MODE = "light";

export default function ColorModeToggle() {
  const [mode, setMode] = useState(LIGHT_MODE);
  const isDark = mode === DARK_MODE;

  useEffect(() => {
    const storedMode = window.localStorage.getItem(STORAGE_KEY);
    const preferredMode = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? DARK_MODE
      : LIGHT_MODE;
    const nextMode = storedMode || preferredMode;

    setMode(nextMode);
    applyMode(nextMode);
  }, []);

  const toggleMode = () => {
    const nextMode = isDark ? LIGHT_MODE : DARK_MODE;

    setMode(nextMode);
    applyMode(nextMode);
    window.localStorage.setItem(STORAGE_KEY, nextMode);
  };

  return (
    <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggleMode}
        sx={{
          width: 36,
          height: 36,
          color: "var(--app-text)",
          bgcolor: "var(--app-control-bg)",
          border: "1px solid var(--app-border)",
          "&:hover": {
            bgcolor: "var(--app-hover)",
          },
        }}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </IconButton>
    </Tooltip>
  );
}

function applyMode(mode) {
  document.documentElement.dataset.theme = mode;
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M20 14.6A8 8 0 0 1 9.4 4 7 7 0 1 0 20 14.6Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
