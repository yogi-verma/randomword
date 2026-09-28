"use client";

import styles from "./StreakCelebration.module.css";
import type { StreakCompletion } from "./dailyStreak";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type StreakCelebrationProps = StreakCompletion & {
  onClose: () => void;
};

const followUpMessages = [
  "You stayed with your thoughts for a full minute. That’s real progress.",
  "Confidence is built in moments like this. Keep going.",
  "You did the hard part: you started and stayed with it.",
  "Your voice gets stronger every time you trust it. Take another round.",
  "One brave minute can change how you see your own voice.",
  "You’re proving you can keep going. Give yourself another minute.",
  "Every round makes speaking feel more natural. Keep building.",
  "That was a solid step forward. Your next one starts whenever you’re ready.",
];

function roundRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function drawWrappedText(context: CanvasRenderingContext2D, text: string, centerX: number, startY: number, maxWidth: number, lineHeight: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);

  lines.forEach((item, index) => context.fillText(item, centerX, startY + index * lineHeight));
}

function playCompletionChime() {
  try {
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    const audio = new AudioContextClass();
    void audio.resume().then(() => {
      const now = audio.currentTime;
      const notes = [
        { frequency: 659.25, start: 0, duration: 0.28 },
        { frequency: 783.99, start: 0.2, duration: 0.34 },
        { frequency: 987.77, start: 0.48, duration: 0.48 },
      ];

      notes.forEach(({ frequency, start, duration }) => {
        const oscillator = audio.createOscillator();
        const volume = audio.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        volume.gain.setValueAtTime(0.0001, now + start);
        volume.gain.exponentialRampToValueAtTime(0.055, now + start + 0.035);
        volume.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
        oscillator.connect(volume);
        volume.connect(audio.destination);
        oscillator.start(now + start);
        oscillator.stop(now + start + duration + 0.02);
      });

      window.setTimeout(() => void audio.close(), 1200);
    }).catch(() => {
      void audio.close();
    });
  } catch {
    // Some browsers block synthesized audio; the visual celebration still plays.
  }
}

function Fireworks() {
  const particles = Array.from({ length: 3 }, (_, burst) =>
    Array.from({ length: 12 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 12;
      const distance = 34 + ((index * 11 + burst * 7) % 30);
      return {
        "--travel-x": String(Math.cos(angle) * distance) + "px",
        "--travel-y": String(Math.sin(angle) * distance) + "px",
        "--burst-delay": String(burst * 130 + (index % 4) * 20) + "ms",
      } as CSSProperties;
    }),
  );

  return (
    <div className={styles.fireworks} aria-hidden="true">
      {particles.map((burst, burstIndex) => (
        <div className={styles.burst} key={burstIndex} style={{ "--burst-x": String(34 + burstIndex * 16) + "%" } as CSSProperties}>
          {burst.map((style, index) => <i className={styles.particle} key={index} style={style} />)}
        </div>
      ))}
    </div>
  );
}

function downloadCard(streak: number, completedToday: number, message: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) return;

  const background = context.createLinearGradient(0, 0, 1080, 1350);
  background.addColorStop(0, "#101a2d");
  background.addColorStop(1, "#172a45");
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const glow = context.createRadialGradient(540, 470, 20, 540, 470, 610);
  glow.addColorStop(0, "rgba(93, 145, 240, .24)");
  glow.addColorStop(1, "rgba(93, 145, 240, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  roundRect(context, 46, 46, 988, 1258, 38);
  context.strokeStyle = "rgba(170, 198, 244, .24)";
  context.lineWidth = 2;
  context.stroke();

  context.textAlign = "center";
  context.fillStyle = "#a9c6fb";
  context.font = "700 28px Arial, sans-serif";
  context.letterSpacing = "6px";
  context.fillText(completedToday === 1 ? "A MINUTE WELL SPENT" : "ANOTHER ROUND IN THE BOOKS", 540, 280);
  context.letterSpacing = "0px";

  if (completedToday === 1) {
    context.fillStyle = "#f2f6ff";
    context.font = "500 270px Georgia, serif";
    context.fillText(String(streak), 540, 640);
    context.fillStyle = "#91b6ff";
    context.font = "700 36px Arial, sans-serif";
    context.letterSpacing = "8px";
    context.fillText(streak === 1 ? "DAY STREAK" : "DAYS IN A ROW", 540, 715);
    context.letterSpacing = "0px";
    context.fillStyle = "#d4e0f5";
    context.font = "400 34px Arial, sans-serif";
    drawWrappedText(context, "Your first full minute today is complete. Come back tomorrow to keep your streak growing.", 540, 835, 800, 52);
  } else {
    context.fillStyle = "#f2f6ff";
    context.font = "600 64px Arial, sans-serif";
    drawWrappedText(context, message, 540, 545, 820, 82);
    context.fillStyle = "#a9c6fb";
    context.font = "700 30px Arial, sans-serif";
    context.letterSpacing = "4px";
    context.fillText(`TODAY'S ROUND ${completedToday}`, 540, 760);
    context.letterSpacing = "0px";
    context.fillStyle = "#d4e0f5";
    context.font = "400 34px Arial, sans-serif";
    context.fillText(`${streak} ${streak === 1 ? "day" : "days"} in your current streak`, 540, 850);
  }

  context.fillStyle = "rgba(213, 226, 250, .72)";
  context.font = "600 26px Arial, sans-serif";
  context.letterSpacing = "5px";
  context.fillText("RANDOMWORD.COOL", 540, 1190);

  const date = new Date();
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const link = document.createElement("a");
  link.download = `randomword-streak-${dateKey}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export default function StreakCelebration({ streak, completedToday, onClose }: StreakCelebrationProps) {
  const [shareStatus, setShareStatus] = useState("");
  const chimePlayed = useRef(false);
  const firstCompletionToday = completedToday === 1;
  const message = firstCompletionToday
    ? "Your first full minute today is complete."
    : followUpMessages[(completedToday - 2) % followUpMessages.length];

  useEffect(() => {
    if (chimePlayed.current) return;
    chimePlayed.current = true;
    playCompletionChime();
  }, []);

  async function shareCard() {
    const title = "My Randomword streak";
    const shareText = "I completed a one-minute speaking round and reached a " + streak + "-day streak on Randomword!";
    const shareData = { title, text: shareText, url: window.location.origin };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("");
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText + " " + window.location.origin);
        setShareStatus("Your progress link is copied.");
        return;
      }
      setShareStatus("Sharing is not available in this browser.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("Could not share right now. Please try again.");
    }
  }

  return (
    <>
    <Fireworks />
    <aside className={styles.card} role="dialog" aria-modal="false" aria-live="polite" aria-labelledby="streak-card-title" aria-describedby="streak-card-message">
      <button className={styles.dismiss} type="button" onClick={onClose} aria-label="Close streak card">×</button>
      <div className={styles.heading}>
        <span className={styles.sparkle} aria-hidden="true">✦</span>
        <div>
          <p className={styles.eyebrow}>{firstCompletionToday ? "TODAY'S STREAK" : "ANOTHER ROUND"}</p>
          <h2 id="streak-card-title">{firstCompletionToday ? `${streak} ${streak === 1 ? "day" : "days"} in a row!` : "You are building real confidence."}</h2>
          <p className={styles.message} id="streak-card-message">{message}</p>
        </div>
      </div>
      {firstCompletionToday && (
        <>
        <div className={styles.actions}>
          <button className={styles.download} type="button" onClick={() => downloadCard(streak, completedToday, message)}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2.5v9m0 0 3.5-3.5M10 11.5 6.5 8M3.5 13v3.5h13V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Download card
          </button>
          <button className={styles.share} type="button" onClick={shareCard}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7 10.5 13.5 7M7 9.5l6.5 3.5M6 12.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0-9a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 4.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Share
          </button>
        </div>
        <p className={styles.shareStatus} aria-live="polite">{shareStatus}</p>
        </>
      )}
    </aside>
    </>
  );
}
