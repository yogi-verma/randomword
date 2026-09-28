import type { Metadata } from "next";
import styles from "./Guide.module.css";
import { siteUrl } from "../site";
import GuideThemeFrame from "./GuideThemeFrame";

export const metadata: Metadata = {
  title: "English Speaking & Communication Practice Guide",
  description: "A practical guide to daily English speaking practice, communication skills, impromptu speaking, and behavioral interview answers with randomword.cool.",
  alternates: { canonical: "/guide" },
  openGraph: {
    title: "English Speaking & Communication Practice Guide | randomword.cool",
    description: "Build a simple speaking habit with one-minute prompts, topic practice, and a STAR interview answer structure.",
    url: `${siteUrl}/guide`,
    type: "article",
  },
};

export default function PracticeGuidePage() {
  return (
    <GuideThemeFrame>
      <header className={styles.header}>
        <a className={styles.brand} href="/" aria-label="randomword.cool home">randomword<span>.cool</span></a>
        <a className={styles.backLink} href="/">← Back to practice</a>
      </header>

      <article className={styles.article}>
        <p className={styles.kicker}>THE RANDOMWORD.COOL PRACTICE GUIDE</p>
        <h1>Free English speaking &amp; communication practice</h1>
        <p className={styles.lede}>
          Speaking clearly is a skill you build by using it. randomword.cool gives you a simple way to practise English speaking, organize your thoughts, and get comfortable talking without a script—one prompt at a time.
        </p>
        <a className={styles.primaryLink} href="/">Start a one-minute practice <span aria-hidden="true">→</span></a>

        <section className={styles.section}>
          <h2>How to practise speaking in one minute</h2>
          <p>Choose a mode, spin for a prompt, and start speaking. You do not need to prepare a perfect answer. Try to explain one clear idea, support it with an example, and finish with what you learned or what you would do next.</p>
          <ol className={styles.steps}>
            <li><strong>Pick a prompt.</strong> Choose a topic, a random word, or a behavioral interview question.</li>
            <li><strong>Start talking.</strong> Use the timer to keep the round focused and practise speaking under a little pressure.</li>
            <li><strong>Reflect briefly.</strong> Notice one thing that felt clear and one thing you want to improve next time.</li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2>Three ways to build communication skills</h2>
          <div className={styles.modeGrid}>
            <article className={styles.modeCard}>
              <span className={styles.modeNumber}>01</span>
              <h3>Off the Cuff</h3>
              <p>Spin a single-word prompt from areas such as technology, personal finance, fitness, history, creativity, and everyday life. Explain what the word brings to mind without preparation.</p>
            </article>
            <article className={styles.modeCard}>
              <span className={styles.modeNumber}>02</span>
              <h3>Deep Research</h3>
              <p>Choose a word, take 10–30 minutes to explore it, then return for a short speaking round. This helps you practise turning research into a clear explanation.</p>
            </article>
            <article className={styles.modeCard}>
              <span className={styles.modeNumber}>03</span>
              <h3>Interview Practice</h3>
              <p>Work through 50 behavioral interview questions in one-minute rounds. Use the STAR structure—Situation, Task, Action, Result—to keep an example organized.</p>
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Make English speaking practice a small daily habit</h2>
          <p>Consistency is easier when the exercise is short. Try one prompt a day: explain a decision, describe a useful idea, or tell a concise story about a challenge. Over time, this kind of impromptu speaking practice can help you find words faster, structure your thoughts, and feel more at ease in conversations, presentations, and interviews.</p>
          <p>For a useful one-minute answer, start with the main point. Add one specific example, then close with the result or takeaway. If you lose your place, pause, take a breath, and continue—clear communication matters more than a flawless delivery.</p>
        </section>

        <section className={styles.section}>
          <h2>Frequently asked questions</h2>
          <details className={styles.faq}>
            <summary>How can I practise English speaking by myself?</summary>
            <p>Choose a topic or question, speak aloud for one minute, and listen for one thing to improve. randomword.cool provides random prompts and a timer so you can start without planning a topic first.</p>
          </details>
          <details className={styles.faq}>
            <summary>What should I talk about during a speaking exercise?</summary>
            <p>Explain what you think about the prompt, why it matters, and an example from your experience or knowledge. You can also describe a lesson, a trade-off, or a possible next step.</p>
          </details>
          <details className={styles.faq}>
            <summary>How do I structure a behavioral interview answer?</summary>
            <p>Use STAR: briefly set the Situation and Task, explain the Action you took, and end with the Result. Keep the focus on your own decisions and contribution.</p>
          </details>
          <details className={styles.faq}>
            <summary>Is randomword.cool free to use?</summary>
            <p>Yes. You can open the practice tool and start a round without creating an account.</p>
          </details>
        </section>

        <div className={styles.bottomCta}>
          <p>Ready to get a thought moving?</p>
          <a className={styles.primaryLink} href="/">Try randomword.cool <span aria-hidden="true">→</span></a>
        </div>
      </article>
    </GuideThemeFrame>
  );
}
