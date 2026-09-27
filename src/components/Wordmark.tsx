import styles from './Wordmark.module.css'

/** The bezel ring: NOIR's "O" and the brand's single recurring sign. */
export function BezelRing({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="42.5" fill="none" stroke="currentColor" strokeWidth="11" />
      {/* 12 o'clock index cut into the ring */}
      <rect x="47.25" y="2" width="5.5" height="19" fill="var(--signal-mark, currentColor)" />
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`${styles.mark} ${className}`} role="img" aria-label="NOIR">
      <span aria-hidden="true">N</span>
      <BezelRing className={styles.ring} />
      <span aria-hidden="true">IR</span>
    </span>
  )
}
