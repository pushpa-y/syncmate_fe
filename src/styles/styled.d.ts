import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    name: "light" | "dark";
    bg: string;
    cardBg: string;
    sidebarBg: string;
    surface: string;
    text: string;
    textMuted: string;
    muted: string;
    accent: string;
    glassBorder: string;
    cardShadow: string;
  }
}
