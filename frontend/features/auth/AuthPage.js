"use client";

import { SignIn, SignUp, useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const outcomes = ["AI study cards", "Saved collections", "Focused review"];
const HOME_URL = "/";

const clerkAppearance = {
  elements: {
    rootBox: {
      width: "100%",
    },
    card: {
      width: "100%",
      maxWidth: "440px",
      borderRadius: "18px",
      border: "1px solid #dde7dd",
      boxShadow: "0 24px 70px rgba(25, 48, 55, 0.14)",
    },
    headerTitle: {
      color: "#173b3f",
      fontSize: "28px",
      letterSpacing: "0",
    },
    headerSubtitle: {
      color: "#5d6f72",
    },
    socialButtonsBlockButton: {
      borderColor: "#d7e2da",
      color: "#173b3f",
    },
    formButtonPrimary: {
      backgroundColor: "#176b5c",
      boxShadow: "none",
      textTransform: "none",
    },
    footerActionLink: {
      color: "#176b5c",
      fontWeight: "600",
    },
  },
};

export default function AuthPage({ mode }) {
  const isSignIn = mode === "sign-in";
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(HOME_URL);
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7faf6",
        color: "#173b3f",
      }}
    >
      <Container maxWidth="xl" sx={{ minHeight: "100vh" }}>
        <Stack
          component="header"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: { xs: 2, md: 3 } }}
        >
          <Button
            component={Link}
            href="/"
            sx={{
              color: "#173b3f",
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: 0,
              textTransform: "none",
              px: 0,
              "&:hover": { bgcolor: "transparent", color: "#176b5c" },
            }}
          >
            AI Flashcard Generator
          </Button>
          <Button
            component={Link}
            href={isSignIn ? "/sign-up" : "/sign-in"}
            variant="outlined"
            sx={{
              borderColor: "#b9cbbf",
              color: "#173b3f",
              borderRadius: 999,
              px: 2.5,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": {
                borderColor: "#176b5c",
                bgcolor: alpha("#176b5c", 0.06),
              },
            }}
          >
            {isSignIn ? "Create account" : "Sign in"}
          </Button>
        </Stack>

        <Box
          component="main"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.05fr) 480px" },
            alignItems: "center",
            gap: { xs: 4, lg: 7 },
            minHeight: { xs: "auto", lg: "calc(100vh - 104px)" },
            pb: { xs: 5, md: 7 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 390, md: 560 },
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid #dbe7df",
              bgcolor: "#dfeee7",
              boxShadow: "0 32px 90px rgba(25, 48, 55, 0.13)",
            }}
          >
            <Image
              src="/auth-learning.png"
              alt="Study desk with flashcards and learning tools"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 58vw"
              style={{ objectFit: "cover" }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(11, 45, 49, 0.74), rgba(11, 45, 49, 0.28) 52%, rgba(255,255,255,0.02))",
              }}
            />
            <Stack
              spacing={3}
              sx={{
                position: "absolute",
                left: { xs: 24, sm: 40 },
                right: { xs: 24, sm: "auto" },
                bottom: { xs: 24, sm: 40 },
                maxWidth: 520,
                color: "#fff",
              }}
            >
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: "#f6c66b",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                  }}
                >
                  Study smarter
                </Typography>
                <Typography
                  component="h1"
                  sx={{
                    mt: 1,
                    fontSize: { xs: 34, sm: 46, md: 58 },
                    lineHeight: 1,
                    fontWeight: 900,
                    letterSpacing: 0,
                    maxWidth: 560,
                  }}
                >
                  Build a better study rhythm.
                </Typography>
              </Box>
              <Stack direction="row" gap={1.2} flexWrap="wrap">
                {outcomes.map((outcome) => (
                  <Box
                    key={outcome}
                    sx={{
                      px: 1.6,
                      py: 0.9,
                      borderRadius: 999,
                      bgcolor: "rgba(255,255,255,0.16)",
                      border: "1px solid rgba(255,255,255,0.32)",
                      backdropFilter: "blur(10px)",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {outcome}
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Box>

          <Stack
            spacing={3}
            alignItems="center"
            sx={{
              width: "100%",
              maxWidth: 480,
              mx: "auto",
              pb: { xs: 2, lg: 5 },
            }}
          >
            <Box sx={{ width: "100%", textAlign: { xs: "center", lg: "left" } }}>
              <Typography
                variant="overline"
                sx={{
                  color: "#c15f3f",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                }}
              >
                {isSignIn ? "Welcome back" : "Start learning"}
              </Typography>
              <Typography
                component="h2"
                sx={{
                  mt: 0.5,
                  fontSize: { xs: 30, sm: 36 },
                  lineHeight: 1.1,
                  fontWeight: 900,
                  letterSpacing: 0,
                }}
              >
                {isSignIn
                  ? "Continue your flashcard practice."
                  : "Create your study workspace."}
              </Typography>
              <Typography sx={{ mt: 1.5, color: "#637578", lineHeight: 1.7 }}>
                {isSignIn
                  ? "Pick up where you left off with saved decks and generated cards."
                  : "Turn notes into organized flashcards and keep your collections in one place."}
              </Typography>
            </Box>

            {isSignIn ? (
              <SignIn
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                forceRedirectUrl={HOME_URL}
                fallbackRedirectUrl={HOME_URL}
                appearance={clerkAppearance}
              />
            ) : (
              <SignUp
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                forceRedirectUrl={HOME_URL}
                fallbackRedirectUrl={HOME_URL}
                appearance={clerkAppearance}
              />
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
