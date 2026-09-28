import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Reduced motion leaves every scene in its final, static state, so contrast is
// measured on what readers actually see rather than mid-animation opacity.
test.use({ reducedMotion: 'reduce' })

test('no WCAG 2.1 AA violations, including colour contrast', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('status')).toHaveCount(0, { timeout: 45_000 })
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const summary = results.violations.map((v) => `${v.id}: ${v.nodes.slice(0, 5).map((n) => n.target.join(' ')).join(' | ')}`)
  expect(summary).toEqual([])
})
