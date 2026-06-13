// theme.ts
import { createTheme } from "@mui/material/styles";

const baseColors = {
  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate300: "#cbd5e1",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1e293b",
  slate900: "#0f172a",
  slate950: "#020617",

  sky50: "#f0f9ff",
  sky100: "#e0f2fe",
  sky200: "#bae6fd",
  sky300: "#7dd3fc",
  sky400: "#38bdf8",
  sky500: "#0ea5e9",
  sky600: "#0284c7",
  sky700: "#0369a1",
  sky800: "#075985",
  sky900: "#0c4a6e",

  blue50: "#eff6ff",
  blue100: "#dbeafe",
  blue200: "#bfdbfe",
  blue300: "#93c5fd",
  blue400: "#60a5fa",
  blue500: "#3b82f6",
  blue600: "#2563eb",
  blue700: "#1d4ed8",
  blue800: "#1e40af",
  blue900: "#1e3a8a",
};

// 🌞 Light Theme (MudBlazor style mapping)
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: baseColors.blue600,
      light: baseColors.blue500,
      dark: baseColors.blue700,
    },
    secondary: {
      main: "rgba(255, 64, 129, 1)",
      light: "rgb(255, 102, 153)",
      dark: "rgb(255, 31, 105)",
    },
    success: {
      main: "rgba(0, 200, 83, 1)",
      light: "rgb(0, 235, 98)",
      dark: "rgb(0, 163, 68)",
      contrastText: "#ffffff",
    },
    error: {
      main: "rgba(244, 67, 54, 1)",
      light: "rgb(246, 96, 85)",
      dark: "rgb(242, 28, 13)",
    },
    warning: {
      main: "rgba(255, 152, 0, 1)",
      light: "rgb(255, 167, 36)",
      dark: "rgb(214, 129, 0)",
      contrastText: "#ffffff",
    },
    info: {
      main: "rgba(33, 150, 243, 1)",
      light: "rgb(71, 167, 245)",
      dark: "rgb(12, 128, 223)",
    },
    background: {
      default: baseColors.slate100, // page
      paper: baseColors.slate50,
    },
    text: {
      primary: "rgba(66, 66, 66, 1)",
      secondary: "rgba(66, 84, 102, 1)",
    },

    common: {
      black: "rgba(17, 14, 45, 1)",
      white: "rgba(255, 255, 255, 1)",
    },

    divider: "rgba(224, 224, 224, 1)",
  },

  // shape: {
  //   borderRadius: 12, // nice modern UI
  // },

  // typography: {
  //   fontFamily: "Inter, Roboto, sans-serif",
  // },
});

// 🌙 Dark Theme (same structure, just swapped values)
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: baseColors.blue500,
      light: baseColors.blue400,
      dark: baseColors.blue600,
    },
    secondary: {
      main: "rgba(255, 64, 129, 1)",
      light: "rgb(255, 102, 153)",
      dark: "rgb(255, 31, 105)",
    },

    success: {
      main: "rgba(11, 186, 131, 1)",
      light: "rgb(13, 222, 156)",
      dark: "rgb(9, 154, 108)",
      contrastText: "#ffffff",
    },
    error: {
      main: "rgba(246, 78, 98, 1)",
      light: "rgb(248, 119, 134)",
      dark: "rgb(244, 47, 70)",
    },
    warning: {
      main: "rgba(255, 168, 0, 1)",
      light: "rgb(255, 182, 36)",
      dark: "rgb(214, 143, 0)",
      contrastText: "#ffffff",
    },
    info: {
      main: "rgba(50, 153, 255, 1)",
      light: "rgb(92, 173, 255)",
      dark: "rgb(10, 133, 255)",
      contrastText: "#ffffff",
    },
    background: {
      default: baseColors.slate950, // page
      paper: baseColors.slate900, // surface/cards
    },

    text: {
      primary: "rgba(255, 255, 255, 1)",
      secondary: "rgba(146, 146, 159, 1)",
    },

    common: {
      black: "rgba(17, 16, 25, 1)",
      white: "rgba(255, 255, 255, 1)",
    },

    divider: "rgba(92, 92, 106, 1)",
  },

  // shape: {
  //   borderRadius: 12,
  // },

  // typography: {
  //   fontFamily: "Inter, Roboto, sans-serif",
  // },
});
