/* eslint-disable react-refresh/only-export-components */
import { createGlobalStyle } from "styled-components";
import type { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
  name: "light",
  bg: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
  surface: "rgba(255,255,255,0.65)",
  text: "#0f172a",
  muted: "#64748b",
  accent: "#4f46e5",
  glassBorder: "rgba(255,255,255,0.6)",
  cardShadow: "0 10px 30px rgba(15,23,42,0.06)",
  cardBg: "rgba(255,255,255,0.8)",
  sidebarBg: "rgba(255,255,255,0.9)",
};

export const darkTheme: DefaultTheme = {
  name: "dark",
  bg: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
  surface: "rgba(30, 41, 59, 0.4)",
  text: "#e6eef8",
  muted: "#94a3b8",
  accent: "#7c3aed",
  glassBorder: "rgba(255, 255, 255, 0.08)",
  cardShadow: "0 10px 30px rgba(2,6,23,0.6)",
  cardBg: "rgba(23, 30, 48, 0.7)",
  sidebarBg: "rgba(15,20,30,0.95)",
};

export const GlobalStyle = createGlobalStyle<{ theme: any }>`
  html,body,#root { height:100%; }
  body {
    margin: 0;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    background: ${(p) => p.theme.bg};
    color: ${(p) => p.theme.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background .25s ease, color .25s ease;
  }

  /* glass helper */
  .glass {
    background: ${(p) => p.theme.surface};
    backdrop-filter: blur(8px) saturate(120%);
    -webkit-backdrop-filter: blur(8px) saturate(120%);
    border: 1px solid ${(p) => p.theme.glassBorder};
    box-shadow: ${(p) => p.theme.cardShadow};
  }

  /* utility small */
  .muted { color: ${(p) => p.theme.muted}; }
`;
