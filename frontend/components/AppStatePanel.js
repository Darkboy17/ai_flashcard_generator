"use client";

import { CircularProgress, Stack, Typography } from "@mui/material";

const toneStyles = {
  neutral: {
    border: "var(--app-border)",
    background: "var(--app-card)",
    accent: "var(--app-accent)",
    title: "var(--app-text)",
    body: "var(--app-muted)",
  },
  board: {
    border: "#76573d",
    background: "#10100f",
    accent: "#f1d27a",
    title: "#fbf5df",
    body: "rgba(251,245,223,0.74)",
  },
  success: {
    border: "#b7d7bf",
    background: "#f3fbf3",
    accent: "#1f6a36",
  },
  error: {
    border: "#e7b8aa",
    background: "#fff5f1",
    accent: "#9b321b",
  },
};

export default function AppStatePanel({
  title,
  body,
  action,
  loading = false,
  tone = "neutral",
  minHeight = 360,
}) {
  const styles = toneStyles[tone] || toneStyles.neutral;
  const isBoard = tone === "board";

  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight,
        textAlign: "center",
        borderRadius: 2,
        border: isBoard ? `8px solid ${styles.border}` : `1px dashed ${styles.border}`,
        bgcolor: styles.background,
        color: styles.title || "var(--app-text)",
        p: { xs: 3, md: 4 },
        boxShadow: isBoard ? "0 20px 60px rgba(21, 32, 28, 0.16)" : "none",
      }}
    >
      {loading && (
        <CircularProgress
          size={34}
          thickness={4}
          sx={{
            color: styles.accent,
          }}
        />
      )}
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: 26, md: 30 },
          fontWeight: 950,
          lineHeight: 1.08,
          maxWidth: 660,
        }}
      >
        {title}
      </Typography>
      {body && (
        <Typography
          sx={{
            color: styles.body || "var(--app-muted)",
            maxWidth: 560,
            lineHeight: 1.7,
          }}
        >
          {body}
        </Typography>
      )}
      {action}
    </Stack>
  );
}
