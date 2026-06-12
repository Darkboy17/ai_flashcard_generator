"use client";

import { Grid } from "@mui/material";

import FlippableFlashcard from "@/components/FlippableFlashcard";

export default function FlashcardGrid({ flashcards, flippedCards, onCardClick }) {
  return (
    <Grid container spacing={2.5}>
      {flashcards.map((flashcard, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={flashcard.id || `${flashcard.front}-${index}`}
        >
          <FlippableFlashcard
            flashcard={flashcard}
            flipped={Boolean(flippedCards[index])}
            onClick={() => onCardClick(index)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
