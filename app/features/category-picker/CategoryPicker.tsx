import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./CategoryPicker.module.css";

const categoryIconNames: Record<string, string> = {
  Everything: "sparkles",
  General: "compass",
  "Personal Finance": "wallet",
  Entrepreneurship: "lightbulb",
  Startups: "rocket",
  "Tech / AI": "cpu",
  Fitness: "dumbbell",
  Nutrition: "apple",
  Productivity: "checklist",
  History: "landmark",
  Literature: "book",
  Creativity: "palette",
  "Everyday life": "home",
  "Big questions": "question",
  "Creator Economy": "video",
  "Climate & Energy": "leaf",
  Gaming: "gamepad",
  Wellness: "heart",
  "Pop Culture": "sparkles",
  "Internet Culture": "globe",
  "Science & Space": "atom",
  "Fashion & Design": "hanger",
};

const categoryIconColors: Record<string, string> = {
  Everything: "#8ba9ff",
  General: "#829cf5",
  "Personal Finance": "#39b982",
  Entrepreneurship: "#e4a94f",
  Startups: "#f07c5c",
  "Tech / AI": "#5b9df4",
  Fitness: "#ef766e",
  Nutrition: "#59b979",
  Productivity: "#a38aef",
  History: "#c99b4c",
  Literature: "#d983a4",
  Creativity: "#b27ce7",
  "Everyday life": "#42b6a8",
  "Big questions": "#62b4e2",
  "Creator Economy": "#d879b6",
  "Climate & Energy": "#56af82",
  Gaming: "#8c84ed",
  Wellness: "#e67e98",
  "Pop Culture": "#e0a949",
  "Internet Culture": "#4eb9cb",
  "Science & Space": "#70a1ed",
  "Fashion & Design": "#d783a4",
};

const iconShapes: Record<string, ReactNode> = {
  sparkles: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/></>,
  compass: <><circle cx="12" cy="12" r="9"/><path d="m15.7 8.3-2.1 5.3-5.3 2.1 2.1-5.3 5.3-2.1Z"/></>,
  wallet: <><rect x="3" y="6" width="18" height="14" rx="2.5"/><path d="M3 9V6.5A2.5 2.5 0 0 1 5.5 4H18M15 13h6v4h-6a2 2 0 0 1 0-4Z"/><path d="M16.8 15h.01"/></>,
  lightbulb: <><path d="M9 18h6m-5 3h4m-5-6.5a7 7 0 1 1 6 0c-.8.5-1 1.1-1 2.5h-4c0-1.4-.2-2-1-2.5Z"/><path d="M12 2v1m8 7h-1M5 10H4m13.7-5.7-.7.7M7 17l-.7.7"/></>,
  rocket: <><path d="M5 14c-1.8 1.3-2.5 3.3-2.5 5.5C4.7 19.5 6.7 18.8 8 17M9 15l-2-2c1.5-4.5 5-8 11-10 0 6-2.5 10.5-7 12l-2-2Z"/><circle cx="14.5" cy="7.5" r="1.4"/><path d="m7 13-3-.5 2-3 3-.5m4 7 .5 3 3-2 .5-3"/></>,
  cpu: <><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 9h6v6H9zM9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/></>,
  dumbbell: <><path d="M6 9v6m12-6v6M3 10v4m18-4v4M6 12h12M3 12h3m12 0h3"/></>,
  apple: <><path d="M12 8c-2-3-6-2-7 1-1.5 4.5 1.5 11 5 11 1 0 1.3-.7 2-.7s1 .7 2 .7c3.5 0 6.5-6.5 5-11-1-3-5-4-7-1Z"/><path d="M12 8c0-3 1.5-5 4-5m-5 5C9 6 7 5 5.5 5"/></>,
  checklist: <><path d="M9 6h11M9 12h11M9 18h11M3.5 6l1.2 1.2L7 4.8m-3.5 7.4 1.2 1.2L7 10.8m-3.5 7.4 1.2 1.2L7 16.8"/></>,
  landmark: <><path d="m3 9 9-6 9 6M4 10h16M5 20h14M3 22h18M7 10v9m5-9v9m5-9v9"/></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5v-12Z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8m-8 4h6"/></>,
  palette: <><path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.5-3.3 1.8 1.8 0 0 1 1.4-3h1A3.9 3.9 0 0 0 21 10.8C21 6.5 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="15" cy="7.5" r="1"/></>,
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-7h6v7"/></>,
  question: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 1 1 4.6 1.7c-1.1 1.1-2.1 1.4-2.1 3.3m0 3h.01"/></>,
  video: <><rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/><path d="m8 9 4 3-4 3V9Z"/></>,
  leaf: <><path d="M20.5 3.5C11 3 5 6 5 12.5A5.5 5.5 0 0 0 10.5 18C17 18 20 12 20.5 3.5Z"/><path d="M4 21c2-6 6-9 12-12"/></>,
  gamepad: <><path d="M7 8h10a5 5 0 0 1 4.8 6.4l-.8 2.8a2.5 2.5 0 0 1-4.2 1.1L14.5 16h-5l-2.3 2.3A2.5 2.5 0 0 1 3 17.2l-.8-2.8A5 5 0 0 1 7 8Z"/><path d="M8 11v4m-2-2h4m6-.5h.01m2 2h.01"/></>,
  heart: <><path d="M20.8 8.8c0 5.4-8.8 11-8.8 11s-8.8-5.6-8.8-11A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"/><path d="M3.5 12h4l2-3 3.1 6 2-3h5.9"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17M12 3a14 14 0 0 1 0 18m0-18a14 14 0 0 0 0 18"/></>,
  atom: <><circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="9" ry="4"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)"/></>,
  hanger: <><path d="M12 5a2 2 0 1 0-2-2m2 2v3l8.5 7a1.5 1.5 0 0 1-1 2.7H4.5a1.5 1.5 0 0 1-1-2.7L12 8"/></>,
};

function CategoryIcon({ category }: { category: string }) {
  const icon = categoryIconNames[category] ?? "sparkles";
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: categoryIconColors[category] ?? "#8ba9ff" }}>{iconShapes[icon]}</svg>;
}

type CategoryPickerProps = {
  category: string;
  categories: string[];
  onChange: (category: string) => void;
};

export default function CategoryPicker({ category, categories, onChange }: CategoryPickerProps) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className={`category-picker ${styles.categoryPickerFeature}`} ref={pickerRef}>
      <button className={`category-trigger${open ? " picker-open" : ""}`} type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={`Topic category: ${category}`} onClick={() => setOpen((value) => !value)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); if (event.key === "ArrowDown" && !open) { event.preventDefault(); setOpen(true); } }}>
        <span className={`category-icon ${styles.categoryIcon}`}><CategoryIcon category={category} /></span><span className="category-current">{category}</span><svg className="select-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4.5 6 3.5 3.5L11.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && <div className={`category-menu ${styles.categoryMenu}`} role="listbox" aria-label="Choose a topic category">{categories.map((item) => <button key={item} type="button" role="option" aria-selected={category === item} className={`category-option${category === item ? " selected" : ""}`} onClick={() => { onChange(item); setOpen(false); }}><span className={`category-icon ${styles.categoryIcon}`}><CategoryIcon category={item} /></span><span className="category-option-copy"><span>{item}</span></span>{category === item && <span className="category-check">✓</span>}</button>)}</div>}
    </div>
  );
}
