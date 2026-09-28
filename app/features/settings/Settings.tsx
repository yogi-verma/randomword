import { useEffect, useRef, useState } from "react";
import styles from "./Settings.module.css";
import type { RingtoneOption, RingtoneStyle } from "./settings.types";

const ringtoneOptions: RingtoneOption[] = [
  { id: "wheel", name: "Wheel clicks", description: "Crisp, mechanical ticks", icon: "⟲" },
  { id: "bell", name: "Bright bell", description: "Clear and lively", icon: "♬" },
  { id: "wood", name: "Wood taps", description: "Warm, muted knocks", icon: "▧" },
  { id: "digital", name: "Digital pulse", description: "A modern little beep", icon: "⌁" },
  { id: "soft", name: "Soft chime", description: "Gentle and mellow", icon: "✧" },
];

type SettingsProps = {
  open: boolean;
  draftMinutes: number;
  draftResearchMinutes: number;
  soundOn: boolean;
  draftRingtone: RingtoneStyle;
  onClose: () => void;
  onMinutesChange: (minutes: number) => void;
  onResearchMinutesChange: (minutes: number) => void;
  onSoundToggle: () => void;
  onRingtoneChange: (ringtone: RingtoneStyle) => void;
  onPreview: (ringtone: RingtoneStyle) => void;
  onDone: () => void;
};

export default function SettingsFeature({ open, draftMinutes, draftResearchMinutes, soundOn, draftRingtone, onClose, onMinutesChange, onResearchMinutesChange, onSoundToggle, onRingtoneChange, onPreview, onDone }: SettingsProps) {
  const [ringtoneOpen, setRingtoneOpen] = useState(false);
  const ringtoneRef = useRef<HTMLDivElement>(null);
  const selectedRingtone = ringtoneOptions.find((option) => option.id === draftRingtone) ?? ringtoneOptions[0];
  const closeSettings = () => {
    setRingtoneOpen(false);
    onClose();
  };
  const finishSettings = () => {
    setRingtoneOpen(false);
    onDone();
  };

  useEffect(() => {
    if (!open || !ringtoneOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!ringtoneRef.current?.contains(event.target as Node)) setRingtoneOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRingtoneOpen(false);
    };
    window.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, ringtoneOpen]);

  if (!open) return null;

  return (
    <div className={`modal-backdrop ${styles.settingsFeature}`} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSettings(); }}>
      <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="modal-heading"><div><span className="modal-kicker">MAKE IT YOURS</span><h2 id="settings-title">Your settings</h2></div><button className="modal-close" aria-label="Close settings" onClick={closeSettings}><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></button></div>

        <div className="setting-row timer-setting">
          <div className="setting-copy"><span className="setting-icon timer-setting-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M12 9v4l2.5 1.5M9 2.5h6M12 2.5v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span><strong>Speaking timer</strong><small>Set your time to speak · 1–10 min</small></span></div>
          <div className="minute-stepper"><button onClick={() => onMinutesChange(Math.max(1, draftMinutes - 1))} disabled={draftMinutes <= 1} aria-label="Decrease speaking timer by one minute">−</button><span><strong>{draftMinutes}</strong><small>min</small></span><button onClick={() => onMinutesChange(Math.min(10, draftMinutes + 1))} disabled={draftMinutes >= 10} aria-label="Increase speaking timer by one minute">+</button></div>
        </div>
        <div className="setting-divider" />
        <div className="setting-row timer-setting">
          <div className="setting-copy"><span className={`setting-icon ${styles.researchIcon}`}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 7h8M8 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></span><span><strong>Research timer</strong><small>Set your time to explore · 10–30 min</small></span></div>
          <div className="minute-stepper"><button onClick={() => onResearchMinutesChange(Math.max(10, draftResearchMinutes - 1))} disabled={draftResearchMinutes <= 10} aria-label="Decrease research timer by one minute">−</button><span><strong>{draftResearchMinutes}</strong><small>min</small></span><button onClick={() => onResearchMinutesChange(Math.min(30, draftResearchMinutes + 1))} disabled={draftResearchMinutes >= 30} aria-label="Increase research timer by one minute">+</button></div>
        </div>
        <div className="setting-divider" />

        <div className="setting-row sound-setting"><div className="setting-copy"><span className="setting-icon sound-setting-icon"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M15 9a4 4 0 0 1 0 6m2.5-8.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></span><span><strong>Sound effects</strong><small>Spin sounds and timer ticks.</small></span></div><button className={`${styles.soundSwitch} ${soundOn ? styles.soundSwitchOn : ""}`} onClick={onSoundToggle} role="switch" aria-checked={soundOn} aria-label="Sound effects"><span className={styles.switchKnob}><span className={styles.switchGlyph}>{soundOn ? "✓" : "×"}</span></span></button></div>

        <div className="ringtone-control">
          <div className="ringtone-heading"><strong>Spin ringtone</strong><small>Choose a sound that feels right.</small></div>
          <div className={styles.ringtonePicker} ref={ringtoneRef}>
            <button className={`${styles.ringtoneTrigger} ${ringtoneOpen ? styles.ringtoneTriggerOpen : ""}`} type="button" aria-haspopup="listbox" aria-expanded={ringtoneOpen} onClick={() => setRingtoneOpen((value) => !value)}>
              <span className={styles.ringtoneIcon}>{selectedRingtone.icon}</span>
              <span className={styles.ringtoneSelectedCopy}><strong>{selectedRingtone.name}</strong><small>{selectedRingtone.description}</small></span>
              <svg className={`${styles.ringtoneChevron} ${ringtoneOpen ? styles.ringtoneChevronOpen : ""}`} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {ringtoneOpen && <div className={styles.ringtoneMenu} role="listbox" aria-label="Choose a spin ringtone">{ringtoneOptions.map((option) => <button key={option.id} className={`${styles.ringtoneChoice} ${draftRingtone === option.id ? styles.ringtoneChoiceSelected : ""}`} type="button" role="option" aria-selected={draftRingtone === option.id} onClick={() => { onRingtoneChange(option.id); onPreview(option.id); setRingtoneOpen(false); }}><span className={styles.ringtoneIcon}>{option.icon}</span><span className={styles.ringtoneChoiceCopy}><strong>{option.name}</strong><small>{option.description}</small></span>{draftRingtone === option.id && <span className={styles.ringtoneCheck}>✓</span>}</button>)}</div>}
          </div>
        </div>
        <button className="done-button" onClick={finishSettings}>Done <span>↗</span></button>
      </section>
    </div>
  );
}
