"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AppNotification from "@/components/AppNotification";
import AppShell from "@/components/AppShell";
import AppStatePanel from "@/components/AppStatePanel";
import FlashcardGrid from "@/components/FlashcardGrid";
import { generateFlashcards } from "@/services/flashcardGenerator";
import { saveFlashcardCollection } from "@/services/flashcardCollections";

const promptExamples = [
  "Organic chemistry functional groups",
  "World War II causes and effects",
  "JavaScript array methods",
];

export default function GeneratePage() {
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState({ open: false });
  const router = useRouter();

  const notify = ({ severity = "info", title, message }) => {
    setNotification({
      open: true,
      severity,
      title,
      message,
    });
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      notify({
        severity: "warning",
        title: "Prompt needed",
        message: "Write a topic, paste notes, or describe the cards you want.",
      });
      return;
    }

    if (!isSignedIn) {
      notify({
        severity: "warning",
        title: "Sign in required",
        message: "Please sign in before generating flashcards.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const authToken = await getToken();
      const data = await generateFlashcards(text, {
        authToken,
        userEmail: getUserEmail(user),
      });
      setFlashcards(data);
      setFlippedCards({});
      notify({
        severity: "success",
        title: "Flashcards generated",
        message: "Review the cards, then save the set when it looks right.",
      });
    } catch (error) {
      console.error("Error generating flashcards:", error);
      notify({
        severity: "error",
        title: "Generation failed",
        message:
          error.message || "An error occurred while generating flashcards.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCardClick = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSave = async () => {
    if (!user) {
      notify({
        severity: "warning",
        title: "Sign in required",
        message: "Please sign in before saving flashcards to your collection.",
      });
      return;
    }

    if (!name.trim()) {
      notify({
        severity: "warning",
        title: "Name this collection",
        message: "Add a short deck name so it is easy to find later.",
      });
      return;
    }

    try {
      await saveFlashcardCollection({
        userId: user.id,
        name: name.trim(),
        flashcards,
      });
      setOpen(false);
      setName("");
      notify({
        severity: "success",
        title: "Collection saved",
        message: "Your flashcards are now in collections.",
      });
      router.push("/flashcards");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      notify({
        severity: "error",
        title: "Save failed",
        message: error.message || "An error occurred while saving flashcards.",
      });
    }
  };

  return (
    <AppShell
      eyebrow="Generate"
      title="Write a prompt. Build a study set."
      subtitle="Describe any topic, paste notes, or ask for exam prep. The AI will turn your request into concise flashcards."
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "420px minmax(0, 1fr)" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Stack
          spacing={2.5}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 2,
            bgcolor: "#10100f",
            color: "#fbf5df",
            border: "8px solid #76573d",
            boxShadow: "0 20px 60px rgba(21, 32, 28, 0.16)",
          }}
        >
          <Box>
            <Typography sx={{ color: "#f1d27a", fontWeight: 950, mb: 1 }}>
              Prompt board
            </Typography>
            <Typography sx={{ color: "rgba(251,245,223,0.72)", lineHeight: 1.6 }}>
              Be specific about the topic, level, and goal. The better the
              prompt, the sharper the deck.
            </Typography>
          </Box>

          <TextField
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Example: Create flashcards about the causes of the French Revolution for a high-school history exam."
            fullWidth
            multiline
            minRows={7}
            variant="outlined"
            sx={{
              bgcolor: "var(--app-field-bg)",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                alignItems: "flex-start",
                fontWeight: 650,
                color: "var(--app-field-text)",
                "& fieldset": {
                  borderColor: "var(--app-border)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--app-accent)",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "var(--app-muted)",
                opacity: 1,
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isGenerating}
            fullWidth
            sx={{
              bgcolor: "#f1d27a",
              color: "#10100f",
              borderRadius: 999,
              py: 1.25,
              boxShadow: "none",
              textTransform: "none",
              fontWeight: 950,
              "&:hover": { bgcolor: "#e6c05e", boxShadow: "none" },
              "&.Mui-disabled": { bgcolor: "#9a8b61", color: "#28231a" },
            }}
          >
            {isGenerating ? "Generating..." : "Generate flashcards"}
          </Button>

          <Stack spacing={1}>
            {promptExamples.map((example) => (
              <Button
                key={example}
                onClick={() => setText(example)}
                sx={{
                  justifyContent: "flex-start",
                  color: "#fbf5df",
                  border: "1px solid rgba(251,245,223,0.18)",
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 750,
                  "&:hover": { bgcolor: "rgba(251,245,223,0.08)" },
                }}
              >
                {example}
              </Button>
            ))}
          </Stack>
        </Stack>

        <Box>
          {flashcards.length > 0 ? (
            <Stack spacing={2.5}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography
                    component="h2"
                    sx={{ fontSize: 28, fontWeight: 950, lineHeight: 1.1 }}
                  >
                    Generated flashcards
                  </Typography>
                  <Typography sx={{ color: "var(--app-muted)", mt: 0.5 }}>
                    Click a card to flip between prompt and answer.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => setOpen(true)}
                  sx={{
                    bgcolor: "var(--app-primary-bg)",
                    color: "var(--app-primary-text)",
                    borderRadius: 999,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 900,
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "var(--app-primary-hover)",
                      boxShadow: "none",
                    },
                  }}
                >
                  Save collection
                </Button>
              </Stack>
              <FlashcardGrid
                flashcards={flashcards}
                flippedCards={flippedCards}
                onCardClick={handleCardClick}
              />
            </Stack>
          ) : (
            <AppStatePanel
              title="Your generated deck will appear here."
              body="Start with a topic on the prompt board. Once generated, you can review each card and save the full collection."
            />
          )}
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: "var(--app-card)",
            color: "var(--app-text)",
            border: "1px solid var(--app-border)",
            boxShadow: "0 28px 80px rgba(21, 32, 28, 0.24)",
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            bgcolor: "rgba(16, 16, 15, 0.58)",
            backdropFilter: "blur(3px)",
          },
        }}
      >
        <Box
          sx={{
            bgcolor: "#10100f",
            color: "#fbf5df",
            borderBottom: "6px solid #76573d",
            px: 3,
            pt: 2.5,
            pb: 2,
          }}
        >
          <DialogTitle sx={{ p: 0, fontWeight: 950, lineHeight: 1.1 }}>
            Save collection
          </DialogTitle>
          <Typography sx={{ color: "rgba(251,245,223,0.72)", mt: 0.8 }}>
            Name this deck so you can find it in your collections.
          </Typography>
        </Box>
        <DialogContent sx={{ px: 3, pt: 3 }}>
          <DialogContentText
            sx={{
              color: "var(--app-muted)",
              mb: 1.5,
              fontWeight: 700,
            }}
          >
            Collection details
          </DialogContentText>
          <TextField
            autoFocus
            label="Collection name"
            type="text"
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "var(--app-field-bg)",
                color: "var(--app-field-text)",
                borderRadius: 1.25,
                fontWeight: 750,
                "& fieldset": {
                  borderColor: "var(--app-border)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "var(--app-muted)",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              color: "var(--app-muted)",
              borderRadius: 999,
              px: 2.5,
              textTransform: "none",
              fontWeight: 850,
              "&:hover": { bgcolor: "var(--app-hover)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              bgcolor: "var(--app-primary-bg)",
              color: "var(--app-primary-text)",
              borderRadius: 999,
              px: 2.8,
              textTransform: "none",
              fontWeight: 900,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "var(--app-primary-hover)",
                boxShadow: "none",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <AppNotification
        notification={notification}
        onClose={() => setNotification((current) => ({ ...current, open: false }))}
      />
    </AppShell>
  );
}

function getUserEmail(user) {
  return (
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress
  );
}
