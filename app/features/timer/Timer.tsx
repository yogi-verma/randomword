import { useEffect, useRef, useState } from "react";
import { getWordDefinition } from "../speaking-practice/wordDefinitions";
import { recordOneMinuteCompletion } from "../speaking-practice/dailyStreak";
import StreakCelebration from "../speaking-practice/StreakCelebration";
import styles from "./Timer.module.css";

type TimerProps = {
  open: boolean;
  closing: boolean;
  running: boolean;
  seconds: number;
  speechMinutes: number;
  formattedTime: string;
  activeCue: number;
  timerProgress: number;
  word: string;
  isInterview?: boolean;
  awaitingReadyToSpeak?: boolean;
  onReadyToSpeak?: () => void;
  onClose: () => void;
};

export default function TimerFeature({ open, closing, running, seconds, speechMinutes, formattedTime, activeCue, timerProgress, word, isInterview = false, awaitingReadyToSpeak = false, onReadyToSpeak, onClose }: TimerProps) {
  const [hintOpen, setHintOpen] = useState(false);
  const [celebration, setCelebration] = useState<ReturnType<typeof recordOneMinuteCompletion> | null>(null);
  const hintInteracted = useRef(false);
  const completionHandled = useRef(false);

  useEffect(() => {
    if (!open) {
      completionHandled.current = false;
      return;
    }
    if (seconds > 0) {
      completionHandled.current = false;
      return;
    }
    if (speechMinutes !== 1 || completionHandled.current) return;

    completionHandled.current = true;
    setCelebration(recordOneMinuteCompletion());
  }, [open, seconds, speechMinutes]);

  useEffect(() => {
    if (!open) return;
    hintInteracted.current = false;

    let closeHintTimeout: number | undefined;
    const revealHintTimeout = window.setTimeout(() => {
      if (hintInteracted.current) return;
      setHintOpen(true);
      closeHintTimeout = window.setTimeout(() => setHintOpen(false), 3000);
    }, 3000);

    return () => {
      window.clearTimeout(revealHintTimeout);
      if (closeHintTimeout !== undefined) window.clearTimeout(closeHintTimeout);
    };
  }, [open, word]);

  if (!open) return null;

  const hint = getWordDefinition(word) ?? "Definition not mapped for this word yet.";
  const closeTimer = () => {
    setCelebration(null);
    setHintOpen(false);
    onClose();
  };

  return (
    <div className={`timer-overlay${closing ? " timer-overlay-closing" : ""} ${styles.timerFeature}`} role="presentation">
      <section className={`timer-screen${closing ? " timer-screen-closing" : ""}${isInterview ? " interview-timer" : ""}`} role="dialog" aria-modal="true" aria-label={isInterview ? "Interview practice timer" : "Speaking timer"}>
        <div className="timer-modal-shell">
          <div className="timer-modal-content">
            <div className="timer-topic-block">
              <div className="timer-topic-label-row">
                <span className="timer-topic-label">{isInterview ? "INTERVIEW QUESTION" : "YOUR WORD"}</span>
              </div>
              <div className="timer-topic-title-row">
                <h2 className="timer-topic">{word}</h2>
                {!isInterview && <button className={`timer-help-button${hintOpen ? " timer-help-open" : ""}`} type="button" aria-label={hintOpen ? "Hide word definition" : "Show word definition"} aria-expanded={hintOpen} aria-controls="timer-speaking-idea" onClick={() => { hintInteracted.current = true; setHintOpen((value) => !value); }}>
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5"/><path d="M8.45 7.55a1.65 1.65 0 1 1 2.7 1.27c-.68.55-1.15.87-1.15 1.93m0 2.15h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </button>}
              </div>
              {!isInterview && <div id="timer-speaking-idea" className={`timer-help-bubble${hintOpen ? " timer-help-visible" : ""}`} role="status" aria-live="polite">{hint}</div>}
            </div>
            <div className="timer-cues" aria-label={isInterview ? "STAR answer structure" : "Speaking structure"}>{(isInterview ? ["Situation", "Task", "Action + result"] : ["What?", "So what?", "Now what?"]).map((cue, index) => <div key={cue} aria-current={activeCue === index ? "step" : undefined} className={`timer-cue${activeCue === index && seconds > 0 ? " cue-active" : ""}${activeCue > index || seconds === 0 ? " cue-complete" : ""}`}><span className="cue-number">{activeCue > index || seconds === 0 ? "✓" : `0${index + 1}`}</span><span>{cue}</span></div>)}</div>
            <div className="stopwatch-wrap">
              <div
                className="stopwatch-ring"
                style={{ background: `conic-gradient(var(--stopwatch-accent) ${timerProgress * 360}deg, var(--stopwatch-track) ${timerProgress * 360}deg 360deg)` }}
              >
                <div className="stopwatch-face">
                  <span className={`stopwatch-time${seconds === 0 ? " time-complete" : ""}`} aria-live="polite">{formattedTime}</span>
                  <span className="stopwatch-state">{seconds === 0 ? "COMPLETE" : running ? "TIME TO SPEAK" : "PAUSED"}</span>
                </div>
              </div>
            </div>
            <p className="cue-hint"><span>{seconds === 0 ? "Beautifully done. You showed up and spoke." : isInterview ? <>Shape your answer with <strong>STAR</strong>: Situation, Task, Action, Result.</> : ["Set the scene. What is it?", "Explore why it matters to you.", "Where could the idea lead?"][activeCue]}</span></p>
            <div className={`timer-screen-actions${awaitingReadyToSpeak ? " timer-ready-actions" : ""}`}>
              {awaitingReadyToSpeak && <button className="timer-ready-button" type="button" onClick={onReadyToSpeak}>Ready to Speak <span aria-hidden="true">→</span></button>}
              <button className="timer-end-button" onClick={closeTimer}>Close</button>
            </div>
          </div>
        </div>
      </section>
      {celebration && <StreakCelebration {...celebration} onClose={() => setCelebration(null)} />}
    </div>
  );
}
