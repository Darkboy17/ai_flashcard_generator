"use client";

import { UserButton } from "@clerk/nextjs";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

import ColorModeToggle from "@/components/ColorModeToggle";

export default function AppShell({ children, eyebrow, title, subtitle, action }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "var(--app-bg)",
        color: "var(--app-text)",
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, py: 2.5 }}>
        <Stack
          component="header"
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{
            mb: { xs: 3, md: 4 },
            pb: 2,
            borderBottom: "1px solid var(--app-border)",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography
              component={Link}
              href="/"
              sx={{
                color: "var(--app-text)",
                fontWeight: 950,
                fontSize: 18,
                letterSpacing: 0,
                textDecoration: "none",
              }}
            >
              AI Flashcard Generator
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "flex", sm: "none" } }}
            >
              <ColorModeToggle />
              <UserButton />
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={{ xs: "space-between", sm: "flex-end" }}
          >
            <Button component={Link} href="/generate" sx={navButtonStyles}>
              Generate
            </Button>
            <Button component={Link} href="/flashcards" sx={navButtonStyles}>
              Collections
            </Button>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "none", sm: "flex" }, ml: 1 }}
            >
              <ColorModeToggle />
              <UserButton />
            </Stack>
          </Stack>
        </Stack>

        {(title || subtitle || action) && (
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "stretch", md: "flex-end" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: { xs: 3, md: 4 } }}
          >
            <Box>
              {eyebrow && (
                <Typography
                  sx={{
                    color: "var(--app-accent)",
                    fontSize: 13,
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  {eyebrow}
                </Typography>
              )}
              {title && (
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: 34, md: 48 },
                    lineHeight: 1,
                    fontWeight: 950,
                    letterSpacing: 0,
                    maxWidth: 820,
                  }}
                >
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography
                  sx={{
                    mt: 1.5,
                    color: "var(--app-muted)",
                    fontSize: { xs: 16, md: 18 },
                    lineHeight: 1.6,
                    maxWidth: 760,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            {action}
          </Stack>
        )}

        {children}
      </Container>
    </Box>
  );
}

const navButtonStyles = {
  color: "var(--app-text)",
  borderRadius: 999,
  px: 2,
  textTransform: "none",
  fontWeight: 850,
  "&:hover": {
    bgcolor: "var(--app-hover)",
  },
};
