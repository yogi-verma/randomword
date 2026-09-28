import { useEffect, useRef, useState } from "react";
import { getWordDefinition } from "../speaking-practice/wordDefinitions";
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
  timerCircumference: number;
  word: string;
  isInterview?: boolean;
  onClose: () => void;
  onToggle: () => void;
  onRestart: () => void;
};

export default function TimerFeature({ open, closing, running, seconds, speechMinutes, formattedTime, activeCue, timerProgress, timerCircumference, word, isInterview = false, onClose, onToggle, onRestart }: TimerProps) {
  const [hintOpen, setHintOpen] = useState(false);
  const hintInteracted = useRef(false);

  useEffect(() => {
    if (!open) return;
    hintInteracted.current = false;
    setHintOpen(false);

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
            <div className="stopwatch-wrap"><svg className="stopwatch-dial" viewBox="0 0 256 256" aria-hidden="true"><circle className="stopwatch-track" cx="128" cy="128" r="112"/><circle className="stopwatch-progress" cx="128" cy="128" r="112" style={{ strokeDasharray: timerCircumference, strokeDashoffset: timerCircumference * (1 - timerProgress) }}/><circle className="stopwatch-cap" cx="128" cy="16" r="4" style={{ opacity: seconds > 0 ? 1 : 0 }}/></svg><div className="stopwatch-face"><span className={`stopwatch-time${seconds === 0 ? " time-complete" : ""}`} aria-live="polite">{formattedTime}</span><span className="stopwatch-state">{seconds === 0 ? "COMPLETE" : running ? "TIME TO SPEAK" : "PAUSED"}</span></div></div>
            <p className="cue-hint">{seconds === 0 ? "Beautifully done. You showed up and spoke." : isInterview ? "Shape your answer with STAR: Situation, Task, Action, Result." : ["Set the scene. What is it?", "Explore why it matters to you.", "Where could the idea lead?"][activeCue]}</p>
            <div className="timer-screen-actions">{seconds > 0 ? <button className="timer-pause-button" onClick={onToggle}><span className="pause-icon">{running ? "Ⅱ" : "▶"}</span>{running ? "Pause" : "Resume"}</button> : <button className="timer-pause-button" onClick={onRestart}><span className="pause-icon">↻</span>Another round</button>}<button className="timer-end-button" onClick={onClose}>Close</button></div>
          </div>
        </div>
      </section>
    </div>
  );
}
