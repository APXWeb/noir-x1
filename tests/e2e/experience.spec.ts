import { test, expect, type Page } from '@playwright/test'

const collectErrors = (page: Page) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  return errors
}

async function enter(page: Page, query = '') {
  await page.goto(`/${query}`)
  await expect(page.getByRole('status')).toHaveCount(0, { timeout: 45_000 })
}

async function scrollToId(page: Page, id: string) {
  await page.evaluate((id) => {
    const el = document.getElementById(id)!
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY)
  }, id)
  await page.waitForTimeout(600)
}

test('loads, hands over from the loader and renders the stage', async ({ page }) => {
  const errors = collectErrors(page)
  await enter(page)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Precision')
  await expect(page.locator('canvas')).toHaveCount(1)
  expect(errors).toEqual([])
})

test('primary navigation scrolls to its scene', async ({ page, isMobile }) => {
  test.skip(!!isMobile, 'desktop navigation')
  await enter(page)
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Craft' }).click()
  await expect
    .poll(async () => page.evaluate(() => Math.abs(document.getElementById('craft')!.getBoundingClientRect().top)), { timeout: 8000 })
    .toBeLessThan(40)
})

test('mobile menu opens as a sheet and closes with Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only')
  await enter(page)
  const toggle = page.getByRole('button', { name: 'Open menu' })
  await toggle.click()
  await expect(page.locator('#mobile-menu')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('#mobile-menu')).toBeHidden()
})

test('material selector is a keyboard-operable radiogroup', async ({ page }) => {
  await enter(page)
  await scrollToId(page, 'materials')
  const group = page.getByRole('radiogroup')
  const titanium = group.getByRole('radio', { name: 'Titanium' })
  await expect(titanium).toHaveAttribute('aria-checked', 'true')
  await titanium.focus()
  await page.keyboard.press('ArrowRight')
  await expect(group.getByRole('radio', { name: 'Obsidian' })).toHaveAttribute('aria-checked', 'true')
  await expect(group.getByRole('radio', { name: 'Obsidian' })).toBeFocused()
  await group.getByRole('radio', { name: 'Steel' }).click()
  await expect(group.getByRole('radio', { name: 'Steel' })).toHaveAttribute('aria-checked', 'true')
})

test('explore mode opens, shows a hotspot and restores the scroll position on Escape', async ({ page }) => {
  await enter(page)
  await scrollToId(page, 'explore')
  await page.waitForTimeout(800)
  const before = await page.evaluate(() => window.scrollY)
  await page.getByRole('button', { name: 'Enter explore mode' }).click()
  const dialog = page.getByRole('dialog', { name: 'Explore the X1' })
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('button', { name: /Close/ })).toBeFocused()

  // Use the keyboard path to reveal the crown, then open its hotspot.
  const crown = dialog.getByRole('button', { name: 'Crown', exact: true })
  await expect.poll(async () => crown.evaluate((el) => el.dataset.hidden), { timeout: 8000 }).toBe('false')
  await crown.click()
  await expect(dialog.getByRole('heading', { name: 'Crown' })).toBeVisible()
  await expect(dialog).toContainText('Machined for precise tactile control')

  await page.keyboard.press('Escape') // closes the panel
  await page.keyboard.press('Escape') // closes the mode
  await expect(dialog).toHaveCount(0)
  const after = await page.evaluate(() => window.scrollY)
  expect(Math.abs(after - before)).toBeLessThan(8)
})

test('resize keeps the current scene', async ({ page, isMobile }) => {
  test.skip(!!isMobile, 'desktop resize')
  await enter(page)
  await scrollToId(page, 'materials')
  await page.waitForTimeout(1200)
  const label = page.locator('aside[aria-label="Scenes"] [aria-current="step"]')
  await expect(label).toHaveCount(1)
  const before = await label.evaluate((el) => el.textContent)
  await page.setViewportSize({ width: 1180, height: 820 })
  await page.waitForTimeout(1200)
  expect(await label.evaluate((el) => el.textContent)).toBe(before)
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test('content is visible without animation', async ({ page }) => {
    await enter(page)
    await scrollToId(page, 'craft')
    const heading = page.getByRole('heading', { name: /Engineered/ })
    await expect(heading).toBeVisible()
    const opacity = await heading.locator('[data-line]').first().evaluate((el) => getComputedStyle(el).transform)
    expect(opacity === 'none' || opacity === 'matrix(1, 0, 0, 1, 0, 0)').toBeTruthy()
  })
})

test('without WebGL the narrative falls back to rendered stills', async ({ page }) => {
  const errors = collectErrors(page)
  await enter(page, '?nowebgl')
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('img[src*="stills/pose-hero"]')).toHaveCount(1)
  expect(errors).toEqual([])
})
