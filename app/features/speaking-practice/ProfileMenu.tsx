"use client";

import { useEffect, useRef, useState } from "react";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import styles from "./ProfileMenu.module.css";

type ProfileMenuProps = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

export default function ProfileMenu({ theme, onToggleTheme }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuRef.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className={styles.profileMenu} ref={menuRef}>
      <button
        className={styles.profileButton}
        type="button"
        aria-label="Open profile menu"
        aria-expanded={open}
        aria-controls="profile-options"
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="3.3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5.5 20c.4-3.4 2.7-5.2 6.5-5.2s6.1 1.8 6.5 5.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <div
        className={styles.menuCard + (open ? " " + styles.menuOpen : "")}
        id="profile-options"
        aria-label="Profile options"
        aria-hidden={!open}
      >
        <a className={styles.menuItem} href="/guide" onClick={() => setOpen(false)}>
          <span className={styles.menuIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 4.5h10.5A3.5 3.5 0 0 1 19 8v11.5H8.5A3.5 3.5 0 0 1 5 16V4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M8 8h7m-7 3.5h7m-7 3.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </span>
          <span className={styles.itemCopy}><strong>Practice guide</strong><small>Tips to get the most from each round</small></span>
          <svg className={styles.chevron} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7.5 4.5 5 5.5-5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
        <div className={styles.menuDivider} />
        <div className={styles.menuItem}>
          <span className={styles.menuIcon} aria-hidden="true">
            {theme === "dark"
              ? <svg viewBox="0 0 24 24" fill="none"><path d="M19.2 15.3A8 8 0 0 1 8.7 4.8a8 8 0 1 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
              : <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M12 2.8v2m0 14.4v2m9.2-9.2h-2m-14.4 0h-2m15.7-6.5-1.4 1.4M6.9 17.1l-1.4 1.4m13 0-1.4-1.4m-10.2-10L5.5 5.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>}
          </span>
          <span className={styles.itemCopy}><strong>Appearance</strong><small>{theme === "dark" ? "Dark mode" : "Light mode"}</small></span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </div>
  );
}
