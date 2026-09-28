'use client'

import Link from 'next/link'
import styles from './not-found.module.css'
import { useTheme } from './features/theme-toggle/ThemeProvider'

export default function NotFound() {
  const { theme } = useTheme()
  return (
    <main className={`${styles.page} theme-${theme}`}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.content}>
        <Link className={styles.brand} href="/" aria-label="randomword.cool home">
          <span className={styles.brandMark} aria-hidden="true">
            <span className={styles.orbit}><span>r</span><span>w</span></span>
          </span>
          <span>randomword<span className={styles.cool}>.cool</span></span>
        </Link>

        <div className={styles.illustration} aria-hidden="true">
          <span className={styles.sparkle}>✦</span>
          <span className={styles.number}>4</span>
          <span className={styles.word}>word?</span>
          <span className={styles.number}>4</span>
          <span className={styles.smallSparkle}>✳</span>
        </div>

        <p className={styles.eyebrow}>A little off script</p>
        <h1>This page got lost for words.</h1>
        <p className={styles.description}>
          Looks like this prompt wandered away. Let’s get you back to a fresh one.
        </p>
        <Link className={styles.homeButton} href="/">
          <span aria-hidden="true">←</span> Back to the word spinner
        </Link>
        <p className={styles.code}>ERROR CODE <span>404</span></p>
      </div>
    </main>
  )
}
