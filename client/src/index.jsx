import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createTheme } from "@mui/material";
import { Provider } from "react-redux";
import store from "./redux/store";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#149121",
      light: "skyblue",
    },
    secondary: {
      main: "#4f8255",
    },
    otherColor: {
      main: "#999",
    },
    text: {
      primary: "#16191f",
      secondary: "#1e2129",
      error: "#FF0000",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <NotificationProvider>
      <CartProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <App />
          </SnackbarProvider>
        </ThemeProvider>
      </CartProvider>
    </NotificationProvider>
  </Provider>
);
