import styles from "./ThemeToggle.module.css";

type ThemeToggleProps = {
  theme: "dark" | "light";
  onToggle: () => void;
};

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button className={`theme-button theme-toggle${theme === "light" ? " is-light" : ""} ${styles.themeToggleFeature}`} onClick={onToggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} aria-pressed={theme === "light"} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
      <span className="theme-toggle-icon theme-sun" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7"/><path d="M12 2.8v2m0 14.4v2m9.2-9.2h-2m-14.4 0h-2m15.7-6.5-1.4 1.4M6.9 17.1l-1.4 1.4m13 0-1.4-1.4m-10.2-10L5.5 5.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg></span>
      <span className="theme-toggle-icon theme-moon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M19.2 15.3A8 8 0 0 1 8.7 4.8a8 8 0 1 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="m17.2 3.5.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4Z" fill="currentColor"/></svg></span>
      <span className="theme-toggle-thumb" aria-hidden="true" />
    </button>
  );
}
