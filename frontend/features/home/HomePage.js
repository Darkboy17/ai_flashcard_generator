"use client";

import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import AppNotification from "@/components/AppNotification";
import ColorModeToggle from "@/components/ColorModeToggle";

const HOME_URL = "/";
const AUTH_PANEL_WIDTH = 400;
const SIGN_IN_MODE = "sign-in";
const SIGN_UP_MODE = "sign-up";
const ALREADY_REGISTERED_MESSAGE =
  "You already have an account. Please sign in instead.";
const boardBlack = "#10100f";
const chalkWhite = "#fbf5df";
const chalkGold = "#f1d27a";
const woodFrame = "#76573d";

const clerkAppearance = {
  elements: {
    rootBox: {
      width: "100%",
      maxWidth: "none",
    },
    card: {
      width: "100%",
      maxWidth: "none",
      boxSizing: "border-box",
      borderRadius: "10px",
      border: "1px solid #d8d2bf",
      boxShadow: "0 24px 70px rgba(7, 24, 21, 0.22)",
    },
    headerTitle: {
      color: boardBlack,
      fontSize: "26px",
      letterSpacing: "0",
    },
    headerSubtitle: {
      color: "#5f7073",
    },
    socialButtonsBlockButton: {
      borderColor: "#d7e2da",
      color: "#173b3f",
    },
    formButtonPrimary: {
      backgroundColor: boardBlack,
      boxShadow: "none",
      textTransform: "none",
    },
    footerActionLink: {
      color: boardBlack,
      fontWeight: "600",
    },
    footer: {
      display: "none",
    },
  },
};
const signUpAppearance = {
  elements: {
    ...clerkAppearance.elements,
    socialButtons: {
      display: "none",
    },
    dividerRow: {
      display: "none",
    },
  },
};

const highlights = [
  {
    value: "10",
    label: "focused flashcards per generation",
  },
  {
    value: "AI",
    label: "turns queries into useful flashcards",
  },
  {
    value: "24/7",
    label: "study decks available anywhere",
  },
];

const workflow = ["Write the prompt", "Generate cards", "Save collections"];

export default function HomePage() {
  const [authMode, setAuthMode] = useState(SIGN_IN_MODE);
  const [notification, setNotification] = useState({ open: false });
  const authPanelRef = useRef(null);
  const hasHandledExistingAccountRef = useRef(false);
  const isSignIn = authMode === SIGN_IN_MODE;

  useEffect(() => {
    const syncAuthModeFromHash = () => {
      setAuthMode(getModeFromHash());
    };

    syncAuthModeFromHash();
    window.addEventListener("hashchange", syncAuthModeFromHash);

    return () => {
      window.removeEventListener("hashchange", syncAuthModeFromHash);
    };
  }, []);

  useEffect(() => {
    if (isSignIn) {
      hasHandledExistingAccountRef.current = false;
      return undefined;
    }

    const authPanel = authPanelRef.current;

    if (!authPanel) {
      return undefined;
    }

    const handleExistingAccountError = () => {
      if (
        hasHandledExistingAccountRef.current ||
        !authPanel.textContent?.includes(ALREADY_REGISTERED_MESSAGE)
      ) {
        return;
      }

      hasHandledExistingAccountRef.current = true;
      setNotification({
        open: true,
        severity: "warning",
        title: "Account already exists",
        message: "That email is already registered. Please sign in instead.",
      });
      selectAuthMode(SIGN_IN_MODE);
    };

    handleExistingAccountError();
    const observer = new MutationObserver(handleExistingAccountError);
    observer.observe(authPanel, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [isSignIn]);

  const selectAuthMode = (mode) => {
    setAuthMode(mode);
    hasHandledExistingAccountRef.current = false;

    if (typeof window === "undefined") {
      return;
    }

    const nextHash = `#${mode}`;

    if (window.location.hash !== nextHash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${nextHash}`,
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "var(--app-bg)",
        color: chalkWhite,
        overflowX: "hidden",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          px: { xs: 1.5, sm: 2.5, md: 3 },
        }}
      >
        <Stack
          component="header"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            py: { xs: 1.4, sm: 1.6, md: 2.5 },
            color: "var(--app-text)",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: 0,
            }}
          >
            AI Flashcard Generator
          </Typography>
          <SignedIn>
            <Stack direction="row" spacing={1} alignItems="center">
              <ColorModeToggle />
              <UserButton />
            </Stack>
          </SignedIn>
        </Stack>

        <Box
          component="main"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.08fr) 470px" },
            gap: { xs: 2, lg: 5 },
            alignItems: { xs: "start", lg: "center" },
            alignContent: { xs: "start", lg: "center" },
            flex: 1,
            pb: { xs: 2, md: 4 },
            minHeight: 0,
          }}
        >
          <SignedOut>
          <Stack
            spacing={{ xs: 1.5, md: 2.5, lg: 3.5 }}
            sx={{
              position: "relative",
              p: { xs: 1.8, sm: 2, md: 2.5, lg: 4.5 },
              borderRadius: 2,
              bgcolor: boardBlack,
              border: { xs: `8px solid ${woodFrame}`, lg: `12px solid ${woodFrame}` },
              boxShadow:
                "inset 0 0 0 2px rgba(255,255,255,0.08), 0 28px 80px rgba(21, 32, 28, 0.24)",
              height: {
                xs: "min(22vh, 168px)",
                sm: "min(21vh, 178px)",
                md: "min(24vh, 210px)",
                lg: "calc(100vh - 148px)",
              },
              minHeight: { xs: 148, sm: 158, lg: 560 },
              maxHeight: { xs: 168, sm: 178, md: 220, lg: "calc(100vh - 130px)" },
              overflow: "hidden",
              justifyContent: "center",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: { xs: 10, lg: 18 },
                border: `1px solid ${alpha(chalkWhite, 0.12)}`,
                pointerEvents: "none",
              },
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: { xs: 0.55, lg: 0.8 },
                  borderRadius: 1,
                  bgcolor: alpha(chalkWhite, 0.08),
                  border: `1px solid ${alpha(chalkWhite, 0.24)}`,
                  color: chalkGold,
                  fontWeight: 800,
                  fontSize: { xs: 10, md: 11, lg: 13 },
                  mb: { xs: 1, lg: 2 },
                }}
              >
                Built for sharper study sessions
              </Box>
              <Typography
                component="h1"
                sx={{
                  maxWidth: 740,
                  fontSize: { xs: 25, sm: 27, md: 33, lg: 60, xl: 68 },
                  lineHeight: { xs: 1.04, lg: 1 },
                  fontWeight: 950,
                  letterSpacing: 0,
                }}
              >
                Prompt the AI with any topic. Get study-ready flashcards in seconds.
              </Typography>
              <Typography
                sx={{
                  mt: 2.5,
                  maxWidth: 650,
                  color: alpha(chalkWhite, 0.78),
                  fontSize: { xs: 14, md: 15, lg: 18 },
                  lineHeight: 1.55,
                  display: { xs: "none", md: "block" },
                }}
              >
                Ask for biology terms, history dates, exam prep, coding
                concepts, or anything else you want to learn. The app turns
                your prompt into concise question-and-answer cards.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 1.5,
                display: { xs: "none", lg: "grid" },
              }}
            >
              {workflow.map((item, index) => (
                <Box
                  key={item}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: alpha(chalkWhite, 0.08),
                    border: `1px solid ${alpha(chalkWhite, 0.18)}`,
                  }}
                >
                  <Typography
                    sx={{
                      color: chalkGold,
                      fontSize: 13,
                      fontWeight: 900,
                      mb: 1,
                    }}
                  >
                    Step {index + 1}
                  </Typography>
                  <Typography
                    sx={{
                      color: chalkWhite,
                      fontSize: 17,
                      fontWeight: 900,
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 1.5,
                display: { xs: "none", lg: "grid" },
              }}
            >
              {highlights.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    p: 1.8,
                    borderRadius: 1,
                    bgcolor: alpha(chalkWhite, 0.07),
                    border: `1px solid ${alpha(chalkWhite, 0.16)}`,
                  }}
                >
                  <Typography
                    sx={{
                      color: chalkGold,
                      fontSize: 24,
                      fontWeight: 950,
                      lineHeight: 1,
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      color: alpha(chalkWhite, 0.76),
                      lineHeight: 1.45,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Stack>

          <Box
            ref={authPanelRef}
            sx={{
              justifySelf: { xs: "stretch", lg: "end" },
              width: "100%",
              maxWidth: AUTH_PANEL_WIDTH,
              mx: { xs: "auto", lg: 0 },
            }}
          >
            <SignedOut>
              <Box
                sx={{
                  mb: 2,
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1,
                  p: 0.5,
                  borderRadius: 999,
                  bgcolor: "#e3ddcb",
                  border: "1px solid #d1c7ad",
                }}
              >
                {[SIGN_IN_MODE, SIGN_UP_MODE].map((mode) => (
                  <Button
                    key={mode}
                    onClick={() => selectAuthMode(mode)}
                    sx={{
                      borderRadius: 999,
                      bgcolor: authMode === mode ? "#fffdf4" : "transparent",
                      color: authMode === mode ? boardBlack : "#5c5547",
                      boxShadow:
                        authMode === mode
                          ? "0 8px 24px rgba(21,32,28,0.1)"
                          : "none",
                      textTransform: "none",
                      fontWeight: 900,
                      "&:hover": {
                        bgcolor: authMode === mode ? "#fffdf4" : "#d8cfb8",
                      },
                    }}
                  >
                    {mode === SIGN_IN_MODE ? "Login" : "Sign up"}
                  </Button>
                ))}
              </Box>

              {isSignIn ? (
                <SignIn
                  routing="hash"
                  signUpUrl="/#sign-up"
                  forceRedirectUrl={HOME_URL}
                  fallbackRedirectUrl={HOME_URL}
                  appearance={clerkAppearance}
                />
              ) : (
                <SignUp
                  routing="hash"
                  signInUrl="/#sign-in"
                  forceRedirectUrl={HOME_URL}
                  fallbackRedirectUrl={HOME_URL}
                  appearance={signUpAppearance}
                />
              )}
            </SignedOut>
          </Box>
          </SignedOut>

          <SignedIn>
            <Dashboard />
          </SignedIn>
        </Box>
      </Container>
      <AppNotification
        notification={notification}
        onClose={() => setNotification((current) => ({ ...current, open: false }))}
      />
    </Box>
  );
}

function getModeFromHash() {
  if (typeof window === "undefined") {
    return SIGN_IN_MODE;
  }

  return window.location.hash === "#sign-up" ? SIGN_UP_MODE : SIGN_IN_MODE;
}

function Dashboard() {
  return (
    <Box
      sx={{
        gridColumn: "1 / -1",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "0.9fr 1.1fr" },
        gap: { xs: 2.5, md: 3 },
        alignItems: "stretch",
      }}
    >
      <Stack
        spacing={2.5}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          bgcolor: boardBlack,
          color: chalkWhite,
          border: `10px solid ${woodFrame}`,
          boxShadow: "0 24px 70px rgba(21, 32, 28, 0.18)",
          justifyContent: "space-between",
          minHeight: { xs: 280, lg: 520 },
        }}
      >
        <Box>
          <Typography
            sx={{
              color: chalkGold,
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            Dashboard
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 38, md: 56 },
              lineHeight: 1,
              fontWeight: 950,
              letterSpacing: 0,
            }}
          >
            What would you like to study today?
          </Typography>
          <Typography
            sx={{
              mt: 2,
              color: alpha(chalkWhite, 0.76),
              fontSize: { xs: 16, md: 18 },
              lineHeight: 1.65,
              maxWidth: 620,
            }}
          >
            Generate a new set from a prompt, or continue from your saved
            collections.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1.2,
          }}
        >
          {["Prompt", "Generate", "Review"].map((item, index) => (
            <Box
              key={item}
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: alpha(chalkWhite, 0.08),
                border: `1px solid ${alpha(chalkWhite, 0.18)}`,
              }}
            >
              <Typography sx={{ color: chalkGold, fontWeight: 950 }}>
                {index + 1}
              </Typography>
              <Typography sx={{ mt: 0.5, fontWeight: 850 }}>{item}</Typography>
            </Box>
          ))}
        </Box>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <DashboardAction
          title="Generate Flashcards"
          description="Write a topic, paste notes, or ask for exam prep cards. The AI will create a focused set for review."
          href="/generate"
          label="Start generating"
          accent="var(--app-accent)"
        />
        <DashboardAction
          title="View Collections"
          description="Open saved decks, continue reviewing older topics, and keep your study material organized."
          href="/flashcards"
          label="Open collections"
          accent="var(--app-accent)"
        />
      </Box>
    </Box>
  );
}

function DashboardAction({ title, description, href, label, accent }) {
  return (
    <Stack
      spacing={2}
      sx={{
        p: { xs: 3, md: 3.5 },
        borderRadius: 2,
        bgcolor: "var(--app-card)",
        color: "var(--app-text)",
        border: "1px solid var(--app-border)",
        boxShadow: "0 20px 60px var(--app-shadow)",
        minHeight: 300,
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box
          sx={{
            width: 44,
            height: 8,
            borderRadius: 999,
            bgcolor: accent,
            mb: 3,
          }}
        />
        <Typography
          component="h2"
          sx={{
            color: "var(--app-text)",
            fontSize: 30,
            fontWeight: 950,
            lineHeight: 1,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ mt: 1.5, color: "var(--app-muted)", lineHeight: 1.7 }}>
          {description}
        </Typography>
      </Box>
      <Button
        component={Link}
        href={href}
        variant="contained"
        sx={{
          alignSelf: "flex-start",
          bgcolor: boardBlack,
          borderRadius: 999,
          px: 3,
          py: 1.15,
          boxShadow: "none",
          textTransform: "none",
          fontWeight: 900,
          "&:hover": { bgcolor: "#272724", boxShadow: "none" },
        }}
      >
        {label}
      </Button>
    </Stack>
  );
}
