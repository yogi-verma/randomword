import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "./site";
import { ThemeProvider } from "./features/theme-toggle/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: " RandomWord - Free English Speaking & Communication Practice",
    template: "%s | randomword.cool",
  },
  applicationName: "randomword.cool",
  description: "Practice English speaking, communication skills, and interview answers with random prompts and focused one-minute speaking challenges. Free, no account needed.",
  alternates: { canonical: "/" },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "randomword.cool",
    title: "Free English Speaking & Communication Practice | randomword.cool",
    description: "Build speaking confidence with random-word prompts, one-minute practice, and behavioral interview questions. Free, no account needed.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Free English Speaking & Communication Practice | randomword.cool",
    description: "Build speaking confidence with random prompts and one-minute practice. Free, no account needed.",
  },
  keywords: [
    "English speaking practice",
    "communication skills practice",
    "impromptu speaking practice",
    "one minute speaking challenge",
    "random word speaking prompts",
    "public speaking exercises",
    "behavioral interview practice",
    "English fluency practice",
  ],
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
