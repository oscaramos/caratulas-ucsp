import React, { createContext, ReactNode, useContext, useState } from "react";
import Alert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

const ErrorSnackContext = createContext<
  { showError: (message: string) => void } | undefined
>(undefined);

export function ErrorSnackProvider({ children }: { children: ReactNode }) {
  const [openSnack, setOpenSnack] = useState(false);
  const [messageSnack, setMessageSnack] = useState("");

  const handleCloseSnack = (
    event: React.SyntheticEvent<any>,
    reason?: string
  ) => {
    if (reason !== "clickaway") {
      setOpenSnack(false);
    }
  };

  const showError = (message: string) => {
    setOpenSnack(true);
    setMessageSnack(message);
  };

  return (
    <ErrorSnackContext.Provider value={{ showError }}>
      {children}

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnack}
        onClose={handleCloseSnack}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={handleCloseSnack}
        >
          {messageSnack}
        </Alert>
      </Snackbar>
    </ErrorSnackContext.Provider>
  );
}

export function useErrorSnack() {
  const context = useContext(ErrorSnackContext);
  if (context === undefined) {
    throw new Error("useErrorSnack must be within a ErrorSnackProvider");
  }
  return context;
}
