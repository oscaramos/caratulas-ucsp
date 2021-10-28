import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import { ErrorSnackProvider } from "hooks/useErrorSnack";

import App from "pages/App";

import * as serviceWorker from "./serviceWorker";
import theme from "./theme";

ReactGA.initialize("UA-160924990-2");

ReactDOM.render(
  <React.StrictMode>
    <ErrorSnackProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ErrorSnackProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
