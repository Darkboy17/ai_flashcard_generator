"use client";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

export default function FlippableFlashcard({ flashcard, flipped, onClick }) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid var(--app-border)",
        bgcolor: "var(--app-card)",
        boxShadow: "0 18px 48px var(--app-shadow)",
        overflow: "hidden",
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardContent sx={{ p: 2 }}>
          <Box
            sx={{
              perspective: "1000px",
              "& > div": {
                transition: "transform 0.6s",
                transformStyle: "preserve-3d",
                position: "relative",
                width: "100%",
                minHeight: 210,
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                backfaceVisibility: "hidden",
              },
              "& > div > div": {
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
                boxSizing: "border-box",
                textAlign: "center",
                borderRadius: 1.5,
              },
              "& > div > div:nth-of-type(2)": {
                transform: "rotateY(180deg)",
                bgcolor: "var(--app-board)",
                color: "var(--app-board-text)",
              },
              "& > div > div:nth-of-type(1)": {
                bgcolor: "var(--app-card)",
                color: "var(--app-text)",
                border: "1px solid var(--app-border)",
              },
            }}
          >
            <div>
              <div>
                <Typography
                  component="div"
                  sx={{ fontSize: 20, fontWeight: 900, lineHeight: 1.3 }}
                >
                  {flashcard.front}
                </Typography>
              </div>
              <div>
                <Typography
                  component="div"
                  sx={{ fontSize: 18, fontWeight: 800, lineHeight: 1.45 }}
                >
                  {flashcard.back}
                </Typography>
              </div>
            </div>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
