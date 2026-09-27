"use client";

import { useEffect, useRef, useState } from "react";

const topics: Record<string, string[]> = {
  Everything: ["A tiny act of courage", "The last bookstore on Earth", "A rule you would happily break", "A perfect Sunday", "The case for doing nothing", "A conversation with your future self", "Something worth learning slowly", "An unexpectedly good day", "The art of starting over", "A world without maps", "A meal that feels like home", "The best advice you ignored"],
  General: ["A tiny act of courage", "The last bookstore on Earth", "A rule you would happily break", "A perfect Sunday", "The case for doing nothing", "A conversation with your future self", "Something worth learning slowly", "An unexpectedly good day", "The art of starting over", "A world without maps"],
  Technology: ["Should your phone have a bedtime?", "A world with no passwords", "When robots get bored", "The best invention still to come", "Would you let AI write your diary?", "A day without the internet", "Technology that brings us closer", "Your favorite piece of software", "The case for a slower web", "One app you would invent"],
  Finance: ["What does being rich really mean?", "The first thing you would do with a windfall", "Is renting freedom?", "A purchase you never regretted", "The value of a boring budget", "Money lessons worth passing on", "Would you rather have time or money?", "The best investment is...", "A world without price tags", "What is worth paying more for?"],
  Creativity: ["Make the ordinary feel magical", "An idea that arrived in the shower", "What if buildings could move?", "Design a holiday for no reason", "Your life as a movie trailer", "A color that does not exist", "The most useful useless invention", "Tell a story about a missing button", "A museum of everyday things", "The joy of making a mess"],
  "Everyday life": ["Your ideal morning, in detail", "A small hill you will die on", "The best thing about getting older", "A stranger you still remember", "An underrated household object", "The last thing that made you laugh", "A habit you would like to keep", "Your neighborhood as a person", "The best kind of weather", "A sound that takes you somewhere"],
  "Big questions": ["Can you be brave without fear?", "What makes a good life?", "Is change always progress?", "What do we owe the future?", "Can a place miss you back?", "What does it mean to pay attention?", "Would you choose certainty or possibility?", "When is enough enough?", "Can you really know another person?", "What makes something beautiful?"],
};

const categories = Object.keys(topics);
type RingtoneStyle = "wheel" | "bell" | "wood" | "digital" | "soft";
const ringtoneOptions: { id: RingtoneStyle; name: string; description: string; icon: string }[] = [
  { id: "wheel", name: "Wheel clicks", description: "Crisp, mechanical ticks", icon: "⟲" },
  { id: "bell", name: "Bright bell", description: "Clear and lively", icon: "♬" },
  { id: "wood", name: "Wood taps", description: "Warm, muted knocks", icon: "▧" },
  { id: "digital", name: "Digital pulse", description: "A modern little beep", icon: "⌁" },
  { id: "soft", name: "Soft chime", description: "Gentle and mellow", icon: "✧" },
];
const categoryIcons: Record<string, { icon: string; tint: string }> = {
  Everything: { icon: "✦", tint: "gold" },
  General: { icon: "☀", tint: "peach" },
  Technology: { icon: "⌘", tint: "blue" },
  Finance: { icon: "↗", tint: "green" },
  Creativity: { icon: "✳", tint: "pink" },
  "Everyday life": { icon: "♡", tint: "rose" },
  "Big questions": { icon: "∞", tint: "violet" },
};

export default function Home() {
  const [category, setCategory] = useState("Everything");
  const [mode, setMode] = useState<"cuff" | "research">("cuff");
  const [word, setWord] = useState("A tiny act of courage");
  const [spinning, setSpinning] = useState(false);
  const [spinAnimationMs, setSpinAnimationMs] = useState(190);
  const [seconds, setSeconds] = useState(60);
  const [speechMinutes, setSpeechMinutes] = useState(1);
  const [draftMinutes, setDraftMinutes] = useState(1);
  const [running, setRunning] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerClosing, setTimerClosing] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [ringtoneStyle, setRingtoneStyle] = useState<RingtoneStyle>("wheel");
  const [draftRingtone, setDraftRingtone] = useState<RingtoneStyle>("wheel");
  const [rounds, setRounds] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [themeLoaded, setThemeLoaded] = useState(false);
  const previousWord = useRef(word);
  const categoryRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("randomword-theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    setThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (themeLoaded) window.localStorage.setItem("randomword-theme", theme);
  }, [theme, themeLoaded]);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!categoryRef.current?.contains(event.target as Node)) setCategoryOpen(false);
    };
    window.addEventListener("pointerdown", closeOnOutsideClick);
    return () => window.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

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
    const pool = topics[category];
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

  const startTimer = () => {
    if (!running && seconds === 0) setSeconds(speechMinutes * 60);
    setTimerClosing(false);
    setTimerOpen(true);
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
    <main className={`stage theme-${theme}`}>
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Randomword home"><span className="brand-mark" aria-hidden="true"><span className="brand-orbit"><span className="brand-orbit-r">r</span><span className="brand-orbit-w">w</span></span></span><span>randomword<span className="brand-cool">.cool</span></span></a>
        <div className="header-actions">
          {/* <span className="header-link">A little practice goes a long way <span aria-hidden="true">✦</span></span> */}
          <button className={`theme-button theme-toggle${theme === "light" ? " is-light" : ""}`} onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} aria-pressed={theme === "light"} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            <span className="theme-toggle-icon theme-sun" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7"/><path d="M12 2.8v2m0 14.4v2m9.2-9.2h-2m-14.4 0h-2m15.7-6.5-1.4 1.4M6.9 17.1l-1.4 1.4m13 0-1.4-1.4m-10.2-10L5.5 5.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg></span>
            <span className="theme-toggle-icon theme-moon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M19.2 15.3A8 8 0 0 1 8.7 4.8a8 8 0 1 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="m17.2 3.5.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4Z" fill="currentColor"/></svg></span>
            <span className="theme-toggle-thumb" aria-hidden="true" />
          </button>
        </div>
      </header>

      <section className="practice" id="home">
        <div className="eyebrow"><span className="eyebrow-line" /> THE ONE-MINUTE SPEAKING GYM <span className="eyebrow-line" /></div>
        <div className="controls">
          <div className="mode-switch" role="group" aria-label="Speaking mode">
            <button className={mode === "cuff" ? "mode active" : "mode"} onClick={() => setMode("cuff")}><span className="mode-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.7"/><path d="M6.5 11a5.5 5.5 0 0 0 11 0M12 16.5V21m-3 0h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg></span> Off the cuff</button>
            <button className={mode === "research" ? "mode active" : "mode"} onClick={() => setMode("research")}><span className="mode-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2" stroke="currentColor" strokeWidth="1.65"/><path d="m15.1 15.1 4.1 4.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="m10.5 7.5.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z" fill="currentColor"/></svg></span> Deep research</button>
          </div>
          <p className="mode-hint">{mode === "cuff" ? "Minimal prep. Trust your first thought." : "Take a breath. Think it through, then speak."}</p>
          <div className="category-picker" ref={categoryRef}>
            <button className={`category-trigger${categoryOpen ? " picker-open" : ""}`} type="button" aria-haspopup="listbox" aria-expanded={categoryOpen} aria-label={`Topic category: ${category}`} onClick={() => setCategoryOpen((open) => !open)} onKeyDown={(event) => { if (event.key === "Escape") setCategoryOpen(false); if (event.key === "ArrowDown" && !categoryOpen) { event.preventDefault(); setCategoryOpen(true); } }}>
              <span className={`category-icon tint-${categoryIcons[category].tint}`}>{categoryIcons[category].icon}</span><span className="category-current">{category}</span><svg className="select-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4.5 6 3.5 3.5L11.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {categoryOpen && <div className="category-menu" role="listbox" aria-label="Choose a topic category">{categories.map((item) => <button key={item} type="button" role="option" aria-selected={category === item} className={`category-option${category === item ? " selected" : ""}`} onClick={() => { setCategory(item); setCategoryOpen(false); }}><span className={`category-icon tint-${categoryIcons[item].tint}`}>{categoryIcons[item].icon}</span><span className="category-option-copy"><span>{item}</span><small>{item === "Everything" ? "A little bit of everything" : item === "Big questions" ? "Ideas worth exploring" : `${item} prompts`}</small></span>{category === item && <span className="category-check">✓</span>}</button>)}</div>}
          </div>
        </div>

        <div className="word-area" aria-live="polite" aria-atomic="true">
          <div className="word-label"><span className={spinning ? "live-dot spinning-dot" : "live-dot"} />{spinning ? "FINDING YOUR NEXT WORD" : running ? "YOU’RE ON THE CLOCK" : rounds > 0 ? "YOUR NEXT THOUGHT" : "YOUR FIRST PROMPT"}</div>
          <div className={`word-display${spinning ? " word-spinning" : ""}`} style={{ "--spin-duration": `${spinAnimationMs}ms` } as React.CSSProperties} key={word}>{word}</div>
        </div>

        <div className="actions">
          <button className="spin-button" onClick={spin} disabled={spinning}><span className="spin-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M20 7v5h-5M4.8 9a7.5 7.5 0 0 1 12.8-2L20 9M4 17v-5h5m10.2 3a7.5 7.5 0 0 1-12.8 2L4 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span>{spinning ? "Spinning…" : "Spin for a word"}</span></button>
          <button className={`timer-button${running ? " timer-running" : ""}`} onClick={startTimer} disabled={spinning}><span className="timer-symbol" aria-hidden="true">{running ? <svg viewBox="0 0 24 24" fill="none"><path d="M8 6v12m8-12v12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg> : <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.7"/><path d="M12 9v4l2.5 1.5M9 2.5h6M12 2.5v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>}</span><span>{running ? formattedTime : seconds < speechMinutes * 60 && seconds > 0 ? `Resume · ${formattedTime}` : seconds === 0 ? `Start again · ${speechMinutes} min` : `Start ${speechMinutes} min timer`}</span></button>
          <button className="settings-button" onClick={() => { setDraftMinutes(speechMinutes); setDraftRingtone(ringtoneStyle); setShowSettings(true); }} aria-label="Open settings" aria-haspopup="dialog"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.5 7h15M4.5 17h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="9" cy="7" r="2.2" fill="var(--bg)" stroke="currentColor" strokeWidth="1.6"/><circle cx="15" cy="17" r="2.2" fill="var(--bg)" stroke="currentColor" strokeWidth="1.6"/></svg></button>
        </div>
        {showSettings && (
          <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowSettings(false); }}>
            <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
              <div className="modal-heading"><div><span className="modal-kicker">MAKE IT YOURS</span><h2 id="settings-title">Your settings</h2></div><button className="modal-close" aria-label="Close settings" onClick={() => setShowSettings(false)}><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></button></div>
              <div className="setting-row timer-setting"><div className="setting-copy"><span className="setting-icon timer-setting-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M12 9v4l2.5 1.5M9 2.5h6M12 2.5v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span><strong>Speaking timer</strong><small>Choose how long you want to speak.</small></span></div><div className="minute-stepper"><button onClick={() => setDraftMinutes((value) => Math.max(1, value - 1))} disabled={draftMinutes <= 1} aria-label="Decrease timer by one minute">−</button><span><strong>{draftMinutes}</strong><small>min</small></span><button onClick={() => setDraftMinutes((value) => Math.min(10, value + 1))} disabled={draftMinutes >= 10} aria-label="Increase timer by one minute">+</button></div></div>
              <div className="setting-divider" />
              <div className="setting-row sound-setting"><div className="setting-copy"><span className="setting-icon sound-setting-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M15 9a4 4 0 0 1 0 6m2.5-8.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></span><span><strong>Sound effects</strong><small>Play a soft chime when you spin.</small></span></div><button className={`sound-toggle${soundOn ? " sound-on" : ""}`} onClick={() => setSoundOn(!soundOn)} role="switch" aria-checked={soundOn} aria-label="Sound effects"><span /></button></div>
              <div className="ringtone-control"><div className="ringtone-heading"><strong>Spin ringtone</strong><small>Choose the sound that feels right.</small></div><div className="ringtone-options" role="radiogroup" aria-label="Spin ringtone">{ringtoneOptions.map((option) => <button key={option.id} type="button" role="radio" aria-checked={draftRingtone === option.id} className={`ringtone-option${draftRingtone === option.id ? " ringtone-selected" : ""}`} onClick={() => { setDraftRingtone(option.id); ring(0, option.id); }}><span className="ringtone-option-icon">{option.icon}</span><span className="ringtone-option-copy"><strong>{option.name}</strong><small>{option.description}</small></span>{draftRingtone === option.id && <span className="ringtone-check">✓</span>}</button>)}</div></div>
              <button className="done-button" onClick={() => { setSpeechMinutes(draftMinutes); setRingtoneStyle(draftRingtone); if (!running) setSeconds(draftMinutes * 60); setShowSettings(false); }}>Done <span>↗</span></button>
            </section>
          </div>
        )}

      </section>

      {timerOpen && <div className={`timer-overlay${timerClosing ? " timer-overlay-closing" : ""}`} role="presentation"><section className={`timer-screen${timerClosing ? " timer-screen-closing" : ""}`} role="dialog" aria-modal="true" aria-label="Speaking timer"><div className="timer-modal-shell"><header className="timer-modal-header"><div className="timer-session-label"><span className="session-pulse" /> SPEAKING SESSION</div><button className="timer-dismiss-button" onClick={closeTimer} aria-label="Close timer"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></button></header><div className="timer-modal-content"><div className="timer-topic-block"><span className="timer-topic-label">YOUR PROMPT</span><h2 className="timer-topic">{word}</h2></div><div className="timer-cues" aria-label="Speaking structure">{["What?", "So what?", "Now what?"].map((cue, index) => <div key={cue} aria-current={activeCue === index ? "step" : undefined} className={`timer-cue${activeCue === index && seconds > 0 ? " cue-active" : ""}${activeCue > index || seconds === 0 ? " cue-complete" : ""}`}><span className="cue-number">{activeCue > index || seconds === 0 ? "✓" : `0${index + 1}`}</span><span>{cue}</span></div>)}</div><div className="stopwatch-wrap"><svg className="stopwatch-dial" viewBox="0 0 256 256" aria-hidden="true"><circle className="stopwatch-track" cx="128" cy="128" r="112"/><circle className="stopwatch-progress" cx="128" cy="128" r="112" style={{ strokeDasharray: timerCircumference, strokeDashoffset: timerCircumference * (1 - timerProgress) }}/><circle className="stopwatch-cap" cx="128" cy="16" r="4" style={{ opacity: seconds > 0 ? 1 : 0 }}/></svg><div className="stopwatch-face"><span className={`stopwatch-time${seconds === 0 ? " time-complete" : ""}`} aria-live="polite">{formattedTime}</span><span className="stopwatch-state">{seconds === 0 ? "COMPLETE" : running ? "TIME TO SPEAK" : "PAUSED"}</span></div></div><p className="cue-hint">{seconds === 0 ? "Beautifully done. You showed up and spoke." : ["Set the scene. What is it?", "Explore why it matters to you.", "Where could the idea lead?"][activeCue]}</p><div className="timer-screen-actions">{seconds > 0 ? <button className="timer-pause-button" onClick={() => setRunning((value) => !value)}><span className="pause-icon">{running ? "Ⅱ" : "▶"}</span>{running ? "Pause" : "Resume"}</button> : <button className="timer-pause-button" onClick={() => { setSeconds(speechMinutes * 60); setRunning(true); }}><span className="pause-icon">↻</span>Another round</button>}<button className="timer-end-button" onClick={closeTimer}>End session</button></div></div></div></section></div>}

    </main>
  );
}
