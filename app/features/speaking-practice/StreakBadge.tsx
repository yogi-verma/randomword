"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getDailyStreakSnapshot, getServerDailyStreakSnapshot, subscribeToDailyStreak } from "./dailyStreak";
import styles from "./StreakBadge.module.css";

function formatLastActive(date: string | null) {
  if (!date) return "Not yet";
  const today = new Date();
  const todayKey = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const yesterdayKey = [yesterday.getFullYear(), String(yesterday.getMonth() + 1).padStart(2, "0"), String(yesterday.getDate()).padStart(2, "0")].join("-");
  if (date === todayKey) return "Today";
  if (date === yesterdayKey) return "Yesterday";
  return new Date(date + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function StreakBadge() {
  const streak = useSyncExternalStore(subscribeToDailyStreak, getDailyStreakSnapshot, getServerDailyStreakSnapshot);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const countLabel = streak.streak + " " + (streak.streak === 1 ? "day" : "days");
  const accessibleLabel = streak.activeToday
    ? countLabel + " speaking streak active today"
    : streak.streak > 0
      ? countLabel + " speaking streak. Complete a one-minute round today to keep it going."
      : "No active speaking streak. Complete a one-minute round to start one.";

  useEffect(() => {
    if (!detailsOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) setDetailsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [detailsOpen]);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={() => setDetailsOpen(true)}
      onMouseLeave={() => setDetailsOpen(false)}
      onFocus={() => setDetailsOpen(true)}
    >
      <button
        className={styles.badge + (streak.activeToday ? " " + styles.active : "")}
        type="button"
        aria-label={accessibleLabel}
        aria-expanded={detailsOpen}
        aria-controls="streak-details"
        onClick={() => setDetailsOpen(true)}
      >
        <svg className={styles.flame} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.2 2.6c.4 3-1.2 4.6-3 6.3C7.5 10.5 6 12.2 6 15a6 6 0 0 0 12 0c0-3.7-2.3-7-5.8-12.4Z" fill="currentColor" opacity=".8" />
          <path d="M12 12.3c.2 1.4-.6 2.1-1.2 2.9a3.1 3.1 0 1 0 5.4 2c0-1.7-1-3.1-2.6-5.2-.1 1-.6 1.4-1.6 2.1" fill="currentColor" opacity=".55" />
        </svg>
        <span className={styles.count}>{streak.streak}</span>
      </button>
      <section
        className={styles.popover + (detailsOpen ? " " + styles.popoverOpen : "")}
        id="streak-details"
        aria-label="Speaking streak details"
        aria-hidden={!detailsOpen}
      >
        <div className={styles.popoverHeading}>
          <h2>Your streak</h2>
          <span className={styles.todayStatus + (streak.activeToday ? " " + styles.todayActive : "")}>
            {streak.activeToday ? "Active today" : "Not active today"}
          </span>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><strong>{streak.streak}</strong><span>Current streak</span></div>
          <div className={styles.stat}><strong>{streak.longestStreak}</strong><span>Longest streak</span></div>
          <div className={styles.stat}><strong>{streak.totalCompleted}</strong><span>One-minute rounds</span></div>
          <div className={styles.stat}><strong className={styles.lastActive}>{formatLastActive(streak.lastActiveDate)}</strong><span>Last active</span></div>
        </div>
        <p className={styles.tip}>{streak.activeToday
          ? streak.completedToday + " " + (streak.completedToday === 1 ? "round" : "rounds") + " completed today. Come back tomorrow to keep your streak alive."
          : "Complete a one-minute speaking round to start or continue your daily streak."}</p>
      </section>
    </div>
  );
}
