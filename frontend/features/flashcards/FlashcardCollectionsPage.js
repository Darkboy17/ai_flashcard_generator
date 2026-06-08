"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import Link from "next/link";

import AppNotification from "@/components/AppNotification";
import AppShell from "@/components/AppShell";
import AppStatePanel from "@/components/AppStatePanel";
import {
  deleteFlashcardCollection,
  getFlashcardCollections,
} from "@/services/flashcardCollections";

export default function FlashcardCollectionsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState({ open: false });
  const router = useRouter();

  useEffect(() => {
    async function loadCollections() {
      if (!isLoaded) return;

      if (!isSignedIn || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const savedCollections = await getFlashcardCollections(user.id);
      setCollections(savedCollections);
      setIsLoading(false);
    }

    loadCollections();
  }, [isLoaded, isSignedIn, user]);

  const notify = ({ severity = "info", title, message }) => {
    setNotification({ open: true, severity, title, message });
  };

  const handleDeleteDeck = async () => {
    if (!user || !collectionToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteFlashcardCollection({
        userId: user.id,
        name: collectionToDelete.name,
      });
      setCollections((currentCollections) =>
        currentCollections.filter(
          (collection) => collection.name !== collectionToDelete.name,
        ),
      );
      notify({
        severity: "success",
        title: "Deck deleted",
        message: `${collectionToDelete.name} was removed from your collections.`,
      });
      setCollectionToDelete(null);
    } catch (error) {
      notify({
        severity: "error",
        title: "Delete failed",
        message: error.message || "The deck could not be deleted.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppShell
      eyebrow="Collections"
      title="Your saved study decks."
      subtitle="Open a collection to review cards from previous prompts."
      action={
        <Button
          component={Link}
          href="/generate"
          variant="contained"
          sx={{
            bgcolor: "var(--app-primary-bg)",
            color: "var(--app-primary-text)",
            borderRadius: 999,
            px: 3,
            py: 1.1,
            textTransform: "none",
            fontWeight: 900,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "var(--app-primary-hover)",
              boxShadow: "none",
            },
          }}
        >
          Generate new deck
        </Button>
      }
    >
      {!isLoaded || isLoading ? (
        <AppStatePanel title="Loading collections..." loading />
      ) : !isSignedIn ? (
        <AppStatePanel
          title="Sign in to view collections."
          body="Saved decks are connected to your account."
          action={
            <Button
              component={Link}
              href="/"
              variant="contained"
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
              Go to login
            </Button>
          }
        />
      ) : collections.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {collections.map((collection, index) => (
            <Card
              key={collection.name}
              sx={{
                position: "relative",
                borderRadius: 2,
                border: "1px solid var(--app-border)",
                bgcolor: "var(--app-card)",
                color: "var(--app-text)",
                boxShadow: "0 18px 48px var(--app-shadow)",
                overflow: "hidden",
                "&:hover .deck-delete-button, &:focus-within .deck-delete-button":
                  {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
              }}
            >
              <IconButton
                aria-label={`Delete ${collection.name}`}
                className="deck-delete-button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setCollectionToDelete(collection);
                }}
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  zIndex: 2,
                  width: 38,
                  height: 38,
                  opacity: { xs: 1, md: 0 },
                  transform: { xs: "translateY(0)", md: "translateY(-4px)" },
                  transition: "opacity 160ms ease, transform 160ms ease",
                  bgcolor: "#fff5f1",
                  color: "#8f2f18",
                  border: "1px solid #e7b8aa",
                  "&:hover": {
                    bgcolor: "#ffe7df",
                  },
                }}
              >
                <TrashIcon />
              </IconButton>
              <CardActionArea
                onClick={() =>
                  router.push(
                    `/flashcard?id=${encodeURIComponent(collection.name)}`,
                  )
                }
                sx={{ height: "100%" }}
              >
                <CardContent sx={{ p: 3, minHeight: 180 }}>
                  <Typography
                    sx={{ color: "var(--app-accent)", fontWeight: 950, mb: 2 }}
                  >
                    Deck {index + 1}
                  </Typography>
                  <Typography
                    component="h2"
                    sx={{
                      color: "var(--app-text)",
                      fontSize: 28,
                      fontWeight: 950,
                      lineHeight: 1.05,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {collection.name}
                  </Typography>
                  <Typography sx={{ mt: 2, color: "var(--app-muted)" }}>
                    Open collection
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      ) : (
        <AppStatePanel
          title="No collections yet."
          body="Generate a deck and save it to start building your study library."
          action={
            <Button
              component={Link}
              href="/generate"
              variant="contained"
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
              Generate flashcards
            </Button>
          }
        />
      )}
      <DeleteDeckDialog
        collection={collectionToDelete}
        isDeleting={isDeleting}
        onCancel={() => setCollectionToDelete(null)}
        onConfirm={handleDeleteDeck}
      />
      <AppNotification
        notification={notification}
        onClose={() => setNotification((current) => ({ ...current, open: false }))}
      />
    </AppShell>
  );
}

function DeleteDeckDialog({ collection, isDeleting, onCancel, onConfirm }) {
  return (
    <Dialog
      open={Boolean(collection)}
      onClose={isDeleting ? undefined : onCancel}
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
          Delete deck?
        </DialogTitle>
        <Typography sx={{ color: "rgba(251,245,223,0.72)", mt: 0.8 }}>
          This will remove the deck and all flashcards inside it.
        </Typography>
      </Box>
      <DialogContent sx={{ px: 3, pt: 3 }}>
        <Typography sx={{ color: "var(--app-muted)", lineHeight: 1.7 }}>
          You are about to delete{" "}
          <Box component="span" sx={{ color: "var(--app-text)", fontWeight: 950 }}>
            {collection?.name}
          </Box>
          . This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button
          onClick={onCancel}
          disabled={isDeleting}
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
          onClick={onConfirm}
          disabled={isDeleting}
          variant="contained"
          sx={{
            bgcolor: "#8f2f18",
            borderRadius: 999,
            px: 2.8,
            textTransform: "none",
            fontWeight: 900,
            boxShadow: "none",
            "&:hover": { bgcolor: "#742511", boxShadow: "none" },
            "&.Mui-disabled": {
              bgcolor: "#d6b4aa",
              color: "#6d4a41",
            },
          }}
        >
          {isDeleting ? "Deleting..." : "Delete deck"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function TrashIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      sx={{ width: 19, height: 19, fill: "none", stroke: "currentColor" }}
    >
      <path
        d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10v6M14 10v6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Box>
  );
}
