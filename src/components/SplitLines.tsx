import type { ReactNode } from 'react'

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'

/**
 * Display copy authored line by line. Each line is masked so it can rise into
 * place; the full sentence stays one readable string for assistive tech.
 */
export function SplitLines({
  lines,
  as = 'span',
  className,
  lineClassName = '',
  ...rest
}: {
  lines: ReactNode[]
  as?: Tag
  className?: string
  lineClassName?: string
} & Record<string, unknown>) {
  const Tag = as as 'div'
  return (
    <Tag className={className} {...rest}>
      {lines.map((l, i) => (
        <span key={i} className={`line ${lineClassName}`}>
          <span className="line__inner" data-line>
            {l}
            {i < lines.length - 1 ? ' ' : null}
          </span>
        </span>
      ))}
    </Tag>
  )
}
