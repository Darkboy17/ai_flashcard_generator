"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@mui/material";
import Link from "next/link";

import AppShell from "@/components/AppShell";
import AppStatePanel from "@/components/AppStatePanel";
import FlashcardGrid from "@/components/FlashcardGrid";
import { getFlashcardsByCollection } from "@/services/flashcardCollections";

export default function FlashcardSetPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const collectionName = searchParams.get("id");

  useEffect(() => {
    async function loadFlashcards() {
      if (!isLoaded) return;

      if (!collectionName || !isSignedIn || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const savedFlashcards = await getFlashcardsByCollection(
        user.id,
        collectionName
      );
      setFlashcards(savedFlashcards);
      setIsLoading(false);
    }

    loadFlashcards();
  }, [collectionName, isLoaded, isSignedIn, user]);

  const handleCardClick = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <AppShell
      eyebrow="Review"
      title={collectionName || "Flashcard collection"}
      subtitle="Click each card to flip between the prompt and the answer."
      action={
        <Button
          component={Link}
          href="/flashcards"
          variant="outlined"
          sx={{
            borderColor: "var(--app-border)",
            color: "var(--app-text)",
            borderRadius: 999,
            px: 3,
            py: 1.1,
            textTransform: "none",
            fontWeight: 900,
            "&:hover": {
              borderColor: "var(--app-accent)",
              bgcolor: "var(--app-hover)",
            },
          }}
        >
          Back to collections
        </Button>
      }
    >
      {!isLoaded || isLoading ? (
        <AppStatePanel title="Loading flashcards..." loading />
      ) : !isSignedIn ? (
        <AppStatePanel
          title="Sign in to review collections."
          body="Flashcard collections are connected to your account."
        />
      ) : flashcards.length > 0 ? (
        <FlashcardGrid
          flashcards={flashcards}
          flippedCards={flippedCards}
          onCardClick={handleCardClick}
        />
      ) : (
        <AppStatePanel
          title="This collection is empty."
          body="Generate and save a new deck to add cards to your study library."
        />
      )}
    </AppShell>
  );
}
