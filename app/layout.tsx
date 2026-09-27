import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "randomword.cool — Find your words",
  description: "A word. A minute. No preparation. Build your communication skills one thought at a time.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
