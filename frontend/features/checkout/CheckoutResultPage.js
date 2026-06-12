"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@mui/material";
import Link from "next/link";

import AppShell from "@/components/AppShell";
import AppStatePanel from "@/components/AppStatePanel";
import { getCheckoutSession } from "@/services/checkout";

export default function CheckoutResultPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCheckoutSession() {
      if (!isLoaded) {
        return;
      }

      if (!sessionId) {
        setLoading(false);
        setError("Session ID is required.");
        return;
      }

      if (!isSignedIn) {
        setLoading(false);
        setError("Please sign in to verify this payment.");
        return;
      }

      try {
        const authToken = await getToken();
        const sessionData = await getCheckoutSession(sessionId, authToken);
        setSession(sessionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCheckoutSession();
  }, [getToken, isLoaded, isSignedIn, sessionId]);

  if (loading) {
    return (
      <AppShell eyebrow="Checkout" title="Checking your payment.">
        <AppStatePanel title="Loading payment status..." loading />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell eyebrow="Checkout" title="Payment status">
        <AppStatePanel
          tone="error"
          title="We could not verify that payment."
          body={error}
          action={<ResultButton href="/" label="Return home" />}
        />
      </AppShell>
    );
  }

  return (
    <AppShell eyebrow="Checkout" title="Payment status">
      {session?.payment_status === "paid" ? (
        <AppStatePanel
          tone="success"
          title="Thank you for your purchase."
          body={`Payment received. Session ID: ${sessionId}`}
          action={<ResultButton href="/generate" label="Generate flashcards" />}
        />
      ) : (
        <AppStatePanel
          tone="error"
          title="Payment failed."
          body="Your payment was not successful. Please try again."
          action={<ResultButton href="/" label="Return home" />}
        />
      )}
    </AppShell>
  );
}

function ResultButton({ href, label }) {
  return (
    <Button
      component={Link}
      href={href}
      variant="contained"
      sx={{
        bgcolor: "#10100f",
        borderRadius: 999,
        px: 3,
        textTransform: "none",
        fontWeight: 900,
        boxShadow: "none",
        "&:hover": { bgcolor: "#272724", boxShadow: "none" },
      }}
    >
      {label}
    </Button>
  );
}
