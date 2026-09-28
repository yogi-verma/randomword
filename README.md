# randomword.cool

**A prompt. A minute. No preparation.**

randomword.cool is a lightweight speaking-practice app for building confidence, clarity, and quick thinking. Choose a practice mode, spin for a prompt, and start speaking—no account or setup required.

## Practice modes

### Off the Cuff

Pick a topic category and spin for a single-word prompt. Speak from your first thought, with an optional timer to keep each round focused.

Categories include General, Personal Finance, Entrepreneurship, Startups, Tech / AI, Fitness, Nutrition, Productivity, History, Literature, Creativity, Everyday Life, Big Questions, Creator Economy, Climate & Energy, Gaming, Wellness, Pop Culture, Internet Culture, Science & Space, and Fashion & Design.

### Deep Research

Spin for a word drawn from all categories, then take a focused research session before speaking. Choose a research duration from 10 to 30 minutes. When you finish, the app opens a one-minute speaking round for your word.

### Interview

Practice with 50 curated behavioral interview questions. Spin to choose a question, then answer it in a fixed one-minute round. The timer offers a simple **STAR** structure: Situation, Task, and Action + Result.

## Features

- Responsive interface for desktop, tablet, and mobile screens
- Dark and light themes
- Animated prompt spin with synchronized sound effects
- Five selectable spin sounds, plus controls to mute sound effects
- Speaking timer settings from 1 to 10 minutes
- Research timer settings from 10 to 30 minutes
- Optional word definitions in speaking sessions
- Accessible controls and reduced-motion support
- No sign-up, account, or backend required

## Run locally

### Requirements

- Node.js and npm

### Setup

```bash
git clone https://github.com/yogi-verma/randomword.git
cd randomword
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```text
app/
├── features/
│   ├── category-picker/       # Topic category selector
│   ├── interview-mode/        # Behavioral interview question bank
│   ├── research-session/      # Timed research experience
│   ├── settings/              # Timer, sound, and ringtone preferences
│   ├── speaking-practice/     # Main modes, prompt bank, and spin flow
│   ├── theme-toggle/          # Dark/light theme control
│   └── timer/                 # Speaking timer experience
├── guide/                     # Search-friendly speaking-practice guide
├── globals.css                # Global styles and design tokens
├── layout.tsx                 # App metadata and root layout
└── page.tsx                   # Home page
```

The app is built with [Next.js](https://nextjs.org/), React, TypeScript, CSS Modules, and Tailwind CSS. Browser Web Audio APIs generate the optional spin and timer sounds; the app does not need audio files or a server-side audio service.

## Search visibility

The app includes descriptive page metadata, canonical URLs, website/application structured data, a guide page, and generated `robots.txt` and `sitemap.xml` routes. The production site URL defaults to the Vercel deployment and can be changed with `NEXT_PUBLIC_SITE_URL` when a custom domain is connected.

To add Google Search Console ownership verification, set `GOOGLE_SITE_VERIFICATION` to the token supplied by Search Console, then redeploy. Submit `/sitemap.xml` in Search Console after the site is live. Search Console verification and indexing requests require access to the Google account that owns the property; adding a sitemap does not guarantee indexing or rankings.

Copy `.env.example` to `.env.local` for local overrides.

## Privacy

Practice works without creating an account. Theme preference is saved in the browser; prompts and timer sessions are handled in the page and are not sent to an application backend.

## Production

Build the app with `npm run build` and serve it with `npm run start`, or deploy the repository to a Next.js-compatible host such as [Vercel](https://vercel.com/).
