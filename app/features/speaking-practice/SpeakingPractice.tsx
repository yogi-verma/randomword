"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SpeakingPractice.module.css";
import TimerFeature from "../timer/Timer";
import SettingsFeature from "../settings/Settings";
import CategoryPicker from "../category-picker/CategoryPicker";
import type { RingtoneStyle } from "../settings/settings.types";
import ResearchSession from "../research-session/ResearchSession";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import { allCategoryPrompts, categories, topics } from "./topicBank";
import { behavioralQuestions } from "../interview-mode/behavioralQuestions";


export default function SpeakingPractice() {
  const [category, setCategory] = useState("Everything");
  const [mode, setMode] = useState<"cuff" | "research" | "interview">("cuff");
  const [word, setWord] = useState("Time");
  const [spinning, setSpinning] = useState(false);
  const [spinAnimationMs, setSpinAnimationMs] = useState(190);
  const [seconds, setSeconds] = useState(60);
  const [speechMinutes, setSpeechMinutes] = useState(1);
  const [draftMinutes, setDraftMinutes] = useState(1);
  const [researchMinutes, setResearchMinutes] = useState(10);
  const [draftResearchMinutes, setDraftResearchMinutes] = useState(10);
  const [running, setRunning] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerClosing, setTimerClosing] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [ringtoneStyle, setRingtoneStyle] = useState<RingtoneStyle>("wheel");
  const [draftRingtone, setDraftRingtone] = useState<RingtoneStyle>("wheel");
  const [rounds, setRounds] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [themeLoaded, setThemeLoaded] = useState(false);
  const previousWord = useRef(word);
  const audioContextRef = useRef<AudioContext | null>(null);
  const secondsRef = useRef(seconds);
  secondsRef.current = seconds;

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("randomword-theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    setThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (themeLoaded) window.localStorage.setItem("randomword-theme", theme);
  }, [theme, themeLoaded]);

  useEffect(() => {
    if (!showSettings) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSettings(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showSettings]);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [running, seconds]);

  useEffect(() => {
    if (!timerOpen || !running || !soundOn || secondsRef.current <= 0) return;

    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = audioContextRef.current ?? new AudioContextClass();
    audioContextRef.current = context;
    if (context.state === "suspended") void context.resume();

    let tickCount = 0;
    let active = true;
    const playTick = () => {
      if (!active || secondsRef.current <= 0) return;
      const start = context.currentTime + 0.01;
      const isTick = tickCount++ % 2 === 0;
      const duration = 0.026;
      const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let index = 0; index < samples.length; index += 1) {
        const decay = 1 - index / samples.length;
        samples[index] = (Math.random() * 2 - 1) * decay ** 3;
      }

      // A brief filtered impact gives the dry, mechanical click of a clock escapement.
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      source.buffer = buffer;
      filter.type = "bandpass";
      filter.frequency.value = isTick ? 3100 : 2350;
      filter.Q.value = 1.1;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(isTick ? 0.2 : 0.16, start + 0.0015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      source.start(start);
      source.stop(start + duration);
    };

    if (context.state === "running") playTick();
    const interval = window.setInterval(playTick, 1000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [timerOpen, running, soundOn]);

  useEffect(() => {
    if (seconds === 0) setRunning(false);
  }, [seconds]);

  const ring = (progress: number, style: RingtoneStyle = ringtoneStyle, tickGapMs = 110) => {
    if (!soundOn) return;
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = audioContextRef.current ?? new AudioContextClass();
      audioContextRef.current = ctx;
      if (ctx.state === "suspended") void ctx.resume();
      const start = ctx.currentTime + 0.02;
      const playTone = (frequency: number, duration: number, volume: number, type: OscillatorType, endFrequency = frequency) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, start);
        if (endFrequency !== frequency) osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFrequency), start + duration * 0.7);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration + 0.01);
      };
      if (style === "wheel" || style === "wood") {
        const duration = Math.min(style === "wheel" ? 0.055 : 0.085, tickGapMs / 1000 * 0.78);
        const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
        const samples = buffer.getChannelData(0);
        for (let index = 0; index < samples.length; index += 1) samples[index] = (Math.random() * 2 - 1) * (1 - index / samples.length) ** 3;
        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        source.buffer = buffer;
        filter.type = style === "wheel" ? "bandpass" : "lowpass";
        filter.frequency.value = style === "wheel" ? 2100 - progress * 700 : 850 - progress * 260;
        filter.Q.value = style === "wheel" ? 1.1 : 0.7;
        gain.gain.setValueAtTime(style === "wheel" ? 0.62 : 0.48, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start(start);
      } else if (style === "bell") {
        const toneDuration = Math.min(0.2, tickGapMs / 1000 * 0.9);
        playTone(960 - progress * 220, toneDuration, 0.12, "sine");
        playTone(1440 - progress * 300, toneDuration * 0.7, 0.04, "sine");
      } else if (style === "digital") {
        playTone(940 - progress * 390, Math.min(0.065, tickGapMs / 1000 * 0.76), 0.09, "square", 720 - progress * 280);
      } else {
        playTone(620 - progress * 150, Math.min(0.16, tickGapMs / 1000 * 0.9), 0.12, "sine", 520 - progress * 120);
      }
    } catch { /* Sound is an optional enhancement. */ }
  };

  const ringComplete = () => {
    if (!soundOn) return;
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = audioContextRef.current ?? new AudioContextClass();
      audioContextRef.current = ctx;
      if (ctx.state === "suspended") void ctx.resume();
      const start = ctx.currentTime;
      [0, 0.19, 0.4].forEach((offset, index) => {
        const fundamental = [880, 1108.73, 1318.51][index];
        [[fundamental, 0.2], [fundamental * 2.01, 0.045]].forEach(([frequency, volume]) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(frequency, start + offset);
          gain.gain.setValueAtTime(0.0001, start + offset);
          gain.gain.exponentialRampToValueAtTime(volume, start + offset + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.58);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start + offset);
          osc.stop(start + offset + 0.6);
        });
      });
    } catch { /* Completion sound is an optional enhancement. */ }
  };

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const pool: readonly string[] = mode === "interview" ? behavioralQuestions : mode === "research" ? allCategoryPrompts : topics[category];
    const available = pool.filter((item) => item !== previousWord.current);
    const next = available[Math.floor(Math.random() * available.length)];
    const passingWords = pool.filter((item) => item !== next);
    const fastDuration = 2000 + Math.random() * 1000;
    const slowDuration = 3000;
    const spinDuration = fastDuration + slowDuration;
    const spinStartedAt = performance.now();
    const tick = () => {
      const elapsed = performance.now() - spinStartedAt;
      if (elapsed >= spinDuration) {
        setWord(next);
        setSpinAnimationMs(190);
        ringComplete();
        previousWord.current = next;
        setSpinning(false);
        setSeconds(speechMinutes * 60);
        setRunning(false);
        setRounds((value) => value + 1);
        return;
      }
      const progress = Math.max(0, Math.min(1, (elapsed - fastDuration) / slowDuration));
      const delay = elapsed < fastDuration ? 75 + Math.random() * 20 : 82 + 430 * progress ** 2.6;
      setWord(passingWords[Math.floor(Math.random() * passingWords.length)]);
      setSpinAnimationMs(Math.max(42, Math.min(360, delay * 0.72)));
      ring(progress, ringtoneStyle, delay);
      window.setTimeout(tick, Math.min(delay, spinDuration - elapsed));
    };
    tick();
  };

  const changeMode = (nextMode: "cuff" | "research" | "interview") => {
    setMode(nextMode);
    if (nextMode === "interview") {
      const available = behavioralQuestions.filter((item) => item !== previousWord.current);
      const next = available[Math.floor(Math.random() * available.length)];
      setWord(next);
      previousWord.current = next;
      setSpeechMinutes(1);
      setSeconds(60);
      setRunning(false);
      return;
    }
    if (nextMode === "cuff" && mode === "interview") {
      const prompts = topics[category];
      const available = prompts.filter((item) => item !== previousWord.current);
      const next = available[Math.floor(Math.random() * available.length)];
      setWord(next);
      previousWord.current = next;
    }
    if (nextMode === "research" && mode !== "research") {
      const prompts = allCategoryPrompts;
      const available = prompts.filter((item) => item !== previousWord.current);
      const next = available[Math.floor(Math.random() * available.length)];
      setWord(next);
      previousWord.current = next;
    }
  };

  const unlockAudio = () => {
    if (!soundOn) return;
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = audioContextRef.current ?? new AudioContextClass();
      audioContextRef.current = context;
      if (context.state === "suspended") void context.resume();
    } catch { /* Timer sounds are an optional enhancement. */ }
  };

  const startTimer = () => {
    unlockAudio();
    if (!running && seconds === 0) setSeconds(speechMinutes * 60);
    setTimerClosing(false);
    setTimerOpen(true);
    setRunning(true);
  };

  const startInterviewTimer = () => {
    unlockAudio();
    setSpeechMinutes(1);
    setSeconds(60);
    setTimerClosing(false);
    setTimerOpen(true);
    setRunning(true);
  };

  const startResearch = () => {
    setResearchOpen(true);
  };

  const completeResearch = () => {
    setResearchOpen(false);
    setSpeechMinutes(1);
    setSeconds(60);
    setTimerClosing(false);
    setTimerOpen(true);
    unlockAudio();
    setRunning(true);
  };

  const closeTimer = () => {
    if (timerClosing) return;
    setTimerClosing(true);
    setRunning(false);
    window.setTimeout(() => {
      setTimerOpen(false);
      setTimerClosing(false);
    }, 480);
  };

  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const timerDuration = speechMinutes * 60;
  const timerProgress = Math.max(0, Math.min(1, (timerDuration - seconds) / timerDuration));
  const activeCue = Math.min(2, Math.floor(timerProgress * 3));
  const timerCircumference = 2 * Math.PI * 112;

  return (
    <main className={`${styles.practiceFeature} stage theme-${theme}`}>
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />
      <header className="topbar">
        <div className="brand-stack">
          <a className="brand" href="#home" aria-label="Randomword home"><span className="brand-mark" aria-hidden="true"><span className="brand-orbit"><span className="brand-orbit-r">r</span><span className="brand-orbit-w">w</span></span></span><span>randomword<span className="brand-cool">.cool</span></span></a>
          <div className="creator-credit"><a className="creator-instagram" href="https://www.instagram.com/its_yogiii_22/" target="_blank" rel="noreferrer" aria-label="Open Instagram profile: its_yogiii_22" title="Instagram"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="2.5" width="15" height="15" rx="4.5" stroke="currentColor" strokeWidth="1.6"/><circle cx="10" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.6"/><circle cx="14.8" cy="5.5" r=".9" fill="currentColor"/></svg></a></div>
        </div>
        <div className="header-actions">
          <a className="practice-guide-link" href="/guide"><span className="guide-link-wide">Practice guide</span><span className="guide-link-compact">Guide</span></a>
          <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
        </div>
      </header>

      <section className={`practice mode-${mode}`} id="home">
        <div className="eyebrow"><span className="eyebrow-line" /> {mode === "cuff" ? "THE ONE-MINUTE SPEAKING GYM" : mode === "interview" ? "THE ONE-MINUTE INTERVIEW GYM" : "THINK IT THROUGH, THEN SPEAK"} <span className="eyebrow-line" /></div>
        <div className="controls">
          <div className={`mode-switch mode-${mode}`} role="group" aria-label="Speaking mode">
            <button className={mode === "cuff" ? "mode active" : "mode"} onClick={() => changeMode("cuff")}><span className="mode-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.7"/><path d="M6.5 11a5.5 5.5 0 0 0 11 0M12 16.5V21m-3 0h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg></span><span className="mode-label">Off the cuff</span></button>
            <button className={mode === "research" ? "mode active" : "mode"} onClick={() => changeMode("research")}><span className="mode-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2" stroke="currentColor" strokeWidth="1.65"/><path d="m15.1 15.1 4.1 4.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="m10.5 7.5.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z" fill="currentColor"/></svg></span><span className="mode-label">Deep research</span></button>
            <button className={mode === "interview" ? "mode active" : "mode"} onClick={() => changeMode("interview")}><span className="mode-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 18.5V6.8A2.8 2.8 0 0 1 7.8 4h8.4A2.8 2.8 0 0 1 19 6.8v6.4a2.8 2.8 0 0 1-2.8 2.8H9l-4 2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M8.5 8.5h7M8.5 12h4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></span><span className="mode-label">Interview</span></button>
          </div>
          <p className="mode-hint">{mode === "cuff" ? "No prep. Follow your first thought wherever it goes." : mode === "interview" ? "One question. One minute. Practice your next great answer." : "Explore the word. Find an angle before you speak."}</p>
          {mode === "cuff" && <CategoryPicker category={category} categories={categories} onChange={setCategory} />}
        </div>

        <div className="word-area" aria-live="polite" aria-atomic="true">
          <div className="word-label"><span className={spinning ? "live-dot spinning-dot" : "live-dot"} />{mode === "interview" ? `BEHAVIORAL QUESTION` : spinning ? "FINDING YOUR NEXT WORD" : running ? "YOU’RE ON THE CLOCK" : rounds > 0 ? "YOUR NEXT THOUGHT" : "YOUR FIRST WORD"}</div>
          <div className={`word-display${spinning ? " word-spinning" : ""}${mode === "interview" ? " interview-question" : ""}`} style={{ "--spin-duration": `${spinAnimationMs}ms` } as React.CSSProperties} key={word}>{word}</div>
        </div>

        <div className="actions">
          <button className="spin-button" onClick={spin} disabled={spinning}><span className="spin-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M20 7v5h-5M4.8 9a7.5 7.5 0 0 1 12.8-2L20 9M4 17v-5h5m10.2 3a7.5 7.5 0 0 1-12.8 2L4 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span>{spinning ? "Spinning…" : mode === "interview" ? "Spin for a question" : "Spin for a word"}</span></button>
          {mode !== "research" ? (
            <button className={`timer-button${running ? " timer-running" : ""}`} onClick={mode === "interview" ? startInterviewTimer : startTimer} disabled={spinning}><span className="timer-symbol" aria-hidden="true">{running ? <svg viewBox="0 0 24 24" fill="none"><path d="M8 6v12m8-12v12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg> : <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.7"/><path d="M12 9v4l2.5 1.5M9 2.5h6M12 2.5v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>}</span><span>{mode === "interview" ? (running ? formattedTime : "Start 1 min timer") : running ? formattedTime : seconds < speechMinutes * 60 && seconds > 0 ? `Resume · ${formattedTime}` : seconds === 0 ? `Start again · ${speechMinutes} min` : `Start ${speechMinutes} min timer`}</span></button>
          ) : (
            <button className="timer-button" onClick={startResearch} disabled={spinning}><span className="timer-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.2" stroke="currentColor" strokeWidth="1.7"/><path d="m15.1 15.1 4.1 4.1M10.5 7.7v5.6m-2.8-2.8h5.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg></span><span>Start {researchMinutes} min research</span></button>
          )}
          <button className="settings-button" onClick={() => { setDraftMinutes(speechMinutes); setDraftResearchMinutes(researchMinutes); setDraftRingtone(ringtoneStyle); setShowSettings(true); }} aria-label="Open settings" aria-haspopup="dialog"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.5 7h15M4.5 17h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="9" cy="7" r="2.2" fill="var(--bg)" stroke="currentColor" strokeWidth="1.6"/><circle cx="15" cy="17" r="2.2" fill="var(--bg)" stroke="currentColor" strokeWidth="1.6"/></svg></button>
        </div>
        <SettingsFeature
          open={showSettings}
          draftMinutes={draftMinutes}
          draftResearchMinutes={draftResearchMinutes}
          soundOn={soundOn}
          draftRingtone={draftRingtone}
          onClose={() => setShowSettings(false)}
          onMinutesChange={setDraftMinutes}
          onResearchMinutesChange={setDraftResearchMinutes}
          onSoundToggle={() => setSoundOn((value) => !value)}
          onRingtoneChange={setDraftRingtone}
          onPreview={(style) => ring(0, style)}
          onDone={() => {
            setSpeechMinutes(draftMinutes);
            setResearchMinutes(draftResearchMinutes);
            setRingtoneStyle(draftRingtone);
            if (!running) setSeconds(draftMinutes * 60);
            setShowSettings(false);
          }}
        />

      </section>

      <ResearchSession
        open={researchOpen}
        minutes={researchMinutes}
        word={word}
        theme={theme}
        onDone={completeResearch}
        onClose={() => setResearchOpen(false)}
      />

      <TimerFeature
        open={timerOpen}
        closing={timerClosing}
        running={running}
        seconds={seconds}
        speechMinutes={speechMinutes}
        formattedTime={formattedTime}
        activeCue={activeCue}
        timerProgress={timerProgress}
        timerCircumference={timerCircumference}
        word={word}
        isInterview={mode === "interview"}
        onClose={closeTimer}
        onToggle={() => { if (!running) unlockAudio(); setRunning((value) => !value); }}
        onRestart={() => { unlockAudio(); setSeconds(speechMinutes * 60); setRunning(true); }}
      />

    </main>
  );
}
