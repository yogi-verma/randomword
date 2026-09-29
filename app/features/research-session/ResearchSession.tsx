import { useEffect, useState } from "react";
import styles from "./ResearchSession.module.css";

type ResearchSessionProps = {
  open: boolean;
  minutes: number;
  word: string;
  theme: "dark" | "light";
  onDone: () => void;
  onClose: () => void;
};

export default function ResearchSession({ open, minutes, word, theme, onDone, onClose }: ResearchSessionProps) {
  const [seconds, setSeconds] = useState(minutes * 60);
  const totalSeconds = minutes * 60;
  const elapsed = totalSeconds - seconds;
  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0;

  useEffect(() => {
    if (!open) {
      setSeconds(totalSeconds);
      return;
    }

    setSeconds(totalSeconds);
    let interval = 0;
    interval = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [open, totalSeconds]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;

  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className={`${styles.overlay} ${styles[theme]}`} role="presentation">
      <section className={styles.card} role="dialog" aria-modal="true" aria-label="Research session">
        <div className={styles.content}>
          <span className={styles.eyebrow}>YOUR WORD</span>
          <h1 className={styles.prompt}>{word}</h1>
          <p className={styles.description}>Take your time. Explore the idea, gather your thoughts, then come back ready to speak.</p>
          <div className={styles.clock} aria-live="polite">
            <div className={styles.clockTrack} style={{ background: `conic-gradient(var(--clock-accent) 0deg ${progress * 360}deg, var(--clock-track) ${progress * 360}deg 360deg)` }}>
              <div className={styles.clockFace}>
                <span className={styles.time}>{formattedTime}</span>
                <span className={styles.clockCaption}>{seconds === 0 ? "TIME TO SPEAK" : "RESEARCH TIME"}</span>
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <button className={styles.doneButton} onClick={onDone}>Done Research <span aria-hidden="true">→</span></button>
            <button className={styles.closeButton} onClick={onClose}>Close</button>
          </div>
        </div>
      </section>
    </div>
  );
}
