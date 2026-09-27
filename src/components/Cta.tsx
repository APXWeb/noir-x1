import type { ReactNode } from 'react'
import styles from './Cta.module.css'

type Props = {
  children: ReactNode
  variant?: 'primary' | 'quiet'
  className?: string
} & (
  | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
)

/**
 * The one call-to-action form: an expanded-caps label and a hairline that
 * extends toward the action. No filled slab, no pill.
 */
export function Cta({ children, variant = 'primary', className = '', ...rest }: Props) {
  const content = (
    <>
      <span className={styles.label}>{children}</span>
      <span className={styles.rule} aria-hidden="true">
        <svg viewBox="0 0 12 12" className={styles.head}>
          <path d="M1 6h10M6.5 1.5 11 6l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </span>
    </>
  )
  const cls = `${styles.cta} ${styles[variant]} ${className}`
  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
}
