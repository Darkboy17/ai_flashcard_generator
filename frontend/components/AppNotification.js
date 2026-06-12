"use client";

import { Alert, AlertTitle, Snackbar } from "@mui/material";

const notificationStyles = {
  success: {
    border: "#b7d7bf",
    background: "#f3fbf3",
    title: "#173f22",
    text: "#34543b",
  },
  error: {
    border: "#e7b8aa",
    background: "#fff5f1",
    title: "#6d2414",
    text: "#714337",
  },
  warning: {
    border: "#e5cc83",
    background: "#fff9e8",
    title: "#5d4611",
    text: "#69562a",
  },
  info: {
    border: "#d4c6a9",
    background: "#fffdf4",
    title: "#10100f",
    text: "#5c5547",
  },
};

export default function AppNotification({ notification, onClose }) {
  const severity = notification?.severity || "info";
  const styles = notificationStyles[severity] || notificationStyles.info;

  const handleClose = (_event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    onClose?.();
  };

  return (
    <Snackbar
      open={Boolean(notification?.open)}
      autoHideDuration={severity === "error" ? 7000 : 4500}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{
        top: { xs: 12, sm: 18 },
        width: { xs: "calc(100% - 24px)", sm: "auto" },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="outlined"
        icon={false}
        sx={{
          width: { xs: "100%", sm: 460 },
          maxWidth: "100%",
          borderRadius: 2,
          borderColor: styles.border,
          bgcolor: styles.background,
          color: styles.text,
          boxShadow: "0 18px 50px rgba(21, 32, 28, 0.14)",
          alignItems: "flex-start",
          "& .MuiAlert-message": {
            width: "100%",
            py: 0.25,
          },
          "& .MuiAlert-action": {
            pt: 0.4,
          },
        }}
      >
        {notification?.title && (
          <AlertTitle
            sx={{
              color: styles.title,
              fontWeight: 950,
              lineHeight: 1.2,
              mb: notification?.message ? 0.4 : 0,
            }}
          >
            {notification.title}
          </AlertTitle>
        )}
        {notification?.message}
      </Alert>
    </Snackbar>
  );
}
