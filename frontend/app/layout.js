import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const clerkLocalization = {
  unstable__errors: {
    form_identifier_exists:
      "You already have an account. Please sign in instead.",
    form_identifier_exists__email_address:
      "You already have an account. Please sign in instead.",
  },
};

export const metadata = {
  title: "AI Flashcard Generator",
  description: "Create flashcards from your text with AI.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={clerkLocalization}>
      <html lang="en">
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  var mode = localStorage.getItem("ai-flashcards-color-mode");
                  if (!mode && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    mode = "dark";
                  }
                  document.documentElement.dataset.theme = mode || "light";
                } catch (_) {
                  document.documentElement.dataset.theme = "light";
                }
              `,
            }}
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
