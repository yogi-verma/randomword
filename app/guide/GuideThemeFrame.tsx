"use client";

import type { ReactNode } from "react";
import styles from "./Guide.module.css";
import { useTheme } from "../features/theme-toggle/ThemeProvider";

export default function GuideThemeFrame({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return <main className={`${styles.page} theme-${theme}`}>{children}</main>;
}
