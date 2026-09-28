import SpeakingPractice from "./features/speaking-practice/SpeakingPractice";
import { siteUrl } from "./site";

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "randomword.cool",
        url: siteUrl,
        description: "A free tool for English speaking practice, communication skills, and interview answer practice.",
      },
      {
        "@type": "WebApplication",
        name: "randomword.cool",
        url: siteUrl,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        description: "Practice speaking with random-word prompts, timed challenges, and behavioral interview questions.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <SpeakingPractice />
  </>;
}
